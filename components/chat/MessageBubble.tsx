const MessageBubble = ({ name, message, isOwnMessage, lastOfGroup, firstOfGroup, timestamp }) => {


    const date = new Date(timestamp).toTimeString().slice(0, 5)
    const header = firstOfGroup && <p className={`font-bold text-xs ${isOwnMessage ? "self-start " : "self-end "}`} >{`${name.slice(0, 99)}`}</p>
    const footer = <p className={`text-xs ${isOwnMessage ? "self-start " : "self-end "}`} >{`${date}`}</p>

    return <div className={"w-full  flex flex-col"}>
        {header}
        <div className={`bg-white m-2 rounded p-2  max-w-md ${isOwnMessage ? "self-start bg-yellow-50" : "self-end bg-green-50"} ${lastOfGroup ? "border border-black" : " "}`}>

            <p>{message !== "" ? message : "  "}</p>
        </div>

        {footer}
    </div>
}

export default MessageBubble