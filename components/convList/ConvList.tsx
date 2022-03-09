import { getDatabase, ref, onChildAdded, onValue, off, DataSnapshot } from "firebase/database";
import { useEffect, useState } from "react";
import { useCurrentChat } from "../../context/currentChatContext";
import { useUserMetamask } from "../../context/userContextMetamask";
import { onValueUnread, setRead } from "../../firebase/setUnreadMessage";
import ConvItem from "./ConvItem";

const ConvList = ({ chatList }) => {

    const [recentChatsData, setRecentsChatData] = useState<{}>({})
    const [unreadChats, setUnreadChats] = useState<{}>({})
    const { userMetamask }: any = useUserMetamask()
    const { currentChat, setCurrentChat, setChatId, chatId }: any = useCurrentChat()


    useEffect(() => {
        const db = getDatabase();

        let _chatData = {}
        Object.keys(chatList).forEach((recipientEthAddress) => {

            const messageRef = ref(db, "chats/chats/" + chatList[recipientEthAddress]);
            off(messageRef)
            onValue(messageRef, (snapshot) => {
                if (snapshot.val() == null) return
                const { message, timestamp } = snapshot.val()

                _chatData = {
                    ..._chatData, [chatList[recipientEthAddress]]: {
                        message, timestamp, name: recipientEthAddress, unread: false
                    }
                }
                setRecentsChatData({ ...recentChatsData, ..._chatData })
            })

        })
    }, [chatList])

    function sortedArrayRecentChatsData() {
        const _array = []
        Object.keys(recentChatsData).forEach((key) => {
            if (recentChatsData[key].timestamp === -1) return //Filter empty chats
            //construct the array

            _array.push({ ...recentChatsData[key], id: key, unread: unreadChats[key] !== undefined })
        })

        _array.sort((a, b) => {
            return b.timestamp - a.timestamp
        });
        return _array
    }

    return (
        <div className="flex divide-y divide-neutral-600 gap flex-col  gap-y-2 overflow-x-hidden scrollbar w-80 min-w-min">
            {sortedArrayRecentChatsData().map((chatData) => {
                return <ConvItem key={chatData.id} data={chatData} />
            })}

        </div>
    )
}

export default ConvList