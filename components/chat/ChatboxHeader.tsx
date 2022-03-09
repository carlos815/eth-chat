

const ChatHeader = ({ username, address }) => {



    return <div className="py-4 px-8 flex flex-col gap-2 bg-neutral-700">

        <h6 className="font-display font-bold">{username}</h6>
        <h2 >{address}</h2>
    </div>
}

export default ChatHeader