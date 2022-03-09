const MessageBubble = ({ name, message, isOwnMessage, lastOfGroup, firstOfGroup, timestamp }) => {


    const date = new Date(timestamp).toTimeString().slice(0, 5)
    const header = firstOfGroup && <p className={`font-bold text-xs ${isOwnMessage ? "self-start " : "self-end "}`} >{`${name.slice(0, 99)}`}</p>
    const footer = <p className={`text-xs ${isOwnMessage ? "self-start " : "self-end "}`} >{`${date}`}</p>

    return <div className={"w-full  flex flex-col gap-y-1"}>
        {header}
        <div className={` rounded-2xl p-4 text-white  max-w-3xl ${isOwnMessage ? "self-start bg-neutral-600" : "self-end bg-gradient-to-l from-primary-400 to-primary-700 text-base"} ${isOwnMessage && lastOfGroup && "rounded-bl-none"} ${!isOwnMessage && lastOfGroup && "rounded-br-none"}`}>

            <p>{message !== "" ? message : "  "}</p>
        </div>

        {footer}
    </div>
}

export default MessageBubble