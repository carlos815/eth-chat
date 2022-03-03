import { getFirestore, setDoc, doc } from "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import detectEthereumProvider from "@metamask/detect-provider";
import type { NextPage } from "next";
import { useUserMetamask } from "../context/userContextMetamask";
import { Message, RequestStatus, Chat, Member, User, ChatDb  } from "../helpers/types";
import { getDatabase, ref, set, onValue, child, get, push, query, off } from "firebase/database";
import { getApps } from "firebase/app";


const Home: NextPage = () => {
  // Our custom hook to get context values
  //const { loadingUser, user } = useUser();
  const { reqStatus, userMetamask, makeUserRequest }: any = useUserMetamask()

  const [message, setMessage] = useState<string>("")

  const [allMessages, setAllMessages] = useState([])
  const chatId = "1"


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
      await set(ref(db, "chats/messages/" + chatId + "/" + key), _message);
      await set(ref(db, "chats/chats/" + chatId), { message: _message.message, timestamp: _message.timestamp });
      console.log("message sent!")
      setMessage("")

    } catch (e) {
      //user couln't be saved to Firebase
      console.log(e)
    }

    console.table(allMessages)

  }


  useEffect(() => {
    if (reqStatus === RequestStatus.success) {
      // You know that the user is loaded: either logged in or out!
      console.log(userMetamask);
    }
    // You also have your firebase app initialized
  }, [reqStatus, userMetamask]);

  const isFirebaseReady = getApps().length !== 0;

  useEffect(() => {
    if (isFirebaseReady) {
      const db = getDatabase();
      const messageRef = ref(db, "chats/messages/" + chatId);

      onValue(messageRef, (snapshot) => {
        const data = snapshot.val();
        setAllMessages(data);
      })
    }

    //return off()
  }, [isFirebaseReady]);


  const createNewUser = async (/*chatdb: ChatDb*/) => {
    const chatId = 111


    /*const chat: Chat = {
      lastMessage: "asdf",
      title: "Whatsapp group",
      timestamp: nowEpoch()
    }

    const members: Members = {
      "0x8402B046E4609625a83D660888D2D1605348e8a8": true,
      "0x2d3f907b0cf2c7d3c2ba4cbc72971081ffcea963": true,
    }

    const m1: Message = {
      "name": "0x8402B046E4609625a83D660888D2D1605348e8a8",
      "message": "The relay seems to be malfunctioning.",
      "timestamp": nowEpoch()
    }

    const m2: Message = {
      "name": "0x8402B046E4609625a83D660888D2D1605348e8a8",
      "message": "heeeeeeeeeeeeehehehe",
      "timestamp": nowEpoch()
    }
    const m3: Message = {
      "name": "0x8402B046E4609625a83D660888D2D1605348e8a8",
      "message": "eeeeeeeeee",
      "timestamp": nowEpoch()
    }*/

    const myUser: User = {
      chatsWith: {
        "0xf7573cA736b5Cd7f520621F771776F366fD4877A": "111",
      }
    }

    const chatDb: ChatDb = {
      users: { userMetamask: myUser }
    }



    //save to firebase
    const db = getDatabase();
    try {
      await set(ref(db, 'chats/users'), { [userMetamask]: myUser });
      alert("User created!!");
    } catch (e) {
      //user couln't be saved to Firebase
      console.log(e)
    }
  }
  const getChatRef = (_from: string, _to: string) => {
    const db = getDatabase();
    return ref(db, `chats/users/${_from}/chatsWith/${_to}`)
  }

  const createNewChat = async (to: string) => {
    //save to firebase
    const db = getDatabase();
    try {
      const userChat = await get(getChatRef(userMetamask, to))

      if (userChat.exists()) {
        //dont create a new one
      } else {
        //--Create a new chat--
        // Get a unique key
        const key = push(ref(db, "chats/chats")).key

        //Create a new entry in the sender's profile 
        try {
          await set(getChatRef(userMetamask, to), key);
          await set(getChatRef(to, userMetamask), key);
        } catch (e) {
          //user couln't be saved to Firebase
          console.log(e)
        }
      }
    } catch (e) {
      //user couln't be saved to Firebase
      console.log(e)
    }
  }
  return (
    <div className="container">
      <Head>
        <title>Eth chat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-4  ">
        <h1 className="title text-3xl font-bold underline">
          Chat app
        </h1>
        {reqStatus === RequestStatus.error && <div>Couln't connect ot metamask</div>}
        {reqStatus === RequestStatus.loading && <div>Requesting Metamask access</div>}
        {userMetamask ? <>
          <div className="p-3 rounded bg-slate-100 my-4 flex flex-col ">
            {allMessages && Object.keys(allMessages).map(function (key, index) {

              //MESSAGE BUBBLE

              const ownMessage = allMessages[key].name === userMetamask

              return <div className={`bg-white m-2 rounded p-2 w-2/3 ${ownMessage ? "self-start bg-yellow-50" : "self-end bg-green-50"}`} key={key}>
                <p className="text-xs font-light">{`${allMessages[key].name.slice(0, 8)}(...)`}</p>
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

export default Home


// < p className = "description" >
//   Please press the link below after adding the user
//       </ >
// <Link href={`/profile/${profile().username}`} passHref>
//   <a>Go to SSR Page</a>
// </Link>

// const createUser = async () => {
//   await makeUserRequest()
//   if (userMetamask !== null) {
//     saveUserToFirebase(userMetamask, profile())
//   }
// }



// const saveUserToFirebase = async (username, data) => {
//   const db = getDatabase();
//   try {
//     await set(ref(db, 'profile/' + username), data);
//     alert("User created!!");
//   } catch (e) {
//     //user couln't be saved to Firebase
//     console.log(e)
//   }
// }


const createNewChat = async (/*chatdb: ChatDb*/) => {
  const chatId = 111
  const chatTitle = "whatsapp group"

  const chat: Chat = {
    lastMessage: "asdf",
    title: "Whatsapp group",
    timestamp: nowEpoch()
  }

  const members: Members = {
    "0x8402B046E4609625a83D660888D2D1605348e8a8": true,
    "0x2d3f907b0cf2c7d3c2ba4cbc72971081ffcea963": true,
  }

  const m1: Message = {
    "name": "0x8402B046E4609625a83D660888D2D1605348e8a8",
    "message": "The relay seems to be malfunctioning.",
    "timestamp": nowEpoch()
  }

  const m2: Message = {
    "name": "0x8402B046E4609625a83D660888D2D1605348e8a8",
    "message": "heeeeeeeeeeeeehehehe",
    "timestamp": nowEpoch()
  }
  const m3: Message = {
    "name": "0x8402B046E4609625a83D660888D2D1605348e8a8",
    "message": "eeeeeeeeee",
    "timestamp": nowEpoch()
  }

  const chatDb: ChatDb = {
    chats: { 111: chat },
    members: { 111: members },
    messages: { 111: { m1, m2, m3 } }
  }



  //save to firebase
  const db = getDatabase();
  try {
    await set(ref(db, 'chats'), chatDb);
    alert("User created!!");
  } catch (e) {
    //user couln't be saved to Firebase
    console.log(e)
  }
}