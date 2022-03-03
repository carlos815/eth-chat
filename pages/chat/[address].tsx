import Head from "next/head";
import { getDatabase, ref, onValue, get, onChildAdded } from "firebase/database";
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

export default function SSRPage({ data }) {
  const { address, profile } = data;

  const [chatId, setChatId] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [allMessages, setAllMessages] = useState<{ [key: string]: Message }>()

  const { reqStatus, userMetamask, requestUser }: any = useUserMetamask()

  const isFirebaseReady = getApps().length !== 0;

  const chatbox = useRef(null)

  const handleSendMessage = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()

    const _message: Message = {
      message: message,
      name: userMetamask,
      timestamp: nowEpoch()
    }

    sendMessage(chatId, _message,
      /*callback*/
      () => {
        setMessage("")
        scrollTotheEnd(chatbox)
      }),
      (e) => {
        /*Error callback*/
      }
  }

  useEffect(() => {
    (async () => {
      createNewChat([userMetamask, address], setChatId)

      if (isFirebaseReady && chatId !== "") {
        //create database observer to update chatbox automatically on change
        const db = getDatabase();
        const messageRef = ref(db, "chats/messages/" + chatId.toString());
        let newData = {}
        onChildAdded(messageRef, (snapshot) => {
          newData = { ...newData, [snapshot.key]: snapshot.val() }
          setAllMessages({ ...allMessages, ...newData });
          scrollTotheEnd(chatbox)
        })
      }
    })()

    //return off()
  }, [isFirebaseReady, chatId]);

  useEffect(() => {
    if (reqStatus === RequestStatus.success) {
      // You know that the user is loaded: either logged in or out!
      //  console.log(userMetamask);
    }
    // You also have your firebase app initialized
  }, [reqStatus, userMetamask]);

  return (
    <div className="container">
      <Head>
        <title>Eth chat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-3 min-h-screen max-h-screen flex flex-col ">
        {userMetamask ? <>
          <h1 className="title text-3xl font-bold underline">
            Chat with {address}
          </h1>
          <Chatbox allMessages={allMessages} ownUserName={userMetamask} scrollRef={chatbox} />
          <MessageInput message={message} disabled={!userMetamask} onChange={(e) => setMessage(e.target.value)} onClick={handleSendMessage} />
        </> :
          <Login />
        }
      </main>
    </div>
  );
}

export const getServerSideProps = async ({ params }) => {
  const { address } = params;
  return { props: { data: { address: address } } };
};

