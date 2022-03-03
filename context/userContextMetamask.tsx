import { useState, useEffect, createContext, useContext } from 'react'
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
    setReqStatus(RequestStatus.loading)

    const provider = await detectEthereumProvider();

    //Check if metamask is installed 🤔
    if (provider === window.ethereum) {
      //MetaMask installed 👍
      try {
        //No account logged in. Requesting 
        const request: ["string"] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setUserMetamask(request[0])
        setReqStatus(RequestStatus.success)
      } catch (e) {
        //request error ⛔
        if (e.code === -32002) {
          //There's a request still pending
          return
        } else {
          setReqStatus(RequestStatus.error)
          console.log(e)
        }
      }
    } else {
      //metamask not installed 👎
      console.log("metamask not found")
      setReqStatus(RequestStatus.error)
    }
  }


  useEffect(() => {

    if (window?.ethereum?.selectedAddress) {
      //There's an account already logged in. No need to request anything 🏖
      setUserMetamask(window.ethereum.selectedAddress)
      setReqStatus(RequestStatus.success)
    }

    //Create account change listener 🔍
    window.ethereum.on('accountsChanged', () => { window.location.reload() });
    return () => {
      //Remove account change listener
      window.ethereum?.removeListener('accountsChanged', () => { window.location.reload() });
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
