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
|};

type MappedDispatchPropsType = {|
    appClick: (value: ?boolean) => void,
    screenSaverClose: (value: ?boolean) => void,
|};

type OwnPropsType = {|
    inactivityTimer: number,
    openFirst: boolean,
    children: *,
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
    };

    timer = null;

    componentDidMount() {
        const { openFirst } = this.props;
        const { alreadyopened } = this.state;

        if (openFirst && !alreadyopened) {
            this.setState({
                alreadyopened: true,
                screensaverIsOpen: true,
            });
        } else {
            this.timerCount();
        }
    }

    componentDidUpdate() {
        const { screenSaverState, appClick, screenSaverClose } = this.props;

        if (screenSaverState.appClicked) {
            this.resetTimer();
            appClick(false);
        }
        if (screenSaverState.screenSaverClose) {
            this.closeScreenSaver();
            screenSaverClose(false);
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
        const { inactivityTimer } = this.props;

        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.setState(() => ({
                screensaverIsOpen: true,
            }));
        }, inactivityTimer);
    }

    render() {
        const { children } = this.props;
        const { screensaverIsOpen } = this.state;

        return (
            <div style={{width: '100%', height: '100%', zIndex: '999', position: 'absolute'}}>
                {screensaverIsOpen && children}
            </div>
        );
    }
}

const mapStateToProps = (state: AppStateType): MappedStatePropsType => ({
    screenSaverState: state.screenSaver,
});

const mapDispatchToProps = (dispatch: *): MappedDispatchPropsType => ({
    appClick: (value: ?boolean) => {
        dispatch(ScreenSaverActions.appClick(value));
    },
    screenSaverClose: (value: ?boolean) => {
        dispatch(ScreenSaverActions.screenSaverClose(value));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ScreenSaver);
