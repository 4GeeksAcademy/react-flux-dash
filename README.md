# React Flux Dash
[![Version](https://img.shields.io/npm/v/@4geeksacademy/react-flux-dash.svg)](https://npmjs.org/package/react-flux-dash)
[![Downloads/week](https://img.shields.io/npm/dw/@4geeksacademy/react-flux-dash.svg)](https://npmjs.org/package/react-flux-dash)
[![License](https://img.shields.io/npm/l/@4geeksacademy/react-flux-dash.svg)](https://github.com/Techniv/Licenses-for-GitHub/tree/master/GNU-GPL)

Learning flux is hard, using it is cumbersome. Hopefully it will become easier with this library!

These are the  biggest library features:
1) No more Dispatcher: the logic is handled in the background
2) Avoid 50% of errors: The library is very smart detecting potential omissions or errors, it even detects if you  change a store without emitting!
3) Full MVC approach.

## Installation

1. Run on your terminal the following command:
```sh
$ npm install @4geeksacademy/react-flux-dash --save
```
2. To import the library anywhere you would like to use it:
```js
import Flux from '@4geeksacademy/react-flux-dash';
```

## Let's build a Flux Workflow for authentication

### 1) First, call any action from any of your views

```js
let username = 'anyuser';
let password = '1234';
SessionActions.authenticateUser(username, password);
```

### 2) Dispatch from the action

From any of your actions, you are able to dispatch to any store you want, specifying what setter method will take care of saving the data into the store.

```js
import Flux from '@4geeksacademy/react-flux-dash';
class SessionActions extends Flux.Action{
    
    authenticateUser(){
        let dataToSave = {
            authenticated: true
        }
        this.dispatch('SessionStore.setAuthentication', dataToSave);
        // you will have to create a _setAuthentication inside StoreActions
    }
    ...
}
export default new SessionActions();
```
Note: Your action class needs to extend (inherit) from Flex.Action.

### 3) Save the data into The Store State

On your store you will be doing the following

```js
import Flux from '@4geeksacademy/react-flux-dash';
class SessionStore extends Flux.Store{
    constructor(){
        super();
        //state initialization on constructor
        this.state = {
            authenticated: false 
        }
    }
    
    //you are forced to use _ to avoid using the setters anywhere else
    _setAuthentication(data){
        //set the the new store state and emit
        this.setStoreState({ authenticated: data.authenticated }).emit();
        //you can specify an event name if you want
        this.setStoreState({ authenticated: data.authenticated }).emit('EVENT_NAME');
    }
    
    getAuthentication(){
        return this.state.authenticated;
    }
}
export default new SessionStore();
```
### 4) Handling store changes

There are 2 main ways to listen to store changes:

1) New lifecycle component function **handleStoreChanges** for store changes

```js
    import Flux from '@4geeksacademy/react-flux-dash';
    import SessionStore from '/path/to/store';
    
    class MyComponent extends Flux.View{
        constructor(){
            super();
            // bind your store on the view
            this.bindStore(SessionStore);
        }
        
        // if you don’t define this function you get an error
        // this function gets automatically called when SessionStore state changes
        handleStoreChanges(){
            // retrieve any store data
            var isAuthenticated = SessionStore.getAuthentication();
        }
    }

```

2) Or set event name and handler

```js
    import MyStore from '/path/to/store';
    
    class MyComponent extends Flux.View{
        constructor(){
            // start listening to changes on SessionStore for specific event
            this.bindStore(SessionStore,'EVENT_NAME', function(){
                // retrieve any store data
                var isAuthenticated = SessionStore.getAuthentication();
            });
            
            // start listening to changes on SessionStore
            this.bindStore(SessionStore, function(){
                // retrieve any store data
                var isAuthenticated = SessionStore.getAuthentication();
            });
        }
    }
```

## Contributors

- Alejandro Sanchez [github.com/alesanchezr](https://github.com/alesanchezr) [alesanchezr.com](http://alesanchezr.com)
- Angel Lacret [github.com/alacret](https://github.com/alacret)
