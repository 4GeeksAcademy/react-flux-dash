import React from 'react';
import EventEmmiter from 'events';
import { Dispatcher } from 'flux';

const FluxDispatcher = new Dispatcher();

class Store extends EventEmmiter{
    constructor(){
        super();
        this.state = {};
        FluxDispatcher.register(this.handleActions.bind(this));
    }
    
    setStoreState(newState){
        this.state = Object.assign(this.state, newState);
        var isEmited = false;
        setTimeout(()=>{
            if(isEmited==false) throw("Warning! You need to emit the store after updating the "+this.constructor.name);
        },1000);
        return {
            emit: (eventName='change') => {
                isEmited = true;
                this.emit('change');
            }
        }
    }
    
    handleActions(action){
        
        var actionSlugParts = action.actionSlug.split('.');
        var storeName = actionSlugParts[0];
        var storeMethod = actionSlugParts[1];
        
        if(storeName=='ALL' || storeName == this.constructor.name || ('_'+storeName) == this.constructor.name)
        {
            if(typeof(this[storeMethod]) == 'function') throw storeName+'.'+storeMethod+' must be prepended by _ (underscore) because is a "private" method';
            else if(typeof(this['_'+storeMethod]) == 'undefined') throw storeName+' must have a method _'+storeMethod;
            else if(typeof(this['_'+storeMethod]) != 'function') throw storeName+'._'+storeMethod+' is not a function';
            
            this['_'+storeMethod](action.actionData);
        }
    }
}

class View extends React.Component{
        
        constructor(props){
            super(props);
            this._stores = [];
        }
        
        bindStore(storeClass, second=null, callback=null){
            
            if(storeClass.constructor.name == 'ALL') throw 'Constructor cannot be called ALL, it is a reserved word';
            
            var eventName = 'change';
            if(typeof second == 'string')
            {
                if(callback==null) throw "You need to specify the third parameter (as a function) for the bindStore call on "+storeClass;
                eventName = second;
            }
            else if(typeof eventName == 'function') callback = eventName;

            if(callback==null && typeof(this.handleStoreChanges) == 'undefined') throw this.constructor.name+" have a handleStoreChanges method because is binded to "+storeClass;
            else callback = this.handleStoreChanges;
            
            if(typeof(storeClass) == 'undefined') throw "Undefined storeClass when calling setStore";
            
            if(storeClass instanceof Store) storeClass = [storeClass];
            else if(typeof storeClass != 'array') throw typeof(storeClass)+" needs to be a Flux.Store class or an array of FluxStore classes";
            
            storeClass.forEach((item) => {
                item.on(eventName, callback.bind(this))
            });
            this._stores = this._stores.concat(storeClass);
        }
        
        componentWillUnmount(){
            this._stores.forEach((item) => {
                item.on('change', this.handleStoreChanges.bind(this))
            });
        }
}

class Action{
        
        dispatch(actionSlug, actionData=null){
            var actionSlugParts = actionSlug.split('.');
            
            if(actionSlugParts.length != 2) throw 'Action type '+actionSlug+' is invalid, you need to specify Store.method';
            //this will be the store name
            //var storeName = actionSlugParts[0];
            
            //this will be the store Method
            //var storeMethod = actionSlugParts[1];
            
            FluxDispatcher.dispatch({ actionSlug, actionData });
        }
        
}

var Flux = { Store: Store, Action: Action, View: View }
export default Flux;