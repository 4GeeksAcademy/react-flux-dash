# React FluxDash

Learning flux is hard, using it is cumbersome. Hopefully it will become easier with this library.

1) 99% of the dispatcher logic is managed on the background
2) Easy store managment,
3) Full MVC approach.

## Dispatching actions

You actions object needs to inhering from Flex.Action, then you will be able to dispatch to any store and setter
```js
class SessionActions extends Flux.Action{
    
    autenticateUser(){
        this.dispatch('MyStore.setAutentication', data);
        // you will have to create a _setAutentication inside StoreActions
    }
```

On your store you will be going the following

```js
class StoreActions extends Flux.Store{
    constructor(){
        super();
        this.state = {
            autenticated: false 
        }
    }
    
    _setAutentication(){
        //set the the new store state and emit
        this.setStoreState({ autenticated: true }).emit();
        //you can specify an event name if you want
        this.setStoreState({ autenticated: true }).emit('EVENT_NAME');
    }
}
```
## Handling store changes

There are 3 ways of going it

1) New lifecycle component function **handleStoreChanges** for store changes

```js
    import MyStore from '/path/to/store';
    
    class MyComponent extends Flux.View{
        constructor(){
            // initialize your state
            this.bindStore(StoreActions);
        }
        
        handleStoreChanges(data){
            //data contains the StoreActions entire state
        }
    }
```

2) Or set event name and handler

```js
    import MyStore from '/path/to/store';
    
    class MyComponent extends Flux.View{
        constructor(){
            // initialize your state
            this.bindStore(StoreActions,'EVENT_NAME' function(data){
                // data contains the store refreshed state
            });
        }
    }
```
