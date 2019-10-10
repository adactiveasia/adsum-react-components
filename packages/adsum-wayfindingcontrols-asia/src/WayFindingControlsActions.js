// @flow

import { WayfindingActions } from '@adactive/arc-map';

// eslint-disable-next-line import/no-unresolved
import store from '../../../../src/store/index';
import { dispatch } from 'C:/Users/USER/AppData/Local/Microsoft/TypeScript/3.6/node_modules/rxjs/internal/observable/range';

export const tmt = 'tmt';
export const PMR = 'pmr';
export const TMT_FINISH = 'finish';
export const DESTINATION = 'DESTINATION';
export const PLACE_DESTINATION = 'PLACE_DESTINATION';
export const ARRIVED_LABEL = 'ARRIVED_LABEL';
export const ARRIVED_LABEL_VISIBILITY = 'ARRIVED_LABEL_VISIBILITY';
export const INTERCHANGE_LABEL = 'INTERCHANGE_LABEL';
export const INTERCHANGE_LABEL_VISIBILITY = 'INTERCHANGE_LABEL_VISIBILITY';
export const RESET_ARRIVAL_LABEL = 'RESET_ARRIVAL_LABEL';
export const RESET_INTERCHANGE_LABEL = 'RESET_INTERCHANGE_LABEL';
export const RESET_MAP_AND_WAY_FINDING = 'RESET_MAP_AND_WAY_FINDING';

export function tmtt(poi, poiPlace, pmr) {
    let poiPlaceFix;
    if (poi && poi.placeId) {
        store.dispatch(WayfindingActions.goToPlaceAction(poi.placeId, pmr || false));
        poiPlaceFix = poiPlace;
        poiPlaceFix[0] ? poiPlaceFix[0].poiName = poi.name : poiPlaceFix.poiName = poi.name;
    }
    if (poiPlace && pmr) {
        store.dispatch(this.inputPMR(pmr));
    } else {
        store.dispatch(this.inputPMR(false));
    }
    return (dispatch) => {
        dispatch({
            type: tmt,
            payload: poiPlaceFix
        });
    };
}

export function finish(value) {
    return (dispatch) => {
        dispatch({
            type: TMT_FINISH,
            payload: value
        })
    }
}

export function inputPMR(value) {
    return (dispatch) => {
        dispatch({
            type: PMR,
            payload: value
        });
    };
}

export function destination(poi) {
    return (dispatch) => {
        dispatch({
            type: DESTINATION,
            payload: poi
        });
    };
}

export function placeDestination(poiPlace) {
    return (dispatch) => {
        dispatch({
            type: PLACE_DESTINATION,
            payload: poiPlace
        });
    };
}

export function arrivedLabel(label) {
    return (dispatch) => {
        dispatch({
            type: ARRIVED_LABEL,
            payload: label
        });
    };
}

export function showArrivedLabel(value) {
    return (dispatch) => {
        dispatch({
            type: ARRIVED_LABEL_VISIBILITY,
            payload: value
        });
    };
}

export function interchangeLabel(label) {
    return (dispatch) => {
        dispatch({
            type: INTERCHANGE_LABEL,
            payload: label
        });
    };
}

export function showInterchangeLabel(value) {
    return (dispatch) => {
        dispatch({
            type: INTERCHANGE_LABEL_VISIBILITY,
            payload: value
        });
    };
}

export function resetArrivalLabel(value) {
    return (dispatch) => {
        dispatch({
            type: RESET_ARRIVAL_LABEL,
            payload: value
        });
    };
}

export function resetInterchangeLabel(value) {
    return (dispatch) => {
        dispatch({
            type: RESET_INTERCHANGE_LABEL,
            payload: value
        });
    };
}

export function resetMapAndWayFinding(
    reset,
    resetMap,
    resetMapAnimatedOption,
    resetWayfinding
) {
    return (dispatch) => {
        dispatch({
            type: RESET_MAP_AND_WAY_FINDING,
            payload: {
                reset: reset || false,
                resetMap: resetMap || false,
                resetMapAnimatedOption: resetMapAnimatedOption || false,
                resetWayfinding: resetWayfinding || false
            }
        });
    };
}
