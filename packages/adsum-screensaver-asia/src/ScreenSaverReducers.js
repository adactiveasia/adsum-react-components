// @flow

import { APP_CLICK, SCREEN_SAVER_CLOSE, FORCE_OPEN_SCREEN_SAVER } from './ScreenSaverActions';

const initialState = {
    appClicked: false,
    screenSaverClose: false,
    forceOpen:false 
};

export default function (state = initialState, action) {
    switch (action.type) {
    case APP_CLICK:
        return Object.assign({}, state, {
            appClicked: action.payload
        });
    case SCREEN_SAVER_CLOSE:
        return Object.assign({}, state, {
            screenSaverClose: action.payload
        });
    case FORCE_OPEN_SCREEN_SAVER:
        return Object.assign({}, state, {
            forceOpen: action.payload
        });
    default:
        return state;
    }
}
