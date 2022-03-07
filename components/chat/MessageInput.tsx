import { useState } from "react"
import { useCurrentChat } from "../../context/currentChatContext"
import { useUserMetamask } from "../../context/userContextMetamask"
import sendMessage from "../../firebase/sendMessage"
import nowEpoch from "../../helpers/nowEpoch"
import { Message } from "../../helpers/types"
import SendMessageButton from "./SendMessageButton"

const MessageInput = ({ onChange, onSendCallback, onErrorCallback }) => {
    const { reqStatus, userMetamask }: any = useUserMetamask()
    const [message, setMessage] = useState<string>("")
    const { currentChat, setCurrentChat, chatId, setChatId }: any = useCurrentChat()


    const handleSendMessage = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()


        const _message: Message = {
            message: message,
            name: userMetamask,
            timestamp: nowEpoch()
        }

        setMessage("")
        sendMessage(chatId, _message,
            () => {
                if (onSendCallback) onSendCallback()
            }),
            (e) => {
                if (onErrorCallback) onErrorCallback(e)
            }
    }


    return <form className="my-4 flex gap-x-5 full" >

        <input className="border-slate-300 bg-slate-100 p-2" onChange={(e) => setMessage(e.target.value)} value={message} disabled={!userMetamask} />
        <SendMessageButton disabled={message === ""} onClick={handleSendMessage} />

    </form>

}

export default MessageInput