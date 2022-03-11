import { getDatabase, push, ref, update } from "firebase/database";
import { Message } from "../helpers/types";

const sendMessage = async (chatId: string, message: Message, callback?: Function, errorCallback?: Function) => {
    const db = getDatabase();
    const key = push(ref(db, "chats/messages/" + chatId)).key

    try {
        await update(ref(db, "chats/messages/" + chatId + "/" + key), message);
        await update(ref(db, "chats/chats/" + chatId), { message: message.message, timestamp: message.timestamp });
        if (callback) callback()
    } catch (e) {
        //user couln't be saved to Firebase
        console.log(e)
        if (errorCallback) errorCallback(e)
    }
}


export default sendMessage