import { useState, useEffect, createContext, useContext } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'
import { RequestStatus } from '../helpers/types'

export const UserMetamaskContext = createContext({})


export default function UserMetamaskContextComp({ children }) {
  const [reqStatus, setReqStatus] = useState<RequestStatus>(RequestStatus.idle)

  const [userMetamask, _setUserMetamask] = useState<string>(null)
  const setUserMetamask = (user: string) => {
    _setUserMetamask(user?.toLowerCase())
  }

  const requestUser = async () => {
    setReqStatus(RequestStatus.loading)

    const provider = await detectEthereumProvider();

    //Check if metamask is installed 🤔
    if (provider === window.ethereum) {
      //MetaMask installed 👍
      try {
        //No account logged in. Requesting 
        console.log("requesting user")
        const request: ["string"] = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });


        console.log("setting user:", request[0])
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

    if ((window as any)?.ethereum?.selectedAddress) {
      //There's an account already logged in. No need to request anything 🏖
      setUserMetamask((window as any).ethereum.selectedAddress)
      setReqStatus(RequestStatus.success)
    }

    //Create account change listener 🔍
    (window as any).ethereum.on('accountsChanged', () => {

      window.location.reload()
      console.log("RHIS RAN")

    });

    //Create account change listener 🔍
    (window as any).ethereum.on('connect', () => {
      setUserMetamask((window as any).ethereum.selectedAddress)
    });
    return () => {
      //Remove account change listener
      (window as any).ethereum?.removeListener('accountsChanged', () => { window.location.reload() });
      (window as any).ethereum.on('connect', () => {
        setUserMetamask((window as any).ethereum.selectedAddress)
      });
    }
  }, [])

  return (
    <UserMetamaskContext.Provider value={{ userMetamask, setUserMetamask, reqStatus, requestUser }}>
      {children}
    </UserMetamaskContext.Provider>
  )
}

// Custom hook that shorthands the context!
export const useUserMetamask = () => useContext(UserMetamaskContext)
