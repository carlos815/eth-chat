import SendMessageButton from "./SendMessageButton"

const MessageInput = ({ message, disabled, onChange, onClick }) => {

    return <form className="my-4 flex gap-x-5 full" >

        <input className="border-slate-300 bg-slate-100 p-2" onChange={onChange} value={message} disabled={disabled}></input>
        <SendMessageButton message={message} onClick={onClick} />
    </form>

}

export default MessageInput