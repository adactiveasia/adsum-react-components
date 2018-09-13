// @flow

import * as React from 'react';
import { bindActionCreators, Store } from 'redux';
import { connect } from 'react-redux';
import type { AdsumWebMap } from '@adactive/adsum-web-map';

import { initAction, openAction, closeAction } from './actions/MainActions';

import './map.css';

import type { MapStateType } from './initialState';

type MappedStatePropsType = {|
  mapState: MapStateType
|};

type MappedDispatchPropsType = {|
  init: (awm: AdsumWebMap, store: Store) => void,
  open: () => void,
  close: () => void
|};

type OwnPropsType = {|
  awm: AdsumWebMap,
  store: Store,
  onClick: () => any,
  isOpen: boolean,
  children?: React.Node,
  className?: string
|};

type PropsType = MappedStatePropsType & MappedDispatchPropsType & OwnPropsType;

/**
 * Map widget: display map
 * @memberof module:Map
 * @class
 * @extends React.Component
 */
class Map extends React.Component<PropsType> {
    componentWillUpdate(nextProps: PropsType) {
        const {
            awm, store, onClick, init
        } = nextProps;

        if (!this.initialized && awm !== null) {
            init(awm, store, onClick);
            this.initialized = true;
        }

        const { isOpen, open, close } = this.props;

        if (!isOpen && nextProps.isOpen) {
            open();
        } else if (isOpen && !nextProps.isOpen) {
            close();
        }
    }

    initialized: boolean = false;

    render() {
        const {
            isOpen,
            children,
            className
        } = this.props;

        return (
            <div className={`map-wrapper ${isOpen ? 'open' : ''} ${className || ''}`}>
                {children}
            </div>
        );
    }
}

const mapStateToProps = (state: MapStateType): MappedStatePropsType => ({
    mapState: state.map.state,
});

const mapDispatchToProps = (dispatch: *): MappedDispatchPropsType => bindActionCreators({
    init: (awm: AdsumWebMap, store: Store, onClick: () => any): void => dispatch(initAction(awm, store, onClick)),
    open: (): void => dispatch(openAction()),
    close: (): void => dispatch(closeAction()),
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Map);
