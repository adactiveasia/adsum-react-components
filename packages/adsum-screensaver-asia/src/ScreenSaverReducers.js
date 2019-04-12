// @flow

import { APP_CLICK, SCREEN_SAVER_CLOSE } from './ScreenSaverActions';

const initialState = {
    appClicked: false,
    screenSaverClose: false
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
    default:
        return state;
    }
}
