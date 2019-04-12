// @flow

export const APP_CLICK = 'APP_CLICK';
export const SCREEN_SAVER_CLOSE = 'SCREEN_SAVER_CLOSE';

export function appClick(click) {
    return (dispatch) => {
        dispatch({
            type: APP_CLICK,
            payload: click
        });
    };
}

export function screenSaverClose(close) {
    return (dispatch) => {
        dispatch({
            type: SCREEN_SAVER_CLOSE,
            payload: close
        });
    };
}
