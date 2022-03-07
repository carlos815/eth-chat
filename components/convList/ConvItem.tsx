import { useCurrentChat } from "../../context/currentChatContext"

const ConvItem = ({ data }) => {
    const { name, message, timestamp } = data
    const { currentChat, setCurrentChat }: any = useCurrentChat()

    const handleClick = () => {

        setCurrentChat(name)
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