
function validateText(text) {
    if (typeof (text) === "undefined")
        throw new Error("text can't be undefined");
    if (text === null)
        throw new Error("text can't be null");
    if (text === "")
        throw new Error("text can't be an empty string");

    return text;
}

export {validateText};