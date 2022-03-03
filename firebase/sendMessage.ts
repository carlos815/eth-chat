import { getDatabase, push, ref, update } from "firebase/database";
import { Message } from "../helpers/types";

const sendMessage = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, setMessage: Function, chatId: string, message: Message) => {
    e.preventDefault()

    const db = getDatabase();
    const key = push(ref(db, "chats/messages/" + chatId)).key

    try {
        await update(ref(db, "chats/messages/" + chatId + "/" + key), message);

      

        await update(ref(db, "chats/chats/" + chatId), { message: message.message, timestamp: message.timestamp });
        setMessage("")
        return true

    } catch (e) {
        //user couln't be saved to Firebase
        console.log(e)
        return false
    }
}

export default sendMessage