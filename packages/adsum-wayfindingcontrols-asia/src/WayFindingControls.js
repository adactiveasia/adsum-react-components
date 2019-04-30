// @flow
import * as React from 'react';
import { connect } from 'react-redux';

import { LabelTextObject } from '@adactive/adsum-web-map';
import ACA from '@adactive/adsum-utils/services/ClientAPI';

import { MainActions, WayfindingActions, SelectionActions } from '@adactive/arc-map';
import { WayFindingControlsActions } from '../';

type MappedStatePropsType = {|
    wayfindingState: :*,
    getPath: :*,
    wayFindingControlsState: object,
|};

type MappedDispatchPropsType = {|
    setPercentage: (percentage: ?number) => void,
    resetMap: (animated: boolean) => void,
    changeFloor: (floorId: number) => void,
    takeMeThere: (poi: *) => void,
    destination: (poi: *) => void,
    placeDestination: (poiPlace: *) => void,
    arrivedLabel: (label: *) => void,
    interchangeLabel: (label: *) => void,
    resetInterchangeLabel: () => void,
    resetMapAndWayFinding: (
        reset : ?boolean, 
        resetMap: ?boolean, 
        resetMapAnimatedOption: ?boolean, 
        resetWayfinding: ?boolean) 
    => void,
    resetMap: (animated: boolean) => void,
    onRemovePath: () => void,
    resetSelection: () => void,
|};

type OwnPropsType = {|
    //props needed when call this component
    awm: *,
    kioskPlace: object,
    //optional props
    destinationLabelText: string,
    icLabelText: string,
|};

class WayFindingControls extends React.Component<PropsType, StateType> {

    static defaultProps = {
        destinationLabelText: "You reached ",
        icLabelText: "Head ",
    }

    componentDidUpdate(prevProps){
        const { kioskPlace,
                wayfindingState, 
                wayFindingControlsState, 
                getPath,
                destination,
                placeDestination,
                destinationLabelText,
                icLabelText,
                resetMapAndWayFinding,
                resetMap,
                resetSelection,
                onRemovePath
            } = this.props;

    // While Drawing

        if(wayfindingState.drawing
            && wayFindingControlsState.takeMeThere 
            && wayFindingControlsState.takeMeThere[0]
            && wayFindingControlsState.takeMeThere[0].id){
            
    // Define Needed Variable

            const path = getPath(wayFindingControlsState.takeMeThere[0].id);
            const pathSection = path.getPathSections(true);
            const poiDestination = ACA.getPoisFromPlace(wayFindingControlsState.takeMeThere[0].id);
            const destinationFloor = pathSection[(pathSection.length - 1)].ground;
            const finalLabelText = destinationLabelText + poiDestination[0].name;
    
    // Store Destination Poi and Destination Place

            if(wayFindingControlsState.destination !== poiDestination 
                && wayFindingControlsState.placeDestination !== destinationFloor){
                    destination(poiDestination);
                    placeDestination(destinationFloor);
                }
            
    // If The Current Index Of Wayfinder is Even (Between Add Interchange(IC) Label or Add Destination Label)
            if (wayfindingState.currentSectionIndex % 2 === 0){

    // If Interchange Label Exist, Delete it
                if(wayFindingControlsState.interchangeLabel.length>0){
                    this.deleteInterchangeLabel();
                }

    // If It is Destination Label
                if(prevProps.wayfindingState.drawing
                    && wayfindingState.currentSectionIndex === (pathSection.length-1)
                    && wayFindingControlsState.arrivedLabel !== pathSection[pathSection.length-1].to
                    ){
                    this.addArrivalLabel(finalLabelText, pathSection);
                }

    // If it is Interchange Label(s)
                else if(wayfindingState.drawing
                    && wayfindingState.currentSectionIndex !== (pathSection.length-1)){

                    let icDestinationFloorPosition;
                    if(pathSection[wayfindingState.currentSectionIndex+1].to.pathNode.ground.id > kioskPlace.id){
                        icDestinationFloorPosition = "Up ";
                    }
                    else if(pathSection[wayfindingState.currentSectionIndex+1].to.pathNode.ground.id < kioskPlace.id){
                        icDestinationFloorPosition = "Down ";
                    }
                    else {
                        icDestinationFloorPosition = "Straight ";
                    }
                    const icDestinationFloor = pathSection[wayfindingState.currentSectionIndex+1].to.pathNode.ground.name;
                    const changeFloorLabelText = icLabelText + icDestinationFloorPosition + icDestinationFloor.replace('_', ' ');
                    
                    this.addInterchangeLabel(changeFloorLabelText, pathSection);
                }
            } 
        }

// If ResetMap And WayFinding 

        if(wayFindingControlsState.resetMapAndWayFinding.reset){
            if(wayFindingControlsState.resetMapAndWayFinding.resetWayfinding){
                this.resetAllWayFinding();
            }
            if (wayFindingControlsState.resetMapAndWayFinding.resetMap){
                resetMap(wayFindingControlsState.resetMapAndWayFinding.resetMapAnimatedOption)
            }
            resetMapAndWayFinding(false, false, false, false);
            resetSelection();
            onRemovePath();
        }
    }

