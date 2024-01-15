const { cloneDeep } = require('lodash')

let store;

function getInstance() {
    if (!store) store = createStore();

    return store;
};

function createStore() {
    let currentState = {};

    let currentReducer = (state, action) => {
        return state;
    };

    let subscribers = [];

    function dispatch(action) {
        let prevState = currentState;
        currentState = currentReducer(cloneDeep(currentState), action);
        subscribers.forEach(subscriber => {
            subscriber(currentState, prevState);
        });
    };

    return {
        dispatch
    };
};

module.exports = getInstance();