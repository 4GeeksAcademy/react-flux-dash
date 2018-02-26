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
    
    handleActions(){
        throw "The store must have a handleActions method";
    }
}