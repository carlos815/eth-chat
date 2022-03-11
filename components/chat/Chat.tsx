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
import { useCurrentChat } from "../../context/currentChatContext";
import ChatHeader from "./ChatboxHeader";
import UserWriting from "./UserWriting";

export default function Chat() {
    const [message, setMessage] = useState<string>("")
    const [allMessages, setAllMessages] = useState<{ [key: string]: Message }>()
    const [isWriting, setIsWriting] = useState<boolean>(false)
    const { currentChat, setCurrentChat, chatId, setChatId }: any = useCurrentChat()

    const { reqStatus, userMetamask }: any = useUserMetamask()

    const isFirebaseReady = getApps().length !== 0;


    const chatbox = useRef(null)

    const [loading, setLoading] = useState<boolean>(true)

    const [prevChatId, setPrevChatId] = useState("")

    useEffect(() => {
        setAllMessages({});
        (async () => {
            setLoading(true);
            //  createNewChat([userMetamask, currentChat], setChatId)

            //  setChatId(chatId)
            //  setCurrentChat(currentChat)
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
                    setAllMessages({ ...newData });
                    scrollTotheEnd(chatbox)
                })


                //Check if user is writing

                const isWritingRef = ref(db, `chats/isWriting/${currentChat.toLowerCase()}/${chatId}`)
                off(isWritingRef)
                onValue(isWritingRef, (snapshot) => {
                    if (snapshot.val() == null) {
                        setIsWriting(false)
                    }
                    else {
                        setIsWriting(true)
                    }
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
        <div className="h-full grow flex flex-col w-full min-h-[calc(100vh-62px)] max-h-[calc(100vh-62px)]   pl-96">


            {
                !loading ? <>
                    <ChatHeader address={currentChat} username={"[Placehodler]"} />

                    <Chatbox allMessages={allMessages} ownUserName={userMetamask} scrollRef={chatbox} />
                    {isWriting && <UserWriting name={currentChat} />}
                    <MessageInput onSendCallback={
                        () => {
                            scrollTotheEnd(chatbox)
                        }
                    } /> </> : ""
            }
        </div >
    );
}
