

# React Flux Dash
[![Version](https://img.shields.io/npm/v/@4geeksacademy/react-flux-dash.svg)](https://npmjs.org/package/react-flux-dash)
[![Downloads/week](https://img.shields.io/npm/dw/@4geeksacademy/react-flux-dash.svg)](https://npmjs.org/package/react-flux-dash)
[![License](https://img.shields.io/npm/l/@4geeksacademy/react-flux-dash.svg)](https://github.com/Techniv/Licenses-for-GitHub/tree/master/GNU-GPL)

Learning flux is hard, using it is cumbersome. Hopefully it will become easier with this library!

Also, learning redux is harder, so this is state library that make your life easier

Dash are a series of coding guidelines and principles to code in a easy, conventional, clean and expressive way.

The principles and guidelines supporting this Library are:

1) Define a Store should be an easy step, keeping the power of a "Single source of thruth"
2) Data and event propagation should be done in a declarative way
3) Views should be developer in a reactive way.
4) Multiple Stores are allowed for better organization
5) We keep flux as it should be unidirectaional, so there is no coupling between the Action and the Views, neither between the Actions and the Store, neither between the Store and the View
6) The Store state is implicit: The last value of all the events on the Store.

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

### 1) First, declare your Store

```js
import Flux from '@4geeksacademy/react-flux-dash';

class SessionStore extends Flux.DashStore{
    constructor(){
        super();
        // Declare an Event
        this.addEvent("onLogout");
        // Or Declare an event with some imutable transformation logic
        this.addEvent("login", (state) => {
            // Do something with the data before propagating the Event
            return Object.assign(state, {"key": "value"})
        });
        // Or Declare an event with some plain transformation logic
        this.addEvent("login", (state) => {
            state.some_other_property = "Some other Data";
            return Object.assign(state, {"key": "value"})
        });
    }
}
export default new SessionStore();
```

### 2) Registering with the Store changes

```js
import React from 'react';
import SessionStore from '/path/to/store';

class View extends React.Component {
      constructor(){
          super();
      }

      componentDidMount() {
          const me = this;
          this.loginSubscription = SessionStore.subscribe("login", (state) => {
              // Do something usefull with the Event Data
              me.userName = state.user.name;
          });
          // Register some method
          this.logoutSubscription = SessionStore.subscribe("logout", this.logOutEvent().bind(this));
      }

      logOutEvent(state){
        //DO something with the state or the state of the Store
        const storeState = SessionStore.getState()
      }

      componentWillUnMount() {
          // Don't forget to release the subscription
          this.loginSubscription.unsubscribe();
          this.logoutSubscription.unsubscribe();
      }
  }

```

### 3) Define some action that will trigger the event

```js
import Flux from '@4geeksacademy/react-flux-dash';

const authenticateAction = (username, password)=> {
      // Don't forget to Validate the data ex: username !=== undefined
      let dataToSave = {
          authenticated: true
      }
      Flux.dispatchEvent('login', dataToSave)
}

export default {authenticateAction};
```

### 4) Glue all together using the Action from the View


```js
import React from 'react';
import SessionStore from '/path/to/store';
import {authenticateAction} from 'path/to/action';

class View extends React.Component {
      constructor(){
          super();
      }

      componentDidMount() {
          const me = this;
          this.loginSubscription = SessionStore.subscribe("login", (state) => {
              // Do something usefull with the Event Data
              me.userName = state.user.name;
          });
          // Register some method
          this.logoutSubscription = SessionStore.subscribe("logout", this.logOutEvent().bind(this));
      }

      logOutEvent(state){
        //DO something with the state or the state of the Store
        const storeState = SessionStore.getState()
      }

      componentWillUnMount() {
          // Don't forget to release the subscription
          this.loginSubscription.unsubscribe();
          this.logoutSubscription.unsubscribe();
      }

      login(){
        authenticateAction(this.state.username, this.state.password);
      }

  }

```
ChangeLog:

#### v 3.0.0

- Add a ```clearState``` method for the Store to set all Values to null
- Add a parameter to the subscription, to request the last value of the Event if wanted
- Add a Helper React View, to subscribe and unsubscribe to the Store wanted


## Contributors

- Alejandro Sanchez [github.com/alesanchezr](https://github.com/alesanchezr) [alesanchezr.com](http://alesanchezr.com)
- Angel Lacret [github.com/alacret](https://github.com/alacret)
- Allan Thinks [github.com/alanthinks](https://github.com/alanthinks)
