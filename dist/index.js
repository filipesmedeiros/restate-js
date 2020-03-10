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
exports.DEFAULT_EQ_FN = function (t, u) { return t === u; };
var init = function (initialState) {
    return new rxjs_1.BehaviorSubject(initialState);
};
// ???
// const initialState: State<any> = init<any>(null);
// This null is confusing...
var RestateContext = react_1.createContext(init(null));
exports.addDataSource = function (state, dataSource, reaction) { return dataSource.subscribe(function (data) { return state.next(reaction(state.value, data)); }); };
exports.useRestate = function (pipe, dataSource, equalityFn) {
    if (equalityFn === void 0) { equalityFn = exports.DEFAULT_EQ_FN; }
    var state = react_1.useContext(RestateContext);
    if (dataSource === undefined)
        dataSource = state;
    var _a = react_1.useState(pipe(state.value)), restate = _a[0], setRestate = _a[1];
    react_1.useEffect(function () {
        var subscription = dataSource === null || dataSource === void 0 ? void 0 : dataSource.pipe(operators_1.map(pipe)).subscribe(function (newRestate) {
            if (!equalityFn(restate, newRestate))
                setRestate(newRestate);
        });
        return function () {
            if (subscription !== undefined)
                subscription.unsubscribe();
        };
    }, [restate, pipe, dataSource, equalityFn]);
    return [state, restate];
};
exports.Restate = function (_a) {
    var initialValue = _a.initialValue, children = _a.children;
    return (react_1.default.createElement(RestateContext.Provider, { value: init(initialValue) }, children));
};
