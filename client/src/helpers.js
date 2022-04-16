function validateEmail(mailString) {
    const mailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (mailString.match(mailRegex)) {
        return true;
    } else {
        return false;
    }
}

export {
    validateEmail
}