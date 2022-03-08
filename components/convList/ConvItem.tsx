import { DataSnapshot } from "firebase/database"
import { useEffect, useState } from "react"
import { useCurrentChat } from "../../context/currentChatContext"
import { useUserMetamask } from "../../context/userContextMetamask"
import { onValueUnread, setReadFirebase, setUnreadFirebase } from "../../firebase/setUnreadMessage"
import { eraseWritingState } from "../../firebase/writingState"

const ConvItem = ({ data }) => {
    const { name, message, timestamp, id } = data
    const { currentChat, setCurrentChat, setChatId, chatId }: any = useCurrentChat()
    const { userMetamask }: any = useUserMetamask()
    const [unread, setUnread] = useState(false)
    const handleClick = () => {
        setCurrentChat(name)
        setChatId(id)
        eraseWritingState(userMetamask)
        setReadFirebase(id, userMetamask)

        // console.log("handleClick", currentChat)
    }

    const chatIsOpen = () => {

    }
    const isActive = currentChat?.toLowerCase() === name?.toLowerCase()

    useEffect(() => {

        onValueUnread(id, userMetamask, (snapshot: DataSnapshot) => {

            if (isActive) {
                console.log("this ran")
                setUnread(false)
                setReadFirebase(id, userMetamask)
                return
            }

            if (snapshot.exists()) {
                setUnread(true)
            } else {
                setUnread(false)
            }
        })
    }, [isActive])
    const time = new Date(timestamp)
    return <button
        onClick={handleClick}
        className={` ${isActive ? "bg-slate-300" : "bg-slate-50"} ${unread === true && "border-4 border-green-500"}`}>
        <p className="font-bold" >{name}</p>
        <p className="">{message.length > 10 ? `${message.slice(0, 28)}...` : message}</p>
        <p className="text-[10px]">{time.toDateString()}</p>
    </button>
}

export default ConvItem