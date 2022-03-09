import Head from "next/head";

import React, { useEffect, useRef, useState } from "react";

import type { NextPage } from "next";
import Chat from "../components/chat/Chat";
import Login from "../components/Login";
import { useUserMetamask } from "../context/userContextMetamask";
import { getApps } from "firebase/app";
import { getDatabase, onChildAdded, ref } from "firebase/database";
import ConvList from "../components/convList/ConvList";
import { useCurrentChat } from "../context/currentChatContext";

import NewChatModal from "../components/modals/NewChatModal";
import Image from "next/image";
import LoginModal from "../components/modals/LoginModal";


const Home: NextPage = () => {

  const { reqStatus, userMetamask, requestUser }: any = useUserMetamask()


  const { currentChat, setCurrentChat, newChatModalOpen, setNewChatModalOpen }: any = useCurrentChat()

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
      mainRef.current.addEventListener("click", () => {
        setNewChatModalOpen(false)
      })
    } else {
      mainRef.current.removeEventListener("click", () => {
        setNewChatModalOpen(false)
      })
    }
  }, [newChatModalOpen])

  const mainRef = useRef(null)
  return (
    <div className="container">
      <Head>
        <title>Eth chat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!userMetamask && <LoginModal />}
      {newChatModalOpen && <NewChatModal />}
      <main className={` divide-y divide-neutral-600 min-h-screen max-h-screen flex flex-col min-w-[100vw] overflow-hidden   ${newChatModalOpen || !userMetamask && "blur-sm brightness-110"}`} ref={mainRef}>
        <nav className={`title p-4 text-3xl font-bold  min-h-nav bg-neutral-700 `}>
          ETH CHAT
        </nav>
        {userMetamask ? <>

          <div className="flex  divide-x divide-neutral-600 ">


            <ConvList chatList={recentChats} />


            <Chat />

          </div>

          <button className="fixed flex items-center justify-center bottom-0 m-8 h-16 w-16 bg-primary-600 rounded-full" onClick={() => setNewChatModalOpen(!newChatModalOpen)}><Image src={"/add.svg"} width="24" height={19}></Image></button>

        </> :
          <></>
        }
      </main >
    </div >
  );
}

export default Home
