import { useState } from "react"
import Web3 from "web3"
import { useCurrentChat } from "../context/currentChatContext"
import { useUserMetamask } from "../context/userContextMetamask"
import createNewChat from "../firebase/createNewChat"
import { RequestStatus } from "../helpers/types"

const CreateNewChat = ({ }) => {
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


    return (
        <form className="m-8  flex gap-x-5 w-12 fixed z-20 bottom-0 left-0" >
            <div className="flex flex-col">
                <input className="bg-neutral-500 p-2" value={address} onChange={onChange} />

                {!isAddress && <span className="text-red-600">NOot a valid address</span>}
            </div>
            <button className=" border-white border-2 font-bold rounded-lg" onClick={handleClick}>Create New Chad</button>
        </form>
    )
}

export default CreateNewChat