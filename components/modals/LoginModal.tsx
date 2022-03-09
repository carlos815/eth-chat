import { useState } from "react";
import Web3 from "web3";
import { useCurrentChat } from "../../context/currentChatContext";
import { useUserMetamask } from "../../context/userContextMetamask";
import createNewChat from "../../firebase/createNewChat";
import { RequestStatus } from "../../helpers/types";
import BaseModal from "./BaseModal";


const LoginModal = ({ }) => {

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



    return <BaseModal title="Welcome to ETH CHAT" content="Please login with your Metamask account" important>
        <>

            {reqStatus === RequestStatus.error && <div>Couln't connect ot metamask</div>}
            {reqStatus === RequestStatus.loading && <div>Requesting Metamask access</div>}
            <button
                className="btn"
                onClick={requestUser}
            >
                Request Metamask address
            </button></>

    </BaseModal>
}

export default LoginModal