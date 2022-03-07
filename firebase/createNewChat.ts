import { get, getDatabase, push, ref, set } from "firebase/database";



const createNewChat = async (memberAddresses: [string, string], setChatId: Function) => {
    //save to firebase
    if (memberAddresses[0] === undefined || memberAddresses[1] === undefined) return
    try {
        const db = getDatabase();
        const chatRef = ref(db, `chats/users/${memberAddresses[0].toLowerCase()}/chatsWith/${memberAddresses[1].toLowerCase()}`)
        const chatTwoRef = ref(db, `chats/users/${memberAddresses[1].toLowerCase()}/chatsWith/${memberAddresses[0].toLowerCase()}`)
        const userChat = await get(chatRef);
        //Objective_: check if user shares a chat with the person


        //First get list of all keys of chats the users are in

        /*  let chats: [] = []
          listOfMemberAddresses.forEach(async (address) => {
            const _userChats = await get(ref(db, "chats/users/" + address));
            const _chatKeys = Object.keys(_userChats.val())
            //console.log("_chats", _chatKeys)
            chats.push(_chatKeys)
    
          })
    
          console.log("chats", chats)*/

        //Find teh shortest list
        //check in members if the members of one of these lists matches tehe list of ember addresses. If theres a match, don't create a new chat
        //If there's no match create the chat

        /* const userChats = await get(ref(db, "chats/users/" + userMetamask));
         let listOfChats: [string];
         console.log(Object.keys(userChats.val()))*/
        if (userChat === undefined) { throw Error("error") }
        if (userChat.exists() && (await get(chatTwoRef)).exists()) {
            setChatId(userChat.toJSON().toString())
            //dont create a new one
        } else {
            //--Create a new chat--
            // Get a unique key
            const newKey = push(ref(db, "chats/chats")).key
            setChatId(newKey)

            //legacy code. Erase when new code is ready
            await set(chatRef, newKey);
            await set(chatTwoRef, newKey);
            //---------------------

            //new code
            // console.log("chatid", newKey)
            set(ref(db, "chats/chats/" + newKey), { message: " ", timestamp: -1 });

            memberAddresses.forEach((address) => {
                set(ref(db, "chats/members/" + newKey + "/" + address.toLowerCase()), true)
                set(ref(db, "chats/users/" + address.toLowerCase() + "/" + newKey), true)
            })


        }
    } catch (e) {
        //user couln't be saved to Firebase
        console.log(e);
    }
};

export default createNewChat