import { getDatabase, ref, onChildAdded, onValue, off, DataSnapshot } from "firebase/database";
import { useEffect, useState } from "react";
import { useCurrentChat } from "../../context/currentChatContext";
import { useUserMetamask } from "../../context/userContextMetamask";
import { onValueUnread } from "../../firebase/setUnreadMessage";
import ConvItem from "./ConvItem";

const ConvList = ({ chatList }) => {

    const [recentChatsData, setRecentsChatData] = useState<{}>({})
    const [unreadChats, setUnreadChats] = useState<{}>({})
    const { userMetamask }: any = useUserMetamask()


    useEffect(() => {
        const db = getDatabase();

        let _chatData = {}
        Object.keys(chatList).forEach((key) => {

            const messageRef = ref(db, "chats/chats/" + chatList[key]);
            off(messageRef)
            onValue(messageRef, (snapshot) => {
                if (snapshot.val() == null) return
                const { message, timestamp } = snapshot.val()

                _chatData = {
                    ..._chatData, [chatList[key]]: {
                        message, timestamp, name: key, unread: false
                    }
                }
                setRecentsChatData({ ...recentChatsData, ..._chatData })
            })
            let _data = {}
            onValueUnread(chatList[key], userMetamask, (snapshot: DataSnapshot) => {
                if (snapshot.exists()) {

                    _data = { ..._data, [chatList[key]]: { ...recentChatsData[chatList[key]], unread: false, } }

                    setUnreadChats({
                        ...unreadChats, ..._data
                    })

                    //    const isActive = currentChat?.toLowerCase() === name?.toLowerCase()


                }
            })
        })
    }, [chatList])

    function sortedArrayRecentChatsData() {
        const _array = []
        Object.keys(recentChatsData).forEach((key) => {
            if (recentChatsData[key].timestamp === -1) return //Filter empty chats
            //construct the array
            //  console.log(unreadChats[key])
            _array.push({ ...recentChatsData[key], id: key, unread: unreadChats[key] !== undefined })
        })

        _array.sort((a, b) => {
            return b.timestamp - a.timestamp
        });
        console.log(_array)
        return _array
    }

    return (
        <div className="flex flex-col  gap-y-2">
            {sortedArrayRecentChatsData().map((chatData) => {
                return <ConvItem key={chatData.id} data={chatData} />
            })}

        </div>
    )
}

export default ConvList