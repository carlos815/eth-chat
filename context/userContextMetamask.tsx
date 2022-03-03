import { useState, useEffect, createContext, useContext } from 'react'
import { createFirebaseApp } from '../firebase/clientApp'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import detectEthereumProvider from '@metamask/detect-provider'
import { RequestStatus } from '../helpers/types'

export const UserMetamaskContext = createContext()

export default function UserMetamaskContextComp({ children }) {
  const [reqStatus, setReqStatus] = useState<RequestStatus>(RequestStatus.idle)

  const [userMetamask, _setUserMetamask] = useState<string>(null)
  const setUserMetamask = (user: string) => {
    _setUserMetamask(user.toLowerCase())
  }

  const makeUserRequest = async () => {
    if (window?.ethereum?.selectedAddress) {
      //There's an account already connected. No need to request anything
      setUserMetamask(window.ethereum.selectedAddress)
      setReqStatus(RequestStatus.success)
      return
    }


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
    makeUserRequest()
  }, [])

  return (
    <UserMetamaskContext.Provider value={{ userMetamask, setUserMetamask, reqStatus, makeUserRequest }}>
      {children}
    </UserMetamaskContext.Provider>
  )
}

// Custom hook that shorthands the context!
export const useUserMetamask = () => useContext(UserMetamaskContext)
