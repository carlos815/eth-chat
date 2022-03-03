const scrollTotheEnd = (ref) => {
    if (ref.current !== null) {
        ref.current.scrollTo({
            top: ref.current.scrollHeight,
            //   behavior: 'smooth'
        })
    } else {
        console.debug("object not found")
    }
}

export default scrollTotheEnd