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

export default function SSRPage({ data }) {
  const { address, profile } = data;

  const [chatId, setChatId] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [allMessages, setAllMessages] = useState<{ [key: string]: Message }>()

  const { reqStatus, userMetamask, makeUserRequest }: any = useUserMetamask()

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
          const key = snapshot.key
          const data = snapshot.val()
          newData = { ...newData, [key]: data }
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
        <h1 className="title text-3xl font-bold underline">
          Chat with {address}
        </h1>
        {reqStatus === RequestStatus.error && <div>Couln't connect ot metamask</div>}
        {reqStatus === RequestStatus.loading && <div>Requesting Metamask access</div>}
        {userMetamask ? <>
          <div className="p-3 rounded bg-slate-100 my-4 flex flex-col grow  overflow-y-auto scroll-m-2.5 scroll-p-64 scrollbar" ref={chatbox}>
            {allMessages && Object.keys(allMessages).map(function (key, index) {

              //MESSAGE BUBBLE
              const ownMessage = allMessages[key].name === userMetamask

              return <div className={`bg-white m-2 rounded p-2 w-2/3 ${ownMessage ? "self-start bg-yellow-50" : "self-end bg-green-50"}`} key={key}>
                <p className="text-xs font-light">{`${allMessages[key]?.name?.slice(0, 8)}(...)`}</p>
                <p>{allMessages[key].message !== "" ? allMessages[key].message : "  "}</p>
              </div>
            })}
          </div>
          <form className="my-4 flex gap-x-5 full" >

            <input className="border-slate-300 bg-slate-100 p-2" onChange={(e) => setMessage(e.target.value)} value={message} disabled={!userMetamask}></input>
            <button
              className="rounded bg-slate-200 border-2 border-slate-300 px-3 font-bold text-slate-700 disabled:text-slate-300"
              onClick={handleSendMessage} disabled={message === ""}
            >
              Send Message
            </button>

          </form>

        </> :
          <>  <button
            className="rounded bg-slate-200 border-2 border-slate-300 px-3 font-bold text-slate-700"
            onClick={makeUserRequest}
          >
            Request Metamask address
          </button></>
        }


      </main>
    </div>
  );
}

export const getServerSideProps = async ({ params }) => {
  const { address } = params;


  return { props: { data: { address: address } } };
};

