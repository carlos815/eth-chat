import { useState, useEffect, createContext, useContext } from 'react'
import { createFirebaseApp } from '../firebase/clientApp'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { RequestStatus } from '../types/requestStatus'
import detectEthereumProvider from '@metamask/detect-provider'

export const UserMetamaskContext = createContext()

export default function UserMetamaskContextComp({ children }) {
  const [userMetamask, setUserMetamask] = useState<string>(null)
  const [reqStatus, setReqStatus] = useState<RequestStatus>(RequestStatus.idle)

  const makeUserRequest = async () => {
    //REquest a metamask address
    setReqStatus(RequestStatus.loading)
    const provider = await detectEthereumProvider();
    if (provider === window.ethereum) {
      //'MetaMask is installed
      console.log("metamask installed")
      try {
        //No account logged in. Requesting
        const request: ["string"] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setUserMetamask(request[0])
        setReqStatus(RequestStatus.success)
      } catch (e) {
        //request error
        setReqStatus(RequestStatus.error)

        console.log(e)
      }
    } else {
      //metamask not installed
      console.log("metamask not found")
      setReqStatus(RequestStatus.error)
    }
  }


  useEffect(() => {
    if (window?.ethereum?.selectedAddress) {
      //There's an account already connected
      setUserMetamask(window.ethereum.selectedAddress)
    }
  }, [])

  return (
    <UserMetamaskContext.Provider value={{ userMetamask, setUserMetamask, reqStatus, makeUserRequest }}>
      {children}
    </UserMetamaskContext.Provider>
  )
}

// Custom hook that shorthands the context!
export const useUserMetamask = () => useContext(UserMetamaskContext)