    deleteInterchangeLabel(){
        const { wayFindingControlsState, awm } = this.props;

        for(let i = 0; i < wayFindingControlsState.interchangeLabel.length; i++){
            const willBeDeletedLabel = Array.from(awm.objectManager.labels).filter(
                label => label[1].text === wayFindingControlsState.interchangeLabel[i]
            )
            if (willBeDeletedLabel && willBeDeletedLabel[0]) {
                awm.objectManager.removeLabel(willBeDeletedLabel[0][1]);
                if (willBeDeletedLabel && willBeDeletedLabel[1]){
                    awm.objectManager.removeLabel(willBeDeletedLabel[1][1]);
                }
            }
        }
    }

    addArrivalLabel(finalLabelText, pathSection){
        const { wayFindingControlsState, resetInterchangeLabel, arrivedLabel, awm } = this.props;

        const arrivedLabelText = new LabelTextObject({
            text: finalLabelText,
            offset: {
                x: 0,
                y: 0,
                z: 15,
            },
            style: {
                backgroundColor: '#00437a',
                backgroundOpacity: 0.9,
                backgroundRadius: 3,
                color: '#ffffff',
                size: 4,
            },
        });

        if(wayFindingControlsState.interchangeLabel.length>0){
            resetInterchangeLabel()
        }
        const findDuplicateArrivalLabel = wayFindingControlsState.arrivedLabel.find(function(element) {
            return element === finalLabelText;
        })
        if(!findDuplicateArrivalLabel){
            arrivedLabel(finalLabelText);
        }
        awm.objectManager.addLabelOnAdsumLocation(arrivedLabelText, pathSection[pathSection.length-1].to);
    }

    addInterchangeLabel(changeFloorLabelText, pathSection){
        const { wayFindingControlsState, interchangeLabel, awm, wayfindingState } = this.props;

        const changeFloorLabel = new LabelTextObject({
            text: changeFloorLabelText,
            offset: {
                x: 0,
                y: 0,
                z: 15,
            },
            style: {
                backgroundColor: '#00437a',
                backgroundOpacity: 0.9,
                backgroundRadius: 3,
                color: '#ffffff',
                size: 4,
            },
        });
        const findDuplicateIcLabel = wayFindingControlsState.interchangeLabel.find(function(element) {
            return element === changeFloorLabelText;
        })
        if(!findDuplicateIcLabel){
            interchangeLabel(changeFloorLabelText);
        }
        awm.objectManager.addLabelOnAdsumLocation(changeFloorLabel, pathSection[wayfindingState.currentSectionIndex].to);
    }

    resetAllWayFinding(){
        const { wayFindingControlsState, awm, destination, placeDestination } = this.props;

        if(wayFindingControlsState.arrivedLabel.length>0){
            const willBeDeletedArrivalLabel = Array.from(awm.objectManager.labels).filter(
                label => label[1].text === wayFindingControlsState.arrivedLabel[0]
            )
            if (willBeDeletedArrivalLabel && willBeDeletedArrivalLabel[0]) {
                for(let j = 0; j < willBeDeletedArrivalLabel.length; j++){
                    awm.objectManager.removeLabel(willBeDeletedArrivalLabel[j][1]);
                }
            }
        }
        if(wayFindingControlsState.interchangeLabel.length>0){
            this.deleteInterchangeLabel();
        }
        if(wayFindingControlsState.destination){
            destination(null);
        }
        if(wayFindingControlsState.placeDestination){
            placeDestination(null);
        }
    }

    render(){
        return(
            <React.Fragment>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state: AppStateType): MappedStatePropsType => ({
    wayfindingState: state.map.wayfindingState,
    getPath: state.map.getPath,
    wayFindingControlsState: state.wayFindingControls,
});

const mapDispatchToProps = (dispatch: *): MappedDispatchPropsType => ({
    takeMeThere: (poi) => {
        dispatch(WayFindingControlsActions.takeMeThere(poi));
    },
    destination: (poi) => {
        dispatch(WayFindingControlsActions.destination(poi));
    },
    placeDestination: (poiPlace) => {
        dispatch(WayFindingControlsActions.placeDestination(poiPlace));
    },
    arrivedLabel: (label) => {
        dispatch(WayFindingControlsActions.arrivedLabel(label));
    },
    interchangeLabel: (label) => {
        dispatch(WayFindingControlsActions.interchangeLabel(label));
    },
    resetInterchangeLabel: (value) => {
        dispatch(WayFindingControlsActions.resetInterchangeLabel(value));
    },
    resetMapAndWayFinding: (reset, resetMap, resetMapAnimatedOption, resetWayfinding) => {
        dispatch(WayFindingControlsActions.resetMapAndWayFinding(
            reset,
            resetMap,
            resetMapAnimatedOption, 
            resetWayfinding
            ));
    },
    resetMap: (animated: boolean = false): void => dispatch(MainActions.resetAction(false, true, animated)),
    onRemovePath: (): void => {
        dispatch(WayfindingActions.willResetPathAction());
    },
    resetSelection: (): void => {
        dispatch(SelectionActions.didResetSelectionAction());
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(WayFindingControls);