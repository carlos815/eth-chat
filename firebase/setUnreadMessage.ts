import { DataSnapshot, getDatabase, off, onValue, ref, set } from "firebase/database";

export const setUnreadFirebase = async (chatId: string, userId: string) => {
    const db = getDatabase();
    const unreadMessageRef = ref(db, "chats/unread/" + chatId + "/" + userId);
    try {
        await set(unreadMessageRef, true);
    } catch (e) {
        //user couln't be saved to Firebase
        console.log(e)
    }
}

export const setReadFirebase = async (chatId: string, userId: string) => {
    const db = getDatabase();
    const unreadMessageRef = ref(db, "chats/unread/" + chatId + "/" + userId);
    try {
        await set(unreadMessageRef, {});
    } catch (e) {
        //user couln't be saved to Firebase
        console.log(e)
    }
}

export const onValueUnread = async (chatId: string, userId: string, onChange: Function) => {
    //A listener for changes in a specific unread field
    const db = getDatabase();
    const unreadMessageRef = ref(db, "chats/unread/" + chatId + "/" + userId);
    try {
        await off(unreadMessageRef);
        await onValue(unreadMessageRef, (snapshot: DataSnapshot) => {
            onChange(snapshot)
        });
    } catch (e) {
        //user couln't be saved to Firebase
        console.log(e)
    }
}
/*
export const offOnValueUnread = async (chatId: string, userId: string, onChange: Function) => {
    //Unsusbscribe listener in unread field
    const db = getDatabase();
    const unreadMessageRef = ref(db, "chats/unread/" + chatId + "/" + userId);
    try {
        await off(unreadMessageRef);
    } catch (e) {
        //user couln't be saved to Firebase
        console.log(e)
    }
}*/



