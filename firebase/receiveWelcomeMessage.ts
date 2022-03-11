import { getDatabase, push, ref, update } from "firebase/database";
import nowEpoch from "../helpers/nowEpoch";
import { Message } from "../helpers/types";
import createNewChat from "./createNewChat";
import sendMessage from "./sendMessage";

const receiveWelcomeMessage = async (memberAddresses: [string, string], setChatId: Function, callback?: Function, errorCallback?: Function,) => {
    const chatId = await createNewChat(memberAddresses, setChatId);

    const message: Message = {
        message: `Hi! I'm Carlos, the creator of this chat 😄 </br></br>
Eth Chat is an open source app that lets you chat with other users using only an Ethereum address.
</br></br>
Here's. the source code:
        https://github.com/carlos815/eth-chat
        </br></br>
        Want to contact me? carlos.t815@gmail.com
  </br></br>
  That's all, bye! 😁
        `,
        timestamp: nowEpoch(),
        name: memberAddresses[0]
    }
    sendMessage(chatId, message,)
}


export default receiveWelcomeMessage