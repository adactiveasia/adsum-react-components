# Carousel component

![image](https://user-images.githubusercontent.com/5297278/40351912-38f849c8-5db6-11e8-8690-8198ca33bad4.pnghttps://user-images.githubusercontent.com/5297278/40352018-82424548-5db6-11e8-838b-a0b4e64bc921.png)

## Getting started

1. Install this component using
    yarn add adsum-modal-asia
2. Setting Redux Reducers
    typically located on your_project_folder/src/rootReducer.js
    - import the reducer : 
    ```import { ModalReducers } from '@adactive/adsum-modal-asia';```
    - add ScreenSaverReducers on your root reducer, for example:
    ```
        const appState: AppStateType = {
        routing: routerReducer,
        map,
        loadingScreen,
        modal: ModalReducers
        };
    ```
3. Setting Redux Actions in your Apps
    First thing to do is to import the action to file which you need the actions, for example app.js
    ```import { ModalActions } from '@adactive/adsum-modal-asia';```

    There is 5 redux prop actions that this component have:

    The first action is ***ONLY*** required if a function want to open children of current modal but we need to save the poi for back button. Usually it used on children that want to call grandchildren
        - Action to save the poi in the structure for nested
        **(ModalActions.setPoiStructure)**
    This Following Two Actions is required to show modal
        - Action to set which modal will appear
        **(ModalActions.setModal)**
        - Action to open the modal
        **(ModalActions.openModal)**
    The Following Two Actions is required when a function is opening a child of nested modal
        - Action to set which modal is the parent of will be opened modal
        **(ModalActions.setModalStructure)**
        - Action to save the poi of current modal
        **(ModalActions.setPoi)**

    Put these to actions on the **mapDispatchToProps**  
    For Example:
    
    ```
    const mapDispatchToProps = (dispatch: *): MappedDispatchPropsType => ({
        openModal: (abc) => {
            dispatch(ModalActions.openModal(abc));
        },
        setModal: (name) => {
            dispatch(ModalActions.setModal(name));
        },
        setModalStructure: (name) => {
            dispatch(ModalActions.setModalStructure(name));
        },
        setPoi: (item) => {
            dispatch(ModalActions.setPoi(item));
        },
        setPoiStructure: (item) => {
            dispatch(ModalActions.setPoiStructure(item));
        }
    });
    ```

4. Attach ScreenSaver Component
    for example:
    ```javascript
    <Modal  
        backImage={backImage}
        closeImage={closeImage}
        modalWidth={"100px"}
        modalHeight={"100px"}
        modalPosition={{
            top: '0',
            left: '200px'
        }}
        modalColor={"blue"}
        overlayOpen={true}
        overlayWidth={"400px"}
        overlayHeight={"400px"}
        overlayColor={"green"}
        overlayOpacity={"1.0"}
        overlayPosition={{
            top: '0',
            left: '200px',
        }}
    >
        <div style={{backgroundColor: "pink", fontSize: "36px"}}>MODAL THREE</div>
    </Modal>
```

### Props

**backButton** - Back Icon, if not provided, will be no back button on Modal

**modalPosition** - modal Position in object contains top, right, bottom, and left

**modalWidth** - modal width in string
**modalHeight** - modal height in string
**modalColor** - modal color in string

**overlayOpen** - overlay open or not in boolean

**overlayWidth** - overlay width in string
**overlayHeight** - overlay height in string
**overlayColor** - overlay color in string

**overlayOpacity**: overlay opacity in string, in default will be set 0.0 or transparent,

**overlayPosition**: overlay Position in object contains top, right, bottom, and left,
 
```javascript
type OwnPropsType = {|
    backButton: string,
    modalPosition: object,
    modalWidth: string,
    modalHeight: string,
    modalColor: string,
    overlayOpen: boolean,
    overlayWidth: string,
    overlayHeight: string,
    overlayColor: string,
    overlayOpacity: string,
    overlayPosition: array,
|};

static defaultProps = {
        backButton: null,
        modalPosition: {
            top: 0,
            right: null,
            bottom: null,
            left: 0,
        },
        modalWidth: "100%",
        modalHeight: "100%",
        modalColor: "white",
        overlayOpen: true,
        overlayWidth: "100%",
        overlayHeight: "100%",
        overlayColor: "white",
        overlayOpacity: "0.0",
        overlayPosition: {
            top: 0,
            right: null,
            bottom: null,
            left: 0,
        },
    }
```


## Copy component inside your project src folder  

### Less only
    `npx @adactive/adsum-modal-asia copy --less-only`
    
### Full copy
    `npx @adactive/adsum-modal-asia copy`
