// @flow

import { WayfindingActions } from '@adactive/arc-map';

// eslint-disable-next-line import/no-unresolved
import store from '../../../../src/store/index';

export const tmt = 'tmt';
export const DESTINATION = 'DESTINATION';
export const PLACE_DESTINATION = 'PLACE_DESTINATION';
export const ARRIVED_LABEL = 'ARRIVED_LABEL';
export const INTERCHANGE_LABEL = 'INTERCHANGE_LABEL';
export const RESET_ARRIVAL_LABEL = 'RESET_ARRIVAL_LABEL';
export const RESET_INTERCHANGE_LABEL = 'RESET_INTERCHANGE_LABEL';
export const RESET_MAP_AND_WAY_FINDING = 'RESET_MAP_AND_WAY_FINDING';

export function tmtt(poi, poiPlace, pmr) {
    if (poi && poi.placeId) {
        store.dispatch(WayfindingActions.goToPlaceAction(poi.placeId, pmr ? pmr : false));
    }
    return (dispatch) => {
        dispatch({
            type: tmt,
            payload: poiPlace
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

export function interchangeLabel(label) {
    return (dispatch) => {
        dispatch({
            type: INTERCHANGE_LABEL,
            payload: label
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
