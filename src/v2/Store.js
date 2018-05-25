import Event from './Event';
import {allEvents} from './index';
import utils from './Util';

class Store {
    constructor() {
        utils.log("v2/Store:constructor");
        this.events = [];
    }

    /**
     * Create and Add a new Event to this store Events list
     * @param eventName The event Name
     * @param transformers the transformers functions
     * @throws an Error if there is already an event with the same name
     */
    addEvent(eventName, ...transformers) {
        utils.log("v2/Store:addEvent");
        const validateEventName = utils.validateText(eventName);

        //Check for duplicated names on the Store
        this.events.forEach(event => {
            if (event.name === validateEventName) {
                throw new Error(`STORE: An event named: ${validateEventName} already exists on the Store`);
            }
        });
        let e;
        if (transformers.length > 0)
            e = new Event(eventName, transformers);
        else
            e = new Event(eventName);
        this.events.push(e);
        allEvents.push(e);
    }

    /**
     * Subscribe to an Event to receive their updates
     * @param eventName The Event Name to which you want to subscribe
     * @param subscriber The subscriber function that's gonna be executed when it happends
     * @param receiveLastValue Whether the subscriber
     * @return subscription The subscription for this event in the Store
     * @throws an Error if the event does not exists
     * @throws an Error if the subscriber is not a function
     */
    subscribe(eventName, subscriber, receiveLastValue = false) {
        utils.log("v2/Store:subscribe");
        const validatedEventName = utils.validateText(eventName);

        if (typeof(subscriber) !== `function`)
            throw new Error(`subscriber must be a function`);

        for (let i = 0; i < this.events.length; i++) {
            const event = this.events[i];
            if (event.name === validatedEventName) {
                const subscription = event.subscribe(subscriber);
                if (receiveLastValue)
                    subscriber(event.value);
                return subscription;
            }
        }
        throw new Error(`Non existent eventName: ${validatedEventName} on Store`);
    }

    /**
     * Get the state of the Store
     * This is the last know value of each event
     */
    getState(eventName) {
        utils.log("v2/Store:getState");
        if (!(eventName === undefined || eventName === null))
            return this.__getEventState(eventName);

        let state = {};
        this.events.forEach(event => {
            const eventState = event.value;
            const eventName = event.name;
            state = Object.assign(state, {[eventName]: eventState})
        });
        return state;
    }

    /**
     * Get the state of a particular event
     * This is the last know value of the event
     */
    __getEventState(eventName) {
        utils.log("v2/Store:__getEventState");
        for (let i = 0; i < this.events.length; i++)
            if (this.events[i].name === eventName)
                return this.events[i].value;
        throw new Error(`Non existent eventName: ${eventName} on Store`);
    }

    /**
     * Clears all the values of the events in the Store
     */
    clearState() {
        utils.log("v2/Store:clearState");
        this.events.forEach(event => event.value = null);
    }
}

export default Store;