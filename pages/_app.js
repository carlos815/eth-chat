import UserProvider from "../context/userContext";
import UserMetamaskProvider from "../context/userContextMetamask";
import "../styles/global.css";

// Custom App to wrap it with context provider
export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <UserMetamaskProvider>
        <Component {...pageProps} />
      </UserMetamaskProvider>
    </UserProvider>
  );
}
