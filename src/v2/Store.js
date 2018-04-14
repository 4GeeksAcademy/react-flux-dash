import Event from './Event';
import {allEvents} from './index';
import {validateText} from './Util';

class Store {
    constructor() {
        this.events = new Array();
    }

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
        this.events.push(e);
        allEvents.push(e);
    }

    /**
     * Subscribe to an Event to receive their updates
     * @param eventName The Event Name to which you want to subscribe
     * @param subscriber The subscriber function that's gonna be executed when it happends
     * @return subscription The subscription for this event in the Store
     * @throws an Error if the event does not exists
     * @throws an Error if the subscriber is not a function
     */
    subscribe(eventName, subscriber) {
        const validatedEventName = validateText(eventName);

        if (typeof(subscriber) !== `function`)
            throw new Error(`subscriber must be a function`);

        for (let i = 0; i < this.events.length; i++) {
            const event = this.events[i];
            if (event.name === validatedEventName) {
                const subscription = event.subscribe(subscriber);
                return subscription;
            }
        }
        throw new Error(`Non existent eventName: ${validatedEventName} on Store`);
    }

    /**
     * Get the state of the Store
     * This is the last know value of each event
     */
    getState() {
        let state = {};
        this.events.forEach(event => {
            const eventState = event.value;
            const eventName = event.name;
            state = Object.assign(state, {[eventName]: eventState})
        });
        return state;
    }
}

export default Store;