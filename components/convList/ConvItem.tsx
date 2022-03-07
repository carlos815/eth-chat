import { useCurrentChat } from "../../context/currentChatContext"
import { useUserMetamask } from "../../context/userContextMetamask"

const ConvItem = ({ data }) => {
    const { name, message, timestamp, id } = data
    const { currentChat, setCurrentChat, setChatId }: any = useCurrentChat()
    const { userMetamask }: any = useUserMetamask()

    const handleClick = () => {
        //    console.log(id)
        setCurrentChat(name)
        setChatId(id)
    }

    const isActive = currentChat?.toLowerCase() === name.toLowerCase()

    const time = new Date(timestamp)
    return <button
        onClick={handleClick}
        className={` ${isActive ? "bg-slate-300" : "bg-slate-50"}`}>
        <p className="font-bold" >{name}</p>
        <p className="">{message}</p>
        <p className="text-[10px]">{time.toDateString()}</p>
    </button>
}

export default ConvItem