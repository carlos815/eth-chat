import Head from "next/head";
import { getDatabase, ref, onValue, get, onChildAdded, onChildChanged, off } from "firebase/database";
import { useUserMetamask } from "../../context/userContextMetamask";
import { useEffect, useRef, useState } from "react";
import { getApps } from "firebase/app";
import { Message, RequestStatus } from "../../helpers/types";
import createNewChat from "../../firebase/createNewChat";
import sendMessage from "../../firebase/sendMessage";
import nowEpoch from "../../helpers/nowEpoch";
import scrollTotheEnd from "../../helpers/scrollToTheEnd";
import Chatbox from "../../components/chat/Chatbox";
import MessageInput from "../../components/chat/MessageInput";
import Login from "../../components/Login";
import { useCurrentChat } from "../../context/currentChatContext";

export default function Chat() {
    const [message, setMessage] = useState<string>("")
    const [allMessages, setAllMessages] = useState<{ [key: string]: Message }>()
    const { currentChat, setCurrentChat, chatId, setChatId }: any = useCurrentChat()

    const { reqStatus, userMetamask }: any = useUserMetamask()

    const isFirebaseReady = getApps().length !== 0;


    const chatbox = useRef(null)

    const [loading, setLoading] = useState<boolean>(true)
    const handleSendMessage = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()

        const _message: Message = {
            message: message,
            name: userMetamask,
            timestamp: nowEpoch()
        }

        setMessage("")
        sendMessage(chatId, _message,
            /*callback*/
            () => {
                scrollTotheEnd(chatbox)
            }),
            (e) => {
                /*Error callback*/
            }
    }

    const [prevChatId, setPrevChatId] = useState("")

    useEffect(() => {
        setLoading(true);

        (async () => {
            //   createNewChat([userMetamask, currentChat], setChatId)
            if (isFirebaseReady && chatId !== "") {
                const db = getDatabase();
                const messageRef = ref(db, "chats/messages/" + chatId.toString());


                //Delete previous listeners if tehere are any
                off(ref(db, "chats/messages/" + prevChatId))
                setAllMessages({});

                //create database listener to update chatbox automatically on change
                let newData = {}
                await onChildAdded(messageRef, (snapshot) => {
                    newData = { ...newData, [snapshot.key]: snapshot.val() }
                    setAllMessages({ ...allMessages, ...newData });
                    scrollTotheEnd(chatbox)
                })

                setLoading(false)
                setPrevChatId(chatId.toString())
            }


        })()

    }, [isFirebaseReady, chatId, currentChat]);




    useEffect(() => {
        if (reqStatus === RequestStatus.success) {
            // You know that the user is loaded: either logged in or out!
            //  console.log(userMetamask);
        }
        // You also have your firebase app initialized
    }, [reqStatus, userMetamask]);

    return (
        <div className="h-full grow flex flex-col ">
            {!loading ? <><Chatbox allMessages={allMessages} ownUserName={userMetamask} scrollRef={chatbox} />
                <MessageInput message={message} disabled={!userMetamask} onChange={(e) => setMessage(e.target.value)} onClick={handleSendMessage} /> </> : "loading"}
        </div>
    );
}
