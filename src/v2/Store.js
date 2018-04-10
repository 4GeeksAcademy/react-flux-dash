import Event from './Event';
import allEvents from './index';
import {validateText} from './Util';

class Store {
    events = new Array()

    /**
     * Create and Add a new Event to this store Events list
     * @param eventName The event Name
     * @param transformers the transformers functions
     * @throws an Error if there is already an event with the same name
     */
    addEvent(eventName, ...transformers) {
        const validateEventName = validateText(eventName);

        //Check for duplicated names on the Store
        this.events.forEach(event => {
            if (event.name === validateEventName) {
                throw new Error(`An event named: ${validateEventName} already exists on the Store`);
            }
        });

        const e = new Event(eventName, transformers);
        events.push(e);
        allEvents.push(e);
    }

    subscribe(eventName, subscriber) {
        const validateEventName = validateText(eventName);

        if (typeof(subscriber) !== `function`)
            throw new Error(`subscriber must be a function`);

        this.events.forEach(event => {
            if (event.name === validateEventName) {
                event.subscribe(subscriber);
                return;
            }
        });

        throw new Error(`Non existent eventName: ${validateEventName} on Store`);
    }

    getState() {
        let state = {};
        this.events.forEach(event => {
            const eventState = event.value;
            const eventName = event.name;
            state = Object.assign(state, {eventName: eventState})
        });
        return state;
    }
}