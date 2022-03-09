import { useState } from "react";
import Web3 from "web3";
import { useCurrentChat } from "../../context/currentChatContext";
import { useUserMetamask } from "../../context/userContextMetamask";
import createNewChat from "../../firebase/createNewChat";
import BaseModal from "./baseModal";


const NewChatModal = ({ }) => {

    const { reqStatus, userMetamask, requestUser }: any = useUserMetamask()
    const [address, setAddress] = useState<string>("")
    const { currentChat, setCurrentChat, chatId, setChatId, newChatModalOpen, setNewChatModalOpen }: any = useCurrentChat()

    const [isAddress, setIsAddress] = useState<boolean>(true);


    const handleClick = (event) => {
        event.preventDefault()
        if (Web3.utils.isAddress(address)) {
            setIsAddress(true)
            createNewChat([userMetamask, address], setChatId)
            setCurrentChat(address)
            setNewChatModalOpen(false)



        } else {
            setIsAddress(false)
        }
    }

    const onChange =
        (e) => {
            setAddress(e.target.value)
            setIsAddress(true)

        }
    return <BaseModal title="New Conversation" content="Enter an Ethereum address below">
        <form className="flex flex-col gap-y-4">

            <input className="bg-neutral-500 p-2" value={address} onChange={onChange} />

            {!isAddress && <span className=" text-negative-500">Not a valid address</span>}

            <button className="hover:cursor-pointer hover:scale-105 transition-all bg-primary-600 rounded-lg px-4 py-2 font-bold text-slate-700 disabled:text-slate-300  " onClick={handleClick}>Create New Chad</button>
        </form>

    </BaseModal>
}

export default NewChatModal