import { getDatabase, ref, onChildAdded, onValue, off } from "firebase/database";
import { useEffect, useState } from "react";
import { useCurrentChat } from "../../context/currentChatContext";
import ConvItem from "./ConvItem";

const ConvList = ({ chatList }) => {

    const [recentChatsData, setRecentsChatData] = useState<{}>({})

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
                        message, timestamp, name: key
                    }
                }
                //  console.log(_chatData)
                setRecentsChatData({ ...recentChatsData, ..._chatData })
            })
        })
    }, [chatList])

    function sortedArrayRecentChatsData() {
        const _array = []
        Object.keys(recentChatsData).forEach((key) => {
            if (recentChatsData[key].timestamp === -1) return //Filter empty chats
            _array.push({ ...recentChatsData[key], id: key })
        })

        _array.sort((a, b) => {

            return b.timestamp - a.timestamp
        });
        //  console.log(_array)
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