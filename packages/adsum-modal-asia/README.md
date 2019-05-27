# Carousel component

![image](https://user-images.githubusercontent.com/5297278/40351912-38f849c8-5db6-11e8-8690-8198ca33bad4.pnghttps://user-images.githubusercontent.com/5297278/40352018-82424548-5db6-11e8-838b-a0b4e64bc921.png)

## Getting started

1. Install this component using
    yarn add adsum-modal-asia
2. Setting Redux Reducers
    typically located on your_project_folder/src/rootReducer.js
    - import the reducer : 
    ```import { ModalReducers } from '@adactive/adsum-modal-asia';```
    - add ModalReducers on your root reducer, for example:
    ```
        const appState: AppStateType = {
        routing: routerReducer,
        map,
        loadingScreen,
        modal: ModalReducers
        };
    ```
3. How to Use it.

    in App.js
    - Get Modal Store into your (MapStatetoProps) for example modalState: state.modal
    - in **render** put for example 
        ```
            {modalState.open && modalState.name==="promotion" && <**YOURPROMOTIONMODAL** />}
        ```
    - Optionally, import ModalActions and put on your (mapDispatchToProps) in your app.js or your sidebar as a button
      to open a modal, for example: 
        in sidebar render
        ```
            <div classname="promotionButton" onClick={this.onPromotionClick}></div>
        ```
        in sidebar function 
        ```
            onPromotionClick = () => {
                const { openModal, setModal } = this.props;
                openModal(true);
                setModal('promotion');
            }
        ```
        in mapDispatchToProps 
        ```
            const mapDispatchToProps = (dispatch: *): MappedDispatchPropsType => ({
            openModal: (abc) => {
                dispatch(ModalActions.openModal(abc));
            },
            setModal: (name) => {
                dispatch(ModalActions.setModal(name));
            },
        });
        ```

    There is a nested Modal that we can save both the modal and the data, here's logic and the example

    - onPromotionClick above we open a PromotionModal that show all promotion categories
        we just send props openModal(true) and setModal(promotion).
        Let's say promotion Modal is opened. then there is a list of promotion categories that can be clicked.
    - onPromotionCategoriesClick we will put:
        ~ openModal(true)
        ~ setModal('promotionCategories')
        ~ setModalStructure('promotion') 
            **it must filled with the current modal, the purpose is if promotionCategories opened then user want
            to go back, it will go back to promotion. The last prop is**
        ~ setPoi(**itemThatClicked**)
            **this is useful to carry the item data, so in promotionCategories Modal we only call ModalState.poi
        Let's say promotionCategories Modal is opened, then there is a list of items from promotion categories, let's say food promotion categories display many items that can be clicked. Let's assume user want to see KFC promotion then we have onPromotionDetailClick function
    - it will contain:
        ~ openModal (true)
        ~ setModal('promotionDetail')
        ~ setModalStructure(promotionCategories)
        ~ setPoi(**itemThatClicked**)
        like onPromotionCategoriesClick, but now we need to save a data here.
        So, on promotion we display ALL categories, and then user pick a category (FOOD), this picked FOOD category we need to save. so when promotionDetail opened and user click Back, then it will back to FOOD category
        To do it, we need to save it using setPoiStructure. its function is same with setModalStructure but for DATA
        ~ setPoiStructure(**currentItem**)

4. Attach Modal Component
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
        <div style={{backgroundColor: "pink", fontSize: "36px"}}>PROMOTION MODAL</div>
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
