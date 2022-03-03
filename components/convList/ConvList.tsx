import { getDatabase, ref, onChildAdded, onValue, off } from "firebase/database";
import { useEffect, useState } from "react";
import { useCurrentChat } from "../../context/currentChatContext";
import ConvItem from "./ConvItem"

const ConvList = ({ chatList }) => {

    const [recentChatsData, setRecentsChatData] = useState({})
    const { currentChat, setCurrentChat }: any = useCurrentChat()



    useEffect(() => {
        //  console.log(chatList)
        const db = getDatabase();

        let _chatData = {}
        Object.keys(chatList).forEach((key) => {

            const messageRef = ref(db, "chats/chats/" + chatList[key]);
            off(messageRef)
            onValue(messageRef, (snapshot) => {

                if (snapshot.val().message == null) return
                const { message, timestamp } = snapshot.val()

                _chatData = {
                    ..._chatData, [chatList[key]]: {
                        message, timestamp, name: key
                    }
                }
                //  console.log({ [key]: snapshot.val() })
                setRecentsChatData({ ...recentChatsData, ..._chatData })
            })
        })


    }, [chatList])

    useEffect(() => {


    }, [recentChatsData])
    return (
        <div className="flex flex-col  gap-y-2">

            {Object.keys(recentChatsData).map((key) => {
                if (recentChatsData[key].timestamp === -1) return
                return <ConvItem key={key} data={recentChatsData[key]} />
            })}

        </div>
    )
}

export default ConvList