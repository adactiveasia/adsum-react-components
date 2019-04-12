// @flow
import * as React from 'react';
import { connect } from 'react-redux';

import { LabelTextObject } from '@adactive/adsum-web-map';
import ACA from '@adactive/adsum-utils/services/ClientAPI';

import { MainActions } from '@adactive/arc-map';
import { WayFindingControlsActions } from '../';
    takeMeThere, yourDestination, yourPlaceDestination, resetMapAndWayFinding 

type OwnPropsType = {|
    //props needed when call this component
    awm: *,
    kioskPlace: object,

    //props actions from wayFindingControlsActions.js
    takeMeThere: *, 
    yourDestination: *, 
    yourPlaceDestination: *, 
    resetMapAndWayFinding: string, 


|};

class WayFindingControls extends React.Component<PropsType, StateType> {
    state = {
        poiDestination: [],
        destinationFloorNote: null,
        moreThanTwoIndex: null,
    }

    render(){
        return(

        )
    }
}

const mapStateToProps = (state: AppStateType): MappedStatePropsType => ({
    wayfindingState: state.map.wayfindingState,
    getPath: state.map.getPath,
    currentSelectedObject: state.map.currentSelectedObject,
    takeMeThereState: state.takeMeThere,
    resetMapAndWayFindingState: state.resetMapAndWayFinding,
});

const mapDispatchToProps = (dispatch: *): MappedDispatchPropsType => ({
    takeMeThere: (poi) => {
        dispatch(WayFindingControlsActions.takeMeThere(poi));
    },
    yourDestination: (poi) => {
        dispatch(WayFindingControlsActions.yourDestination(poi));
    },
    resetMapAndWayFinding: (animated: string = '') => {
        dispatch(resetMapAndWayFinding(animated));
    },
    resetMap: (animated: boolean = false): void => dispatch(MainActions.resetAction(false, true, animated)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(WayFindingControls);
