import React from 'react';
import EventEmmiter from 'events';
import {Dispatcher} from 'flux';

const FluxDispatcher = new Dispatcher();

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
            if (isEmited == false) throw("Warning! You need to emit the store after updating the " + this.constructor.name);
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

        if (storeName == 'ALL' || storeName == this.constructor.name || ('_' + storeName) == this.constructor.name) {
            if (typeof(this[storeMethod]) == 'function') throw storeName + '.' + storeMethod + ' must be prepended by _ (underscore) because is a "private" method';
            else if (typeof(this['_' + storeMethod]) == 'undefined') throw storeName + ' must have a method _' + storeMethod;
            else if (typeof(this['_' + storeMethod]) != 'function') throw storeName + '._' + storeMethod + ' is not a function';

            this['_' + storeMethod](action.actionData);
        }
    }
}

class View extends React.Component {
        
        constructor(props){
            super(props);
            this._stores = [];
            this._callbacks = {};
        }

        /**
         * Bind the Component to different Events from a store
         * @param storeObject The Store object where we want to bind the event
         * @param second The event Name that we want to bind
         * @param callback an Optinal CallBack for the event
         */
        bindStore(storeObject, second = null, callback = null) {

            if (typeof(storeObject) == 'undefined') throw "Undefined storeObject when calling setStore";

            if(storeObject.constructor.name == 'ALL') throw 'Constructor cannot be called ALL, it is a reserved word';

            var eventName = 'change';
            if(typeof second == 'string'){
                eventName = second;
                if (callback == null) {
                    if (typeof(this.handleStoreChanges) == 'undefined') {
                        throw new Error(`Store must implement a 'handleStoreChanges' method or provide a function for handling the ${eventName}`)
                    }
                    callback = this.handleStoreChanges
                }
            }
            else if(typeof second == 'function') callback = second;

            if(callback==null && typeof(this.handleStoreChanges) == 'undefined') throw this.constructor.name+" have a handleStoreChanges method because is binded to "+storeObject;
            else callback = this.handleStoreChanges;

            if(typeof(storeObject) == 'undefined') throw "Undefined storeObject when calling setStore";

            if(storeObject instanceof Store) storeObject = [storeObject];
            else if(typeof storeObject != 'array') throw typeof(storeObject)+" needs to be a Flux.Store class or an array of FluxStore classes";

            storeObject.forEach((item) => {
                if (!(item instanceof Store))
                    throw new Error(`${item} must instance of Store`);

                if(typeof(this._callbacks[item.constructor.name]) == 'undefined')
                    this._callbacks[item.constructor.name] = [];
                this._callbacks[item.constructor.name].push({
                    callbackEvent: eventName,
                    callbackFunction: callback
                });
                item.on(eventName, callback.bind(this));
            });
            this._stores = this._stores.concat(storeObject);
        }

        componentWillUnmount(){
            this._stores.forEach((item) => {
                if(typeof(this._callbacks[item.constructor.name]) == 'array')
                {
                    this._callbacks[item.constructor.name].forEach((callback) => {
                        item.removeListener(callback.callbackEvent, callback.callbackFunction);
                    });
                }
            });
        }
}

class Action {

    dispatch(actionSlug, actionData = null) {
        var actionSlugParts = actionSlug.split('.');

        if (actionSlugParts.length != 2) throw 'Action type ' + actionSlug + ' is invalid, you need to specify Store.method';
        //this will be the store name
        //var storeName = actionSlugParts[0];

        //this will be the store Method
        //var storeMethod = actionSlugParts[1];

        FluxDispatcher.dispatch({actionSlug, actionData});
    }

}

var Flux = {Store: Store, Action: Action, View: View, Component: View}
export default Flux;
