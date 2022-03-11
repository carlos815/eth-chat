const randomString = (length = 8) => {
    return Math.random().toString(16).slice(2, length + 2);
};

export default randomString