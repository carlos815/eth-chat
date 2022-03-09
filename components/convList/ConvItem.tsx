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
        className={`flex   ${isActive ? "bg-neutral-700" : "bg-slate-50"} ${unread && "after:content-[''] after:w-2 after:h-2 after:rounded-full after:bg-negative-500 "}`}>
        <div>     <p className="font-bold" >{name}</p>
            <p className="">{message.length > 10 ? `${message.slice(0, 28)}...` : message}</p>
            <p className="text-[10px]">{time.toDateString()}</p></div>
    </button>
}

export default ConvItem