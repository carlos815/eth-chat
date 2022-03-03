const scrollTotheEnd = (ref) => {
    if (ref !== null) {
        ref.current.scrollTo({
            top: ref.current.scrollHeight,
            behavior: 'smooth'
        })
    }
}

export default scrollTotheEnd