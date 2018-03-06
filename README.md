# React FluxDash

Learning flux is hard, using it is cumbersome. Hopefully it will become easier with this library!

These are the  biggest library features:
1) No more Dispatcher: the logic is handled on the background
2) Avoid 50% of errors: The library is very smart detecting potential omitions or errors, it even detectes if you  change a store without emmiting!
3) Full MVC approach.

## Instalation

1. Run on your terminal the following command:
```sh
$ npm install react-flux-dash
```
2. To import the library anywhere you would like to use it:
```js
import Flux from 'react-flux-dash';

// or you can also do

var Flux = require('react-flux-dash').default();
```


## Dispatching actions

You actions object needs to inhering from Flex.Action, then you will be able to dispatch to any store and setter
```js
import Flux from 'react-flux-dash';
class SessionActions extends Flux.Action{
    
    autenticateUser(){
        this.dispatch('SessionStore.setAutentication', data);
        // you will have to create a _setAutentication inside StoreActions
    }
```

On your store you will be going the following

```js
import Flux from 'react-flux-dash';
class SessionStore extends Flux.Store{
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
    
    getAutentication(){
        return this.state.autenticated;
    }
}
```
## Handling store changes

There are 2 main way to listen to store changes:

1) New lifecycle component function **handleStoreChanges** for store changes

```js
    import Flux from 'react-flux-dash';
    import SessionStore from '/path/to/store';
    
    class MyComponent extends Flux.View{
        constructor(){
            // initialize your state
            this.bindStore(SessionStore);
        }
        //this function gets automatically called when SessionStore state changes
        handleStoreChanges(){
            // retreive any store data
            var isAutenticated = SessionStore.getAutentication();
        }
    }
```

2) Or set event name and handler

```js
    import MyStore from '/path/to/store';
    
    class MyComponent extends Flux.View{
        constructor(){
            // start listening to changes on SessionStore for especific event
            this.bindStore(SessionStore,'EVENT_NAME' function(){
                // retreive any store data
                var isAutenticated = SessionStore.getAutentication();
            });
            
            // start listening to changes on SessionStore
            this.bindStore(SessionStore, function(){
                // retreive any store data
                var isAutenticated = SessionStore.getAutentication();
            });
        }
    }
```
