const { cloneDeep } = require('lodash')

let store;

function getInstance() {
    if (!store) store = createStore();

    return store;
};

function createStore() {
    let currentState = {};
    let subscribers = [];
    let currentReducerSet = {};

    let currentReducer = (state, _action) => {
        return state;
    };

    function addReducers(reducers) {
        // Combine current reducers with reducers being passed and duplicate keys are collapsed
        currentReducerSet = Object.assign(currentReducerSet, reducers);

        currentReducer = function(state, action) {
            let cumulativeState = {};

            // Only passing a portion of state keyed off its property to simply reducers and avoid changing other areas
            for (key in currentReducerSet) {
                cumulativeState[key] = reducers[key](state[key], action);
            };
        };

        return cumulativeState;
    };

    function subscribe(fn) {
        subscribers.push(fn);
    };

    function unsubscribe(fn) {
        subscribers.splice(subscribers.indexOf(fn));
    }

    function dispatch(action) {
        let prevState = currentState;
        currentState = currentReducer(cloneDeep(currentState), action);
        subscribers.forEach(subscriber => {
            subscriber(currentState, prevState);
        });
    };

    function getState() {
        return cloneDeep(currentState);
    };

    return {
        addReducers,
        dispatch,
        subscribe,
        unsubscribe,
        getState
    };
};

module.exports = getInstance();