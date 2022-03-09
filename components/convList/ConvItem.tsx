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



    const unreadBadge = "after:content-[''] after:w-[9px] after:h-[9px] after:rounded-full after:bg-negative-500 "


    return <button
        onClick={handleClick}
        className={`flex gap-x-5 items-center justify-between p-6 gap-y-12 max-w-full w-full  text-left   ${isActive ? "bg-neutral-700" : "bg-slate-50"} ${unread && unreadBadge}`}>
        <div className="flex flex-col gap-y-2 ">
            <p className="font-bold font-display text-[14px]" >{`${name.slice(0, 25)}(...)`}</p>
            <p className="">{message.length > 10 ? `${message.slice(0, 25)}...` : message}</p>
            <p className="text-xs">{time.toTimeString().slice(0, 5)}</p></div>
    </button>
}

export default ConvItem