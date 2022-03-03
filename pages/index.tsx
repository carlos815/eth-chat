import Head from "next/head";

import React, { useEffect, useState } from "react";

import type { NextPage } from "next";
import Chat from "../components/chat/Chat";
import Login from "../components/Login";
import { useUserMetamask } from "../context/userContextMetamask";
import { getApps } from "firebase/app";
import { getDatabase, onChildAdded, ref } from "firebase/database";
import ConvList from "../components/convList/ConvList";
import { useCurrentChat } from "../context/currentChatContext";
import CreateNewChat from "../components/CreateNewChat";


const Home: NextPage = () => {

  const { reqStatus, userMetamask, requestUser }: any = useUserMetamask()


  const { currentChat, setCurrentChat }: any = useCurrentChat()

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
  return (
    <div className="container">
      <Head>
        <title>Eth chat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-4    min-h-screen max-h-screen flex flex-col ">
        <h1 className="title text-3xl font-bold underline">
          ETH CHAT
        </h1>
        {userMetamask ? <>

          <div className="flex">


            <ConvList chatList={recentChats} />


            <Chat />

          </div>

          <CreateNewChat />
        </> :
          <Login />
        }
      </main >
    </div>
  );
}

export default Home
