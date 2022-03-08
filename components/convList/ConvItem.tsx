import { useCurrentChat } from "../../context/currentChatContext"
import { useUserMetamask } from "../../context/userContextMetamask"
import { eraseWritingState } from "../../firebase/writingState"

const ConvItem = ({ data }) => {
    const { name, message, timestamp, id, unread } = data
    const { currentChat, setCurrentChat, setChatId }: any = useCurrentChat()
    const { userMetamask }: any = useUserMetamask()

    const handleClick = () => {
        setCurrentChat(name)
        setChatId(id)
        eraseWritingState(userMetamask)
        console.log(data)
    }

    const chatIsOpen = () => {

    }
    const isActive = currentChat?.toLowerCase() === name?.toLowerCase()


    const time = new Date(timestamp)
    return <button
        onClick={handleClick}
        className={` ${isActive ? "bg-slate-300" : "bg-slate-50"} ${unread !== false && "border-4 border-green-500"}`}>
        <p className="font-bold" >{name}</p>
        <p className="">{message}</p>
        <p className="text-[10px]">{time.toDateString()}</p>
    </button>
}

export default ConvItem