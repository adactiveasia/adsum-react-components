# Carousel component

![image](https://user-images.githubusercontent.com/5297278/40351912-38f849c8-5db6-11e8-8690-8198ca33bad4.pnghttps://user-images.githubusercontent.com/5297278/40352018-82424548-5db6-11e8-838b-a0b4e64bc921.png)

## Getting started

1. Install this component using
    yarn add @adactive/adsum-wayfindingcontrols-asia
2. Setting Redux Reducers
    typically located on your_project_folder/src/rootReducer.js
    - import the reducer :
    ```javascript
    import { WayFindingControlsReducers } from '@adactive/adsum-wayfindingcontrols-asia';
    ```
    - add WayFindingControlsReducers on your root reducer, for example:
    ```javascript
    const appState: AppStateType = {
        routing: routerReducer,
        map,
        loadingScreen,
        WayFindingControls: WayFindingControlsReducers
    };
    ```
    
3. Setting Redux Actions in your Apps
    First thing to do is to import the action to file which you need the actions, for example app.js
    ```javascript
    import { WayFindingControlsActions } from '@adactive/adsum-wayfindingcontrols-asia';
    ```

    There is 2 redux prop actions that this component have:
    - Action to go to Shop 
    ```javascript
    (WayFindingControlsActions.tmtt(poi, poiPlace))
    ```
    - Action to reset map and Wayfinding)
    ```javascript
    (resetMapAndWayFinding(true, true, true, true);)
    ```

    **there are 4 parameter in resetMapAndWayFinding**
    1. reset: needed to activate the resetMapAndWayFinding itself
    2. resetMap: needed if you want to resetMap
    3. resetMapOption: option to make the resetMap animated or not
    4. resetWayfinding: needed if you want to clear label and wayfinding path

    Put these to actions on the **mapDispatchToProps**  
    For Example:
    ```javascript
    const mapDispatchToProps = (dispatch: *): MappedDispatchPropsType => ({
        tmtt: (poi, poiPlace) => {
            WayFindingControlsActions.tmtt(poi, poiPlace));
        },
        resetMapAndWayFinding: (reset, resetMap, resetMapAnimatedOption, resetWayfinding) => {
        dispatch(WayFindingControlsActions.resetMapAndWayFinding(
            reset,
            resetMap,
            resetMapAnimatedOption, 
            resetWayfinding
            ));
        },
    });
    ```

4. Attach Wayfinding Component inside your Map Component
    for example:
    
    ```javascript
    <Map
            backgroundImage={MapBackground}
            store={store}
            awm={this.awm}
            isOpen={this.isMapOpen()}
            className="app-map-container"
            onClick={this.onMapClicked}
            userObjectLabel={this.userObjectLabel}
            getDrawPathSectionOptions={this.getDrawPathSectionOptions}
            zoom={{
                min: 20,
                max: 600,
            }}
        >
            <WayFindingControls
                awm={this.awm}
                kioskPlace={currentFloorFull}
            />
            <div id="adsum-web-map-container" ref={this.awmContainerRef}>
                <MapControls awm={this.awm} />
            </div>
    </Map>
```

###Props

    **This WayFinding Required TWO PROPS which are awm and kioskPlace**

    awm is AdsumWebMap

    kioskPlace is 

    ```javascript
        getCurrentFloorFull() {
            return this.awm.defaultFloor;
        }
    ```

    **If you want to take the POI destination or destination floor name u can get it on:**
    set connect and mapStateToProps
    ```javascript
        import { connect } from 'react-redux';
        const mapStateToProps = (state: AppStateType): MappedStatePropsType => ({
            wayFindingControlsState: state.wayFindingControls,
        });
    ```
    then call it on 
    ```javascript
        const { wayFindingControlsState } = this.props;
        {wayFindingControlsState
                && wayFindingControlsState.placeDestination 
                && wayFindingControlsState.placeDestination.name
                && `Your Destination is at 
                ${wayFindingControlsState.placeDestination.name.replace('_', ' ')}`}
    ```
    or get the POI destination
    ```javascript
        const { wayFindingControlsState } = this.props;
        wayFindingControlsState.destination[0]
    ```

    **This WayFinding Have FOUR OPTIONAL PROPS**
    1. destinationLabelText, it is Destination Label Text, the default was "You Reached (Shop)"
    2. icLabelText, it is InterChange Label Text, the default was "Head Down/Up (Floor)"
    3. arrivalLabelStyle, it is Destination Label Styling and Offset, the structure should be the same as the default which can see below (props Detail)
    4. interchangeLabelStyle, it is Interchange Label Styling and Offset, the structure should be the same as the default which can see below (props Detail)

# Props Detail
 
```javascript
type OwnPropsType = {|
    //props needed when call this component
    awm: *,
    kioskPlace: object,
    //optional props
    destinationLabelText: string,
    icLabelText: string,
    arrivalLabelStyle: object,
    interchangeLabelStyle: object,
|};

static defaultProps = {
        destinationLabelText: "You reached ",
        icLabelText: "Head ",
        arrivalLabelStyle: {
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
        },
        interchangeLabelStyle: {
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
        },
    }
```
***You can Edit sentence to use 

## Copy component inside your project src folder  

### Less only
    `npx @adactive/adsum-wayfindingcontrols copy --less-only`
    
### Full copy
    `npx @adactive/adsum-wayfindingcontrols copy`
