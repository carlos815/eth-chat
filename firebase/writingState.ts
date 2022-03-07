import { get, getDatabase, push, ref, set } from "firebase/database";



export const setIsWritingState = async (address, chatId) => {
    //save to firebase
    try {
        const db = getDatabase();
        const isWritingRef = ref(db, `chats/isWriting/${address.toLowerCase()}/${chatId}`)

        set(isWritingRef, true);
    }
    catch (e) {
        //user couln't be saved to Firebase
        console.log(e);
    }
};

export const eraseWritingState = async (address) => {
    //save to firebase
    try {
        const db = getDatabase();
        const isWritingRef = ref(db, `chats/isWriting/${address.toLowerCase()}`)
        set(isWritingRef, {});
    }
    catch (e) {
        //user couln't be saved to Firebase
        console.log(e);
    }
};

