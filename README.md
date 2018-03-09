# React Flux Dash

Learning flux is hard, using it is cumbersome. Hopefully it will become easier with this library!

These are the  biggest library features:
1) No more Dispatcher: the logic is handled on the background
2) Avoid 50% of errors: The library is very smart detecting potential omitions or errors, it even detectes if you  change a store without emmiting!
3) Full MVC approach.

## Instalation

1. Run on your terminal the following command:
```sh
$ npm install react-flux-dash --save
```
2. To import the library anywhere you would like to use it:
```js
import Flux from 'react-flux-dash';

// or you can also do

var Flux = require('react-flux-dash').default();
```

## Let's build a Flux Workflow for autentication

### 1) Dispatching actions

You actions object needs to inhering from Flex.Action, then you will be able to dispatch to any store and setter
```js
import Flux from 'react-flux-dash';
class SessionActions extends Flux.Action{
    
    autenticateUser(){
        this.dispatch('SessionStore.setAutentication', {autenticated: true});
        // you will have to create a _setAutentication inside StoreActions
    }
```

### 2) The Store

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
    
    //you are forced to use _ to avoid using the setters anywhere else
    _setAutentication(data){
        //set the the new store state and emit
        this.setStoreState({ autenticated: data.autenticated }).emit();
        //you can specify an event name if you want
        this.setStoreState({ autenticated: data.autenticated }).emit('EVENT_NAME');
    }
    
    getAutentication(){
        return this.state.autenticated;
    }
}
```
### 3) Handling store changes

There are 2 main way to listen to store changes:

1) New lifecycle component function **handleStoreChanges** for store changes

```js
    import Flux from 'react-flux-dash';
    import SessionStore from '/path/to/store';
    
    class MyComponent extends Flux.View{
        constructor(){
            super();
            // bind your store on the view
            this.bindStore(SessionStore);
        }
        
        // if you dont define this function you get an error
        // this function gets automatically called when SessionStore state changes
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
            this.bindStore(SessionStore,'EVENT_NAME', function(){
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

## Contributors

- Alejandro Sanchez [github.com/alesanchezr](https://github.com/alesanchezr) [alesanchezr.com](http://alesanchezr.com)
- Angel Lacret [github.com/alacret](https://github.com/alacret)
