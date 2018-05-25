/**
 * Validates if the input is a Valid Text
 * Non null, non undefined, non empty
 * @param text The Text to be validated
 * @returns {*} the Text if it is Valid
 * @thro
 */
function validateText(text) {
    if (typeof (text) === "undefined")
        throw new Error("text can't be undefined");
    if (text === null)
        throw new Error("text can't be null");
    if (text === "")
        throw new Error("text can't be an empty string");

    return text;
}

export default {
    validateText,
    log: (msg, obj) => {
        if (!window.DEBUG)
            return;
        if (obj)
            console.log(msg, obj);
        else
            console.log(msg)
    }
};