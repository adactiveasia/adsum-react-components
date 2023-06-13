// @flow

import { types } from './LoadingScreenActions';

export default function LoadingScreenReducer(
    state = {
        percentage: 0,
    },
    action,
) {
    switch (action.type) {
    case types.SET_PERCENTAGE: {
        const { percentage } = action;

        return {
            ...state,
            percentage
        };
    }
    case types.ADD_PERCENTAGE: {
        const { addValue } = action;

        return {
            ...state,
            percentage: state.percentage + addValue
        };
    }
    default: return state;
    }
}
