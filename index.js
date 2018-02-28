import React from 'react';
import EventEmmiter from 'events';
import { Dispatcher } from 'flux';

export const FluxDispatcher = new Dispatcher();

export class FluxStore extends EventEmmiter{
    constructor(){
        super();
        this.state = {};
        FluxDispatcher.register(this.handleActions.bind(this));
    }
    
    setStoreState(newState){
        this.state = Object.assign(this.state, newState);
        this.emit('change');
    }
    
    handleActions(actionType){
        throw "The store must have a handleActions method";
    }
}

export class FluxComponent extends React.Component{
        
        constructor(){
            super();
            this._stores = [];
        }
        
        bindStore(storeClass){
            if(typeof(this.handleStoreChanges) == 'undefined') throw "The component must have a handleStoreChanges method";
            
            if(typeof(storeClass) == 'undefined') throw "Undefined storeClass when calling setStore";
            
            if(storeClass instanceof React.Component) storeClass = [storeClass];
            
            storeClass.forEach((item) => {
                item.on('change', this.handleStoreChanges.bind(this))
            });
            this._stores = this._stores.concat(storeClass);
        }
        
        componentWillUnmount(){
            this._stores.forEach((item) => {
                item.on('change', this.handleStoreChanges.bind(this))
            });
        }
}