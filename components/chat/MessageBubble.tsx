const MessageBubble = ({ name, message, isOwnMessage }) => {
    return <div className={`bg-white m-2 rounded p-2 w-2/3 ${isOwnMessage ? "self-start bg-yellow-50" : "self-end bg-green-50"}`}>
        <p className="text-xs font-light">{`${name.slice(0, 8)}(...)`}</p>
        <p>{message !== "" ? message : "  "}</p>
    </div>
}

export default MessageBubble