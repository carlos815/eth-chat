import { useState } from "react"
import { useCurrentChat } from "../../context/currentChatContext"
import { useUserMetamask } from "../../context/userContextMetamask"
import sendMessage from "../../firebase/sendMessage"
import { setUnreadFirebase } from "../../firebase/setUnreadMessage"
import { eraseWritingState, setIsWritingState } from "../../firebase/writingState"
import nowEpoch from "../../helpers/nowEpoch"
import { Message } from "../../helpers/types"
import SendMessageButton from "./SendMessageButton"

interface MessageInputProps {
    onSendCallback?: Function,
    onErrorCallback?: Function
}

const MessageInput = ({ onSendCallback, onErrorCallback }: MessageInputProps) => {
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
        eraseWritingState(userMetamask)
        setUnreadFirebase(chatId, currentChat)
        sendMessage(chatId, _message,
            () => {
                if (onSendCallback) onSendCallback()
            }),
            (e) => {
                if (onErrorCallback) onErrorCallback(e)
            }
    }

    const handleInputChange = (e) => {
        const formContent = e.target.value;
        if (message === "") {
            //set to writing
            setIsWritingState(userMetamask, chatId)
        }

        if (formContent === "") {
            //set to not writing
            eraseWritingState(userMetamask)
        }

        setMessage(e.target.value)
    }

    return <form className="my-4 flex gap-x-5 full" >

        <input className="border-slate-300 bg-neutral-600 p-2" onChange={handleInputChange} value={message} disabled={!userMetamask} />
        <SendMessageButton disabled={message === ""} onClick={handleSendMessage} />

    </form>

}

export default MessageInput