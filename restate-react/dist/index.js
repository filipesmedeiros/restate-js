"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var react_1 = __importStar(require("react"));
var restate_js_1 = require("restate-js");
exports.DEFAULT_EQ_FN = function (t, u) { return t === u; };
var init = function (initialState) {
    return new rxjs_1.BehaviorSubject(initialState);
};
// This initial store is confusing...
var RestateContext = react_1.createContext(init({ state: null, reactions: {} }));
exports.useDataSource = function (dataSource, reaction, onError, onComplete) {
    var store = react_1.useContext(RestateContext);
    react_1.useEffect(function () {
        var subscription = restate_js_1.addDataSource(store, dataSource, reaction, onError, onComplete);
        return function () {
            subscription.unsubscribe();
        };
    }, [store, dataSource, reaction, onError, onComplete]);
};
exports.useRestate = function (pipe, equalityFn) {
    if (equalityFn === void 0) { equalityFn = exports.DEFAULT_EQ_FN; }
    var store = react_1.useContext(RestateContext);
    var _a = react_1.useState(pipe(store.value.state)), restate = _a[0], setRestate = _a[1];
    react_1.useEffect(function () {
        var subscription = store
            .pipe(operators_1.map(function (stor) { return pipe(stor.state); }))
            .subscribe(function (newRestate) {
            if (!equalityFn(restate, newRestate))
                setRestate(newRestate);
        });
        return function () { return subscription.unsubscribe(); };
    }, [restate, pipe, equalityFn]);
    return restate;
};
exports.useStore = function () { return react_1.useContext(RestateContext); };
exports.Restate = function (props) { return (react_1.default.createElement(RestateContext.Provider, { value: init(props.store) }, props.children)); };
