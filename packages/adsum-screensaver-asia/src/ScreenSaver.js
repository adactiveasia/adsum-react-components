// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import { ScreenSaverActions } from '..';

/**
 * ScreenSaver widget, display a carousel of medias (images or videos) or "Touch to Navigate" message
 * @memberof module:ScreenSaver
 * @class
 * @extends React.Component
 */

type MappedStatePropsType = {|
    screenSaverState: object,
    loadingScreenState: number,
|};

type MappedDispatchPropsType = {|
    appClick: (value: ?boolean) => void,
    screenSaverClose: (value: ?boolean) => void,
    forceOpenScreenSaver: (value: ?boolean) => void,
|};

type OwnPropsType = {|
    inactivityTimer: number,
    openFirst: boolean,
    children: *,
    customCloseFunction: *,
    customOpenFunction: *,
|};

type PropsType = MappedStatePropsType & MappedDispatchPropsType & OwnPropsType;

type StateType = {|
    screensaverIsOpen: boolean,
    alreadyopened: boolean,
|}

class ScreenSaver extends React.Component<PropsType, StateType> {
    static defaultProps = {
        inactivityTimer: 180000,
        openFirst: true,
    }

    state = {
        screensaverIsOpen: false,
        alreadyopened: false,
        appReady: false,
    };

    timer = null;

    componentDidUpdate(prevProps) {
        const {
            screenSaverState,
            appClick,
            screenSaverClose,
            customCloseFunction,
            loadingScreenState,
            forceOpenScreenSaver
        } = this.props;

        if (prevProps.loadingScreenState !== loadingScreenState
            && loadingScreenState === 100) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                appReady: true
            });
        }

        if (screenSaverState.appClicked) {
            this.resetTimer();
            appClick(false);
        }
        if (screenSaverState.screenSaverClose) {
            this.closeScreenSaver();
            if (customCloseFunction) {
                customCloseFunction();
            }
            screenSaverClose(false);
        }
        if (screenSaverState.forceOpen) {
            if (this.timer) { clearTimeout(this.timer); }
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                screensaverIsOpen: true,
            });
            forceOpenScreenSaver(false);
        }
    }

    resetTimer = () => {
        if (this.timer) { clearTimeout(this.timer); }
        this.timerCount();
    }

    closeScreenSaver = () => {
        this.setState({
            screensaverIsOpen: false,
        });
        this.timerCount();
    }

    timerCount() {
        const { inactivityTimer, customOpenFunction } = this.props;
        if (this.timer) { clearTimeout(this.timer); }
        this.timer = setTimeout(() => {
            this.setState(() => ({
                screensaverIsOpen: true,
            }));
            customOpenFunction ? customOpenFunction() : null;
        }, inactivityTimer);
    }

    launchScreensaver() {
        const { openFirst, } = this.props;
        const { alreadyopened } = this.state;

        if (openFirst && !alreadyopened) {
            this.setState({
                alreadyopened: true,
                screensaverIsOpen: true,
            });
        } else {
            this.timerCount();
        }
        this.setState({
            appReady: false,
        });
    }

    renderChildren() {
        const { children } = this.props;

        return (
            <div style={{
                width: '100%', height: '100%', zIndex: '999', position: 'absolute'
            }}
            >
                {children}
            </div>
        );
    }

    render() {
        const { screensaverIsOpen, appReady } = this.state;

        return (
            <React.Fragment>
                {appReady ? this.launchScreensaver() : null}
                {screensaverIsOpen ? this.renderChildren() : null }
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: AppStateType): MappedStatePropsType => ({
    loadingScreenState: state.loadingScreen.percentage,
    screenSaverState: state.screenSaver,
});

const mapDispatchToProps = (dispatch: *): MappedDispatchPropsType => ({
    appClick: (value: ?boolean) => {
        dispatch(ScreenSaverActions.appClick(value));
    },
    screenSaverClose: (value: ?boolean) => {
        dispatch(ScreenSaverActions.screenSaverClose(value));
    },
    forceOpenScreenSaver: (value: ?boolean) => {
        dispatch(ScreenSaverActions.forceOpenScreenSaver(value));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(ScreenSaver);
