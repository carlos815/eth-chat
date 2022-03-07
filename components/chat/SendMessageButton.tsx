const SendMessageButton = ({ onClick, disabled }) => {
    return <button
        className="rounded bg-slate-200 border-2 border-slate-300 px-3 font-bold text-slate-700 disabled:text-slate-300"
        onClick={onClick} disabled={disabled}>
        Send Message
    </button>
}

export default SendMessageButton