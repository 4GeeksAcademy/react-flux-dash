import Store from "../v2/Store";
import Event from "../v2/Event";
import {dispatchEvent} from '../v2/index';

const EVENT_NAME = "SOMETHING_HAPPEND";
let testState = undefined;

//
class TestStore extends Store {
    constructor() {
        super();
        this.addEvent(EVENT_NAME, (state) => {
            return Object.assign(state, {"key": "value"})
        });
    }
}

const testStore = new TestStore();

class TestView {

    componentWillMount() {
        this.eventSubscription = testStore.subscribe(EVENT_NAME, (state) => {
            testState = state;
        });
    }

    componentWillUnMount() {
        this.eventSubscription.unsubscribe();
    }
}

const testView = new TestView();
testView.componentWillMount();

const testAction = () => {
    dispatchEvent(EVENT_NAME, {"foo": "bar"});
};
//
testAction();
const storeValue = testStore.getState();

test('testState should containt eventData', () => {
    console.log(testState);
    expect(testState).toEqual(expect.objectContaining({
        foo: expect.any(String)
    }));
});

test('testState should containt trasnformer Data', () => {
    console.log(testState);
    expect(testState).toEqual(expect.objectContaining({
        key: expect.any(String)
    }));
});

test('value should containt all events Data', () => {
    console.log(storeValue);
    expect(storeValue).toEqual(expect.objectContaining({
        [EVENT_NAME]: expect.any(Object)
    }));
});

test('Event Name must Exist', () => {
    expect(() => {
        dispatchEvent("SOME EVENT THAT DOES NOT EXISTS", {})
    }).toThrow();
});

test('InValid Event Name ', () => {
    expect(() => {
        dispatchEvent("", {})
    }).toThrow();
});

test('InValid Event Name ', () => {
    expect(() => {
        dispatchEvent(null, {})
    }).toThrow();
});

test('InValid Event Name ', () => {
    expect(() => {
        dispatchEvent(undefined, {})
    }).toThrow();
});

test('InValid Event Name ', () => {
    expect(() => {
        new Event("");
    }).toThrow();
});

test('InValid Event Name ', () => {
    expect(() => {
        new Event(null);
    }).toThrow();
});

test('InValid Event Name ', () => {
    expect(() => {
        new Event(undefined);
    }).toThrow();
});

test('InValid Transformers', () => {
    expect(() => {
        new Event("EVENT", {});
    }).toThrow();
});


test('InValid Transformers', () => {
    expect(() => {
        new Event("EVENT", 123);
    }).toThrow();
});

test('InValid Transformers', () => {
    expect(() => {
        new Event("EVENT", "");
    }).toThrow();
});

test('InValid Transformers', () => {
    expect(() => {
        new Event("EVENT", () => undefined);
    }).toThrow();
});

test('InValid Transformers', () => {
    expect(() => {
        new Event("EVENT", [""]);
    }).toThrow();
});

test('InValid Transformers', () => {
    expect(() => {
        new Event("EVENT", []);
    }).toThrow();
});

test('InValid Transformers', () => {
    expect(() => {
        new Event("EVENT", [123]);
    }).toThrow();
});

test('InValid Transformers', () => {
    expect(() => {
        new Event("EVENT", [{}]);
    }).toThrow();
});

test('InValid Transformers', () => {
    expect(() => {
        new Event("EVENT", [() => undefined]);
    }).toThrow();
});

test('InValid Transformers', () => {
    expect(() => {
        new Event("EVENT", [() => null]);
    }).toThrow();
});

test('InValid Subscriber', () => {
    expect(() => {
        const e = new Event("EVENT", [() => {
            return {"key": "value"}
        }]);
        e.subscribe(1)
    }).toThrow();
});

test('InValid Subscriber', () => {
    expect(() => {
        const e = new Event("EVENT", [() => {
            return {"key": "value"}
        }]);
        e.subscribe(null)
    }).toThrow();
});

test('InValid Subscriber', () => {
    expect(() => {
        const e = new Event("EVENT", [() => {
            return {"key": "value"}
        }]);
        e.subscribe("")
    }).toThrow();
});

test('InValid Subscriber', () => {
    expect(() => {
        const e = new Event("EVENT", [() => {
        }]);
        e.subscribe({})
    }).toThrow();
});

test('Valid Subscriber', () => {
    const e = new Event("EVENT", [() => {
        return {"key": "value"}
    }]);
    e.subscribe((data) => {
        expect(data).toEqual(expect.objectContaining({
            "key": expect.any(String)
        }));
    })
    e.notify({"foo": "bar"})
});

test('Valid and Warn notify', () => {
    const e = new Event("EVENT", [() => {
        return {"key": "value"}
    }]);
    e.notify({"foo": "bar"})
});

test('Valid Subscriber', () => {
    const e = new Event("EVENT");
    e.subscribe((data) => {
        expect(data).toEqual(expect.objectContaining({
            "foo": expect.any(String)
        }));
    })
    e.notify({"foo": "bar"})
});

test('InValid event on the Store', () => {
    expect(() => {
        testStore.addEvent(EVENT_NAME);
    }).toThrow();
});

test('InValid subscriber on the Store', () => {
    expect(() => {
        testStore.subscribe(EVENT_NAME, 113);
    }).toThrow();
});

test('InValid subscriber on the Store', () => {
    expect(() => {
        testStore.subscribe(EVENT_NAME, {});
    }).toThrow();
});

test('InValid subscriber on the Store', () => {
    expect(() => {
        testStore.subscribe("SOME OTHER EVENT NAME THAT DOES NOT EXISTS");
    }).toThrow();
});

test('InValid subscriber on the Store', () => {
    expect(() => {
        testStore.subscribe("SOME OTHER EVENT NAME THAT DOES NOT EXISTS", () => {});
    }).toThrow();
});


testView.componentWillUnMount();