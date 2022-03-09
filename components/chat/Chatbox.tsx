import { Message } from "../../helpers/types"
import DateSeparator from "./DateSeparator"
import MessageBubble from "./MessageBubble"

const Chatbox = ({ allMessages, ownUserName, scrollRef }) => {

    const renderedListOfItems = () => {

        //First convert the allMessages object to an array so it's easier to work with
        const allMessagesArray = Object.keys(allMessages).map((id, index) => {
            return { ...allMessages[id], id: id }
        })


        let finalListOfItems = []

        //Loop through the array to generate the message bubbles

        allMessagesArray.forEach((messageObject: Message, index) => {

            const isLastOfGroup = (
                index == allMessagesArray.length - 1 ||
                allMessagesArray[index + 1].name !== messageObject.name) ? true : false;

            const isFirstOfGroup = (index == 0 || allMessagesArray[index - 1].name !== messageObject.name) ? true : false

            const dateOfCurrentMessage = new Date(messageObject.timestamp)
            const dateOfPreviousMessage = index == 0 ? dateOfCurrentMessage : new Date(allMessagesArray[index - 1].timestamp)

            const isFirstOfDay = () => {
                //  return true

                return dateOfCurrentMessage.toDateString() !== dateOfPreviousMessage.toDateString()
            }

            if (index == 0 || isFirstOfDay()) {
                finalListOfItems.push(<DateSeparator date={dateOfCurrentMessage} key={dateOfCurrentMessage.toISOString()}></DateSeparator>)
            }

            finalListOfItems.push(<MessageBubble name={messageObject.name} message={messageObject.message} isOwnMessage={messageObject.name == ownUserName} key={messageObject.id} lastOfGroup={isLastOfGroup} firstOfGroup={isFirstOfGroup} timestamp={messageObject.timestamp} />)

        })

        return finalListOfItems
    }


    return <div className="px-8  bg-slate-100  flex flex-col grow flex-auto  overflow-y-auto scroll-m-2.5 scroll-p-64 scrollbar  gap-y-1" ref={scrollRef}>
        {renderedListOfItems()}
    </div>
}

export default Chatbox