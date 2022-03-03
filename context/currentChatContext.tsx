import { useState, useEffect, createContext, useContext } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'
import { RequestStatus } from '../helpers/types'

export const CurrentChatContext = createContext()

export default function CurrentChatContextComp({ children }) {



  const [currentChat, setCurrentChat] = useState<string>()
  const [chatId, setChatId] = useState<string>("")

  useEffect(() => {


  }, [])

  return (
    <CurrentChatContext.Provider value={{ currentChat, setCurrentChat, chatId, setChatId }}>
      {children}
    </CurrentChatContext.Provider>
  )
}

// Custom hook that shorthands the context!
export const useCurrentChat = () => useContext(CurrentChatContext)
