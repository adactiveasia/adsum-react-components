// @flow

import { OPEN_MODAL, 
         SET_POI,
         SET_POI_PARENT,
         SET_PREVIOUS_POI,
         } from './ModalActions';

const initialState = {
    open: false,
    parent: null,
    poi: [],
    previousPoi: [],
};

export default function (state = initialState, action) {
    switch (action.type) {
    case OPEN_MODAL:
        return Object.assign({}, state, {
            open: action.payload
        });
    case SET_POI:
        return Object.assign({}, state, {
            poi: action.payload
        });
    case SET_POI_PARENT:
        return Object.assign({}, state, {
            parent: action.payload
        });
    case SET_PREVIOUS_POI:
        return Object.assign({}, state, {
            previousPoi: action.payload
        });
    default:
        return state;
    }
}
