import React from 'react';
import EventEmmiter from 'events';
import {Dispatcher} from 'flux';

const FluxDispatcher = new Dispatcher();

const log = function (msg) {
    if (typeof(window.DEBUG) === 'undefined')
        return;
    if (window.DEBUG === true)
        console.log(msg);
    return
}

/**
 * Store extension that register with the FluxDispatcher singleton
 * and handles all the events
 */
class Store extends EventEmmiter {
    constructor() {
        super();
        this.state = {};
        FluxDispatcher.register(this.handleActions.bind(this));
    }

    /**
     *  Sets the new State of the Store
     * @param newState The new State
     * @returns {{emit: function(*=)}} A function for emitting an event
     */
    setStoreState(newState) {
        this.state = Object.assign(this.state, newState);
        var isEmited = false;
        // Always tell that the store change
        this.emit('change');
        setTimeout(() => {
            if (isEmited === false)
                throw new Error("Warning! You need to emit the store after updating the " + this.constructor.name);
        }, 1000);
        return {
            emit: (eventName = 'change') => {
                isEmited = true;
                this.emit(eventName);
            }
        }
    }

    /**
     * Handles the Dispatch of action through the Flux Dispatcher
     * @param action
     */
    handleActions(action) {
        var actionSlugParts = action.actionSlug.split('.');
        var storeName = actionSlugParts[0];
        var storeMethod = actionSlugParts[1];
        
        storeName = storeName.toLowerCase();//make the store name lowercase to avoid case sensitive

        if (storeName === 'all' || storeName === this.constructor.name.toLowerCase() || ('_' + storeName) === this.constructor.name.toLocaleLowerCase()) {
            if (typeof(this[storeMethod]) === 'function')
                throw new Error(storeName + '.' + storeMethod + ' must be prepended by _ (underscore) because is a "private" method');
            else if (typeof(this['_' + storeMethod]) === 'undefined') throw  new Error(storeName + ' must have a method _' + storeMethod);
            else if (typeof(this['_' + storeMethod]) !== 'function') throw  new Error(storeName + '._' + storeMethod + ' is not a function');

            this['_' + storeMethod](action.actionData);
        }
    }
}

class View extends React.Component {

    constructor(props) {
        super(props);
        this._callbacks = [];
    }

    /**
     * Bind the Component to different Events from a store
     * @param storeObject The Store object where we want to bind the event
     * @param second The event Name that we want to bind
     * @param callback an Optinal CallBack for the event
     */
    bindStore(storeClass, second = null, callback = null) {
        log(`Flux.View:bindStore: ${storeClass}, ${second}, ${callback}`)

        if (typeof(storeClass) === 'undefined')
            throw new Error("Undefined StoreClass when calling bindStore on " + this.constructor.name);

        if (storeClass.constructor.name === 'ALL')
            throw new Error("StoreClass cannot be called 'ALL', it is a reserved word");

        let eventName = 'change';
        if (typeof second === 'string')
            eventName = second;

        if (typeof second === 'function')
            callback = second;

        if (callback === null && typeof(this.handleStoreChanges) === 'undefined')
            throw new Error(this.constructor.name + " needs to have a handleStoreChanges method or callback because is binded to a Store");

        if (callback === null)
            callback = this.handleStoreChanges;

        if (storeClass instanceof Store)
            storeClass = [storeClass];
        else if (!Array.isArray(storeClass)) throw new Error("You are binding " + this.constructor.name + " to " + storeClass.constructor.name + " and it needs to be binded to Flux.Store classes");

        storeClass.forEach((item) => {
            if (!(item instanceof Store))
                throw new Error(`${item} must instance of Store in ${this.constructor.name}`);

            const realCallback = callback.bind(this);

            this._callbacks.push({
                store: item,
                callbackEvent: eventName,
                callbackFunction: realCallback
            });

            item.on(eventName, realCallback);
        });
    }

    componentWillUnmount() {
        log("Flux.View:componentWillUnmount")
        this._callbacks.forEach((obj) => {
            obj.store.removeListener(obj.callbackEvent, obj.callbackFunction);
        });
    }
}

class Action {

    dispatch(actionSlug, actionData = null) {
        var actionSlugParts = actionSlug.split('.');

        if (actionSlugParts.length !== 2)
            throw new Error('Action type ' + actionSlug + ' is invalid, you need to specify Store.method');
        //this will be the store name
        //var storeName = actionSlugParts[0];

        //this will be the store Method
        //var storeMethod = actionSlugParts[1];

        FluxDispatcher.dispatch({actionSlug, actionData});
    }

}

export default {Store: Store, Action: Action, View: View, Component: View};