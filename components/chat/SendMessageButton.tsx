import Image from "next/image";


const SendMessageButton = ({ onClick, disabled }) => {
    return <button
        className="btn "
        onClick={onClick} disabled={disabled}>
        <span>Send</span> <Image src={"/send.svg"} width="16" height={16}></Image>
    </button>
}

export default SendMessageButton