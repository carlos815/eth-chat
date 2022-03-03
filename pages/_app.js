import UserProvider from "../context/userContext";
import UserMetamaskProvider from "../context/userContextMetamask";
import CurrentContextProvider from "../context/currentChatContext";
import "../styles/global.css";

// Custom App to wrap it with context provider
export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <CurrentContextProvider>
        <UserMetamaskProvider>
          <Component {...pageProps} />
        </UserMetamaskProvider>
      </CurrentContextProvider>
    </UserProvider>
  );
}
