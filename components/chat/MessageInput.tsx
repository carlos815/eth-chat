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

    return <form className="flex flex-col   max-h-content w-full bg-neutral-700 relative" >

        <input contentEditable="true" className="peer  bg-neutral-700 border-t border-b border-neutral-600 py-6 px-8 focus:outline-none  
        " placeholder="Write a message..." onChange={handleInputChange} value={message} disabled={!userMetamask} />
        <span className=" 
            
        
        peer-focus:before:h-[2px]
        peer-focus:before:w-full
        peer-focus:before:absolute 
      peer-focus:before:bg-primary-500
        peer-focus:before:animate-grow
        
        peer-focus:before:top-0
        "></span>
        <div className="flex justify-end py-4 px-6 ">     <SendMessageButton disabled={message === ""} onClick={handleSendMessage} /></div>

    </form>

}

export default MessageInput