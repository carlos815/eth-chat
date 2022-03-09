import Image from "next/image";


const SendMessageButton = ({ onClick, disabled }) => {
    return <button
        className="hover:cursor-pointer hover:scale-105 transition-all bg-primary-600 rounded-lg px-4 py-2 font-bold text-slate-700 disabled:text-slate-300 "
        onClick={onClick} disabled={disabled}>
        <span>Send</span> <Image src={"/send.svg"} width="16" height={16}></Image>
    </button>
}

export default SendMessageButton