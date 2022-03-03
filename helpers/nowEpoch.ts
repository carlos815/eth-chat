
function nowEpoch(): number {
    const now = new Date()
    return Date.parse(now.toString())
}

export default nowEpoch;