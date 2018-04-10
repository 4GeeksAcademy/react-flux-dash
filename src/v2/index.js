import {Dispatcher} from 'flux';
import {validateText} from "./Util";

const __dispatch = new Dispatcher();

const handleDispatch = ({eventName, eventData}) => {
    allEvents.forEach(event=>{
       if (event.name === eventName){
           event.notify(eventData);
       }
    });
};

__dispatch.register(handleDispatch);

const dispatchEvent = (eventName, eventData) => {
    const validateEventName = validateText(eventName);
    __dispatch.dispatch({eventName, eventData});
}

const allEvents = new Array();

export {allEvents, dispatchEvent};