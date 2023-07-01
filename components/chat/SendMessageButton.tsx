import Image from "next/image";


const SendMessageButton = ({ onClick, disabled }) => {
    return <button
        className="btn-small flex items-center gap-x-2 "
        onClick={onClick} disabled={disabled}>
        <span className="font-normal">Send</span> {
            disabled ? <Image src={"/send-disabled.svg"} width="16" height={16} alt="send-disabled" /> : <Image src={"/send.svg"} width="16" height={16} alt="send"></Image>
        }
    </button>
}

export default SendMessageButton