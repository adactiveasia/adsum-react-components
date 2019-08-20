// @flow

import {
    tmt,
    PMR,
    DESTINATION,
    PLACE_DESTINATION,
    ARRIVED_LABEL,
    ARRIVED_LABEL_VISIBILITY,
    INTERCHANGE_LABEL,
    INTERCHANGE_LABEL_VISIBILITY,
    RESET_ARRIVAL_LABEL,
    RESET_INTERCHANGE_LABEL,
    RESET_MAP_AND_WAY_FINDING,
} from './WayFindingControlsActions';

const initialState = {
    takeMeThere: [],
    pmr: false,
    destination: null,
    placeDestination: null,
    isArrivedLabel: true,
    isInterchangeLabel: true,
    arrivedLabel: [],
    interchangeLabel: [],
    resetMapAndWayFinding: {
        reset: false,
        resetMap: false,
        resetMapAnimatedOption: false,
        resetWayfinding: false,
    },
};

export default function (state = initialState, action) {
    switch (action.type) {
    case tmt:
        return Object.assign({}, state, {
            takeMeThere: action.payload
        });
    case PMR:
        return Object.assign({}, state, {
            pmr: action.payload
        });
    case DESTINATION:
        return Object.assign({}, state, {
            destination: action.payload
        });
    case PLACE_DESTINATION:
        return Object.assign({}, state, {
            placeDestination: action.payload
        });
    case ARRIVED_LABEL:
        return Object.assign({}, state, {
            arrivedLabel: [...state.arrivedLabel, action.payload]
        });
    case ARRIVED_LABEL_VISIBILITY:
        return Object.assign({}, state, {
            isArrivedLabel: action.payload
        });
    case INTERCHANGE_LABEL:
        return Object.assign({}, state, {
            interchangeLabel: [...state.interchangeLabel, action.payload]
        });
    case INTERCHANGE_LABEL_VISIBILITY:
        return Object.assign({}, state, {
            isInterchangeLabel: action.payload
        });
    case RESET_INTERCHANGE_LABEL:
        return Object.assign({}, state, {
            interchangeLabel: []
        });
    case RESET_ARRIVAL_LABEL:
        return Object.assign({}, state, {
            arrivedLabel: []
        });
    case RESET_MAP_AND_WAY_FINDING:
        return Object.assign({}, state, {
            resetMapAndWayFinding: action.payload
        });
    default:
        return state;
    }
}
