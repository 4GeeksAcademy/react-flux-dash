import {validateText} from "./Util";

class Event {
    name = undefined;
    transformers = new Array();
    subscribers = new Array();
    value = undefined;

    constructor(name, ...transformers) {
        this.name = validateText(name);

        if (transformers.length == 0)
            return;

        transformers.forEach(transformer => {
            if (typeof(transformer) !== "function")
                throw new Error("All the transformers must be functions");

            const testResult = transformer({});

            if (typeof(testResult) === "undefined")
                throw new Error("All the transformers must return a mutated state object and not 'undefined'");

            if (testResult === null)
                throw new Error("All the transformers must return a mutated state object and not 'null'");
        });

        this.transformers = transformers;
    }

    subscribe(subscriber) {
        if (typeof(subscriber) !== "function")
            throw new Error("subscriber must be a function");
        this.subscribers.push(subscriber);
    }

    notify(eventData){
        let data = eventData;
        this.transformers.forEach(transformer => {
            data = transformer(data);
        })
        this.subscribers.forEach(subscriber => {
           subscriber(data);
        });
    }

}


export default Event;