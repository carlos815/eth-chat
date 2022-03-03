import MessageBubble from "./MessageBubble"

const Chatbox = ({ allMessages, ownUserName, scrollRef }) => {
    return <div className="p-3 rounded bg-slate-100 my-4 flex flex-col grow  overflow-y-auto scroll-m-2.5 scroll-p-64 scrollbar max-h-[500px] min-h-[500px]" ref={scrollRef}>
        {allMessages && Object.keys(allMessages).map(function (key, index) {
            const isOwnMessage = allMessages[key].name === ownUserName
            return <MessageBubble name={allMessages[key]?.name} message={allMessages[key]?.message} isOwnMessage={isOwnMessage} key={key} />
        })}
    </div>
}

export default Chatbox