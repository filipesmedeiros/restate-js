"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDataSource = function (state, dataSource, reaction, onError, onComplete) {
    return dataSource.subscribe(function (data) {
        return state.next({
            state: state.value.reactions[reaction](state.value.state, data),
            reactions: state.value.reactions
        });
    }, onError, onComplete);
};
