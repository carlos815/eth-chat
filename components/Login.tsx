import { useUserMetamask } from "../context/userContextMetamask"
import { RequestStatus } from "../helpers/types"

const Login = ({ }) => {

    const { reqStatus, userMetamask, requestUser }: any = useUserMetamask()

    return <>

        {reqStatus === RequestStatus.error && <div>Couln't connect ot metamask</div>}
        {reqStatus === RequestStatus.loading && <div>Requesting Metamask access</div>}
        <button
            className="rounded bg-slate-200 border-2 border-slate-300 px-3 font-bold text-slate-700"
            onClick={requestUser}
        >
            Request Metamask address
        </button></>
}

export default Login