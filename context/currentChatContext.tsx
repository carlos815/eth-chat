import { useState, useEffect, createContext, useContext } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'
import { RequestStatus } from '../helpers/types'

export const CurrentChatContext = createContext({})

export default function CurrentChatContextComp({ children }) {



  const [currentChat, setCurrentChat] = useState<string>()
  const [chatId, setChatId] = useState<string>("")
  const [newChatModalOpen, setNewChatModalOpen] = useState<boolean>(false)

  useEffect(() => {


  }, [])

  return (
    <CurrentChatContext.Provider value={{ currentChat, setCurrentChat, chatId, setChatId, newChatModalOpen, setNewChatModalOpen }}>
      {children}
    </CurrentChatContext.Provider>
  )
}

// Custom hook that shorthands the context!
export const useCurrentChat = () => useContext(CurrentChatContext)
