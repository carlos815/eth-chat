import { useState } from "react";
import Web3 from "web3";
import { useCurrentChat } from "../../context/currentChatContext";
import { useUserMetamask } from "../../context/userContextMetamask";
import createNewChat from "../../firebase/createNewChat";

interface ModalProps {
    title?: string,
    content?: string,
    children?: any,
    important?: boolean
}
const BaseModal = ({ title, content, children, important }: ModalProps) => {

    const { reqStatus, userMetamask, requestUser }: any = useUserMetamask()
    const [address, setAddress] = useState<string>("")
    const { currentChat, setCurrentChat, chatId, setChatId }: any = useCurrentChat()

    const [isAddress, setIsAddress] = useState<boolean>(true);


    const handleClick = (event) => {
        event.preventDefault()
        if (Web3.utils.isAddress(address)) {
            setIsAddress(true)
            console.log("BUTTON PRESS TRIGGERED")
            createNewChat([userMetamask, address], setChatId)
            setCurrentChat(address)


        } else {
            setIsAddress(false)
        }
    }

    const onChange =
        (e) => {
            setAddress(e.target.value)
            setIsAddress(true)

        }
    return <div className={`fixed top-1/2  right-1/2 -translate-y-1/2 translate-x-1/2  z-10 rounded-2xl  p-6 bg-neutral-900 flex flex-col gap-8 w-[571px] ${important && "ring-primary-500 ring-2"}`}>


        <h1 className="text-4xl font-display">{title}</h1>
        <p className="">{content}</p>

        {children}

    </div>
}

export default BaseModal