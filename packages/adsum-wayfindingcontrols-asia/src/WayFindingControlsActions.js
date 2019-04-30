// @flow

import { WayfindingActions, MainActions } from '@adactive/arc-map';
import store from './../../../../src/store/index';

export const tmt = 'tmt';
export const DESTINATION = 'DESTINATION';
export const PLACE_DESTINATION = 'PLACE_DESTINATION';
export const ARRIVED_LABEL = 'ARRIVED_LABEL';
export const INTERCHANGE_LABEL = 'INTERCHANGE_LABEL';
export const REMOVE_INTERCHANGE_LABEL = 'REMOVE_INTERCHANGE_LABEL';
export const RESET_INTERCHANGE_LABEL = 'RESET_INTERCHANGE_LABEL';
export const RESET_MAP_AND_WAY_FINDING = 'RESET_MAP_AND_WAY_FINDING';

export function tmtt(poi, poiPlace) {
    if (poi && poi.placeId) {
        store.dispatch(WayfindingActions.goToPlaceAction(poi.placeId));
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

export function removeInterchangeLabel(value) {
    return (dispatch) => {
        dispatch({
            type: REMOVE_INTERCHANGE_LABEL,
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
    resetWayfinding) {
        return (dispatch) => {
            dispatch({
                type: RESET_MAP_AND_WAY_FINDING,
                payload: {
                    reset: reset ? reset : false,
                    resetMap: resetMap ? resetMap : false,
                    resetMapAnimatedOption: resetMapAnimatedOption ? resetMapAnimatedOption : false,
                    resetWayfinding: resetWayfinding ? resetWayfinding : false
                }
            });
        };
}