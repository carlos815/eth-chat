import Head from "next/head";
import { getDatabase, ref, set, onValue, child, get, push, query, off, onChildAdded, update } from "firebase/database";
import { useUserMetamask } from "../../context/userContextMetamask";
import { useEffect, useRef, useState } from "react";
import { getApps } from "firebase/app";
import { RequestStatus } from "../../types/requestStatus";
export interface ChatDb {
  chats?: { [key: string]: Chat };
  members?: { [key: string]: Members };
  messages?: { [key: string]: { [key: string]: Message } };
  users?: { [key: string]: User };
}

export interface Chat {
  title: string;
  lastMessage: string;
  timestamp: number;
}

export interface Members {
  [key: string]: boolean;
}


export interface Message {
  name: string;
  message: string;
  timestamp: number;
}

export interface User {
  chatsWith: { [key: string]: string }
}
export default function SSRPage({ data }) {
  const { address, profile } = data;

  const getChatRef = (_from: string, _to: string) => {
    const db = getDatabase();
    return ref(db, `chats/users/${_from.toLowerCase()}/chatsWith/${_to.toLowerCase()}`)
  }

  const [chatId, setChatId] = useState<string>("")

  const { reqStatus, userMetamask, makeUserRequest }: any = useUserMetamask()

  const createNewChat = async (from: string, to: string) => {
    //save to firebase

    try {
      const db = getDatabase();
      const userChat = await get(getChatRef(from, to));
      if (userChat === undefined) { throw Error("error") }
      if (userChat.exists()) {
        setChatId(userChat.toJSON().toString())
        //dont create a new one
      } else {
        //--Create a new chat--
        // Get a unique key
        const newKey = push(ref(db, "chats/chats")).key.slice(1, 100);
        setChatId(newKey)

        //Create a new entry in the sender's profile
        try {
          await set(getChatRef(from, to), newKey);
          await set(getChatRef(to, from), newKey);
        } catch (e) {
          //user couln't be saved to Firebase
          console.log(e);
        }
      }
    } catch (e) {
      //user couln't be saved to Firebase
      console.log(e);
    }
    console.log("createNewChat", chatId)
  };

  const isFirebaseReady = getApps().length !== 0;




  // Our custom hook to get context values
  //const { loadingUser, user } = useUser();

  const [message, setMessage] = useState<string>("")

  const [allMessages, setAllMessages] = useState<{ [key: string]: Message }>()


  function nowEpoch(): number {
    const now = new Date()
    return Date.parse(now.toString())
  }


  const sendMessage = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    const _message: Message = {
      message: message,
      name: userMetamask,
      timestamp: nowEpoch()
    }

    const db = getDatabase();
    const key = push(ref(db, "chats/messages/" + chatId)).key

    try {
      await update(ref(db, "chats/messages/" + chatId + "/" + key), _message);
      chatbox.current.scrollTo({
        top: chatbox.current.scrollHeight,

        behavior: 'smooth'
      })
      await update(ref(db, "chats/chats/" + chatId), { message: _message.message, timestamp: _message.timestamp });
      setMessage("")


    } catch (e) {
      //user couln't be saved to Firebase
      console.log(e)
    }

    // console.table(allMessages)

  }
  const readAllMessages = () => {
    console.log(allMessages)
  }

  useEffect(() => {
    if (reqStatus === RequestStatus.success) {
      // You know that the user is loaded: either logged in or out!
      console.log(userMetamask);
    }
    // You also have your firebase app initialized
  }, [reqStatus, userMetamask]);


  useEffect(() => {
    (async () => {
      createNewChat(userMetamask, address)

      if (isFirebaseReady && chatId !== "") {


        const db = getDatabase();


        const messageRef = ref(db, "chats/messages/" + chatId.toString());
        const messagesData = await get(messageRef);
        console.log("chats/messages/" + chatId.toString(), messagesData.val())
        //setAllMessages(messagesData.val)
        onValue(messageRef, (snapshot) => {
          console.log("chat updated")
          /*  snapshot.forEach((childSnapshot) => {
              console.log("child snapshot", childSnapshot.toJSON())
    
 
            })*/
          const data = snapshot.val();

          setAllMessages(data);

        })


      }
    })()

    //return off()
  }, [isFirebaseReady, chatId]);


  const chatbox = useRef(null)
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
              onClick={sendMessage} disabled={message === ""}
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
