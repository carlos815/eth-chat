import Head from "next/head";

import React, { useEffect, useRef, useState } from "react";

import type { NextPage } from "next";
import Chat from "../components/chat/Chat";
import { useUserMetamask } from "../context/userContextMetamask";
import { getApps } from "firebase/app";
import { getDatabase, onChildAdded, ref } from "firebase/database";
import ConvList from "../components/convList/ConvList";
import { useCurrentChat } from "../context/currentChatContext";

import NewChatModal from "../components/modals/NewChatModal";
import Image from "next/image";
import LoginModal from "../components/modals/LoginModal";
import receiveWelcomeMessage from "../firebase/receiveWelcomeMessage";


const Home: NextPage = () => {

  const { reqStatus, userMetamask, requestUser, asGuest, }: any = useUserMetamask()


  const { currentChat, setCurrentChat, newChatModalOpen, setNewChatModalOpen, setChatId }: any = useCurrentChat()

  const [recentChats, setRecentChats] = useState<string[]>([])

  const isFirebaseReady = getApps().length !== 0;

  /*
    const currentChatID: string = () => {
      return recentChats[address]
    }*/

  useEffect(() => {
    (async () => {
      if (isFirebaseReady && userMetamask !== null) {
        //create database observer to update chatbox automatically on change
        const db = getDatabase();
        const messageRef = ref(db, "chats/users/" + userMetamask + "/chatsWith");
        let newData = {}
        onChildAdded(messageRef, (snapshot) => {
          newData = { ...newData, [snapshot.key]: snapshot.val() }
          setRecentChats({ ...recentChats, ...newData });
          //     scrollTotheEnd(chatbox)
        })
      }
    })()

    //return off()
  }, [isFirebaseReady, userMetamask]);

  /*
    useEffect(() => {
      console.log("data changed")
    }, [currentChat]);
  */


  useEffect(() => {
    if (newChatModalOpen) {
      mainRef.current.addEventListener("click", (event) => {
        setNewChatModalOpen(false)
        event.stopPropagation();
        event.preventDefault();

      }, { once: true })
    } else {
      mainRef.current.removeEventListener("click", (event) => {
        setNewChatModalOpen(false)
        event.stopPropagation();
        event.preventDefault();
      })
    }
  }, [newChatModalOpen])


  useEffect(() => {


    document.addEventListener("click", (event: MouseEvent) => {
      if ((event.target as any).className.includes("newChatModal")) {
        event.preventDefault();
        event.stopPropagation();
        (document.querySelector(".newChatModal") as any).close()
      }
    })

    document.querySelector(".newChatModal").addEventListener('close', function () {
      setModalOpen(false)
    });

    document.querySelector(".newChatModal").addEventListener('open', function () {
    });
  }, [])



  useEffect(() => {
    console.log("tgus ran", asGuest)
    if (asGuest) {
      console.log("tgus ran as guest")

      receiveWelcomeMessage(["0x2D3f907b0cF2C7D3c2BA4Cbc72971081FfCea963", userMetamask], setChatId,)
    }
  }, [asGuest])

  const [modalOpen, setModalOpen] = useState(false)


  const mainRef = useRef(null)
  return (
    <div className="container">
      <Head>
        <title>Eth chat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NewChatModal className="newChatModal" />
      {!userMetamask && <LoginModal />}
      {/*     }
      {newChatModalOpen && <NewChatModal />}*/}
      <main className={`relative divide-y divide-neutral-600 min-h-screen max-h-screen flex flex-col min-w-[100vw] overflow-hidden   ${(modalOpen || !userMetamask) && "blur-sm brightness-110"}`} ref={mainRef}>
        <nav className={`title p-4 text-3xl font-bold  min-h-nav bg-neutral-700 `}>
          ETH CHAT
        </nav>
        {userMetamask ? <>

          <div className="flex  divide-x divide-neutral-600 ">


            <ConvList chatList={recentChats} />


            <Chat />

          </div>

          <button className="fixed flex items-center justify-center bottom-0 m-8 h-16 w-16 bg-primary-600 rounded-full" onClick={() => {
            (document.querySelector(".newChatModal") as any).showModal();
            setModalOpen(true)

          }}><Image alt="alt Icon" src={"/add.svg"} width="24" height={19}></Image></button>



        </> :
          <></>
        }
      </main >
    </div >
  );
}

export default Home
