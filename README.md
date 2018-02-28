# React Flux Dash

Learning flux is hard, hopefully it will become easier with this library.

1) 90% of the dispatcher logic is managed on the background

2) New ""

1) New lifecycle component function **handleStoreChanges** for store changes
```
    handleStoreChanges(){
        // suposing you have imported a UserStore into your react component
        this.setState({
            autenticated: UserStore.isAutenticated()
        });
    }
```