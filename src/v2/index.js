import {Dispatcher} from 'flux';
import {validateText} from "./Util";

const __dispatch = new Dispatcher();

const handleDispatch = ({eventName, eventData}) => {
    let atLeastDistpatchOneEvent = false;
    allEvents.forEach(event => {
        if (event.name === eventName) {
            event.notify(eventData);
            atLeastDistpatchOneEvent = true;
        }
    });

    if(!atLeastDistpatchOneEvent)
        throw new Error(`No event: ${eventName} exists in the System`);
};

__dispatch.register(handleDispatch);

/**
 * Dispatches an event to the Dispatching system
 * @param eventName The Name of the Event
 * @param eventData The data to be passed
 */
const dispatchEvent = (eventName, eventData) => {
    const validateEventName = validateText(eventName);
    __dispatch.dispatch({eventName, eventData});
}

const allEvents = new Array();

export {allEvents, dispatchEvent};