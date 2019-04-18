// @flow

import { OPEN_MODAL,
         SET_MODAL,
         SET_POI,
         SET_PREVIOUS_POI,
         SET_MODAL_STRUCTURE,
         REMOVE_MODAL_STRUCTURE,
         REMOVE_ALL_MODAL_STRUCTURE,
         } from './ModalActions';

const initialState = {
    open: false,
    name: null,
    poi: [],
    previousPoi: [],
    structure: [],
};

export default function (state = initialState, action) {
    switch (action.type) {
    case OPEN_MODAL:
        return Object.assign({}, state, {
            open: action.payload
        });
    case SET_MODAL:
        return Object.assign({}, state, {
            name: action.payload
        });
    case SET_POI:
        return Object.assign({}, state, {
            poi: action.payload
        });
    case SET_MODAL_STRUCTURE: 
        return Object.assign({}, state, {
            structure: [...state.structure, action.payload]
        });
    case REMOVE_ALL_MODAL_STRUCTURE:
        return Object.assign({}, state, {
            structure: []
        });
    case REMOVE_MODAL_STRUCTURE: 
        return Object.assign({}, state, {
            structure: state.structure.slice(0, -1)
        });
    case SET_PREVIOUS_POI:
        return Object.assign({}, state, {
            previousPoi: action.payload
        });
    default:
        return state;
    }
}
