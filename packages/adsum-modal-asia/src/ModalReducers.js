// @flow

import {
    OPEN_MODAL,
    SET_MODAL,
    SET_MODAL_STRUCTURE,
    REMOVE_MODAL_STRUCTURE,
    REMOVE_ALL_MODAL_STRUCTURE,
    SET_POI,
    SET_POI_STRUCTURE,
    REMOVE_POI_STRUCTURE,
    REMOVE_ALL_POI_STRUCTURE,
} from './ModalActions';

const initialState = {
    open: false,
    name: null,
    structure: [],
    poi: [],
    poiStructure: [],
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
    case SET_MODAL_STRUCTURE:
        return Object.assign({}, state, {
            structure: [...state.structure, action.payload]
        });
    case REMOVE_MODAL_STRUCTURE:
        return Object.assign({}, state, {
            structure: state.structure.slice(0, -1)
        });
    case REMOVE_ALL_MODAL_STRUCTURE:
        return Object.assign({}, state, {
            structure: []
        });
    case SET_POI:
        return Object.assign({}, state, {
            poi: action.payload
        });
    case SET_POI_STRUCTURE:
        return Object.assign({}, state, {
            poiStructure: [...state.poiStructure, action.payload]
        });
    case REMOVE_POI_STRUCTURE:
        return Object.assign({}, state, {
            poiStructure: state.poiStructure.slice(0, -1)
        });
    case REMOVE_ALL_POI_STRUCTURE:
        return Object.assign({}, state, {
            poiStructure: []
        });
    default:
        return state;
    }
}
