# Carousel component

![image](https://user-images.githubusercontent.com/5297278/40351912-38f849c8-5db6-11e8-8690-8198ca33bad4.pnghttps://user-images.githubusercontent.com/5297278/40352018-82424548-5db6-11e8-838b-a0b4e64bc921.png)

## Getting started

1. Install this component using
    yarn add adsum-screensaver-asia
2. Setting Redux Reducers
    typically located on your_project_folder/src/rootReducer.js
    - import the reducer : 
    **import { ScreenSaverReducers } from '@adactive/adsum-screensaver-asia';**
    - add ScreenSaverReducers on your root reducer, for example:
    const appState: AppStateType = {
        routing: routerReducer,
        map,
        loadingScreen,
        screenSaver: **ScreenSaverReducers**
    };
3. Setting Redux Actions in your Apps
    First thing to do is to import the action to file which you need the actions, for example app.js
    **import { ScreenSaverActions } from '@adactive/adsum-screensaver-asia';**

    There is 5 redux prop actions that this component have. Top 2 of that are mandatory to be applied tp make apps works well.
    
    - Action to close Screen Saver 
    **(ScreenSaverActions.screenSaverClose)**
    - Action to restart the timer (mainly used to on main app div onClick)
    **(ScreenSaverActions.appClick)**
    - Additional Custom Function you want when Screen Saver Close and Open
    **(ScreenSaverActions.customCloseFunction)** and **(ScreenSaverActions.customOpenFunction)**
    - Action to force open Screen Saver usually useful when using screensaver as homepage (can run customopenfunction too)
    **(ScreenSaverActions.forceOpenScreenSaver)**
    - Action to force close Screen Saver (can run customclosefunction too)
    **(ScreenSaverActions.forceCloseScreenSaver)**

    Put these to actions on the **mapDispatchToProps**  
    For Example:
    
    const **mapDispatchToProps** = (dispatch: *): MappedDispatchPropsType => ({
        **appClick**: (value: ?boolean) => {
            **dispatch(ScreenSaverActions.appClick(value))**;
        },
        **screenSaverClose**: (value: ?boolean) => {
            **dispatch(ScreenSaverActions.screenSaverClose(value))**;
        }
    });

    You can call function props **appClick(true)** to reset screensaver timer or **screenSaverClose(true)** to close screensaver in that file.

4. Attach ScreenSaver Component
    **Usually function screensaverclose is placed here**
    for example:
    ```javascript
    <ScreenSaver openFirst={true} inactivityTimer={2000}>**
                <div onClick={this.onScreenSaverClosed}>CLOSE</div>
                    <AdsumCarousel 
                        isOpen
                        medias={mediasList}
                        carouselOptions={{
                            dragging: true,
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            // adaptiveHeight: true,
                            wrapAround: true,
                            autoplayInterval: 1000,
                        }}
                        onMediaTouch={() => {}} // fix a bug inside AdsumCarousel
                        style={{ width: '1080px', height: '700px' }}
                        autoSlide={true}
                        autoSlideInterval={5000}
                    />
    </ScreenSaver>
```
    the Children (html elements or components inside <ScreenSaver> tag) will be called after screensaver's timer time out

5. Attach App Click on Your App(main) Component
    ```onClick={() => this.props.appClick(true)}```


### Props

**inactivityTimer** - time in ms, which should pass without any clicks inside the app for screensaver to appear

**openFirst** - a boolean to decide if screensaver open first as the app launched or not

**children** - html elements or components inside <ScreenSaver> tag that will be called after screensaver's timer time out

**customCloseFunction** - a serial custom function to attach when Screen Saver close

**customOpenFunction** - a serial custom function to attach when Screen Saver open

**forceOpenScreenSaver** - to activate force open screensaver or not (boolean)

**forceCloseScreenSaver** - to activate force close screensaver or not (boolean)
 
```javascript
type OwnPropsType = {|
    inactivityTimer: number,
    openFirst: boolean,
    children: Element<any>
    customCloseFunction: *,
    customOpenFunction: *,
|};

static defaultProps = {
    inactivityTimer: 10000,
    openFirst: true,
};

type MappedDispatchPropsType = {|
    appClick: (value: ?boolean) => void,
    screenSaverClose: (value: ?boolean) => void,
    forceOpenScreenSaver: (value: ?boolean) => void,
    forceCloseScreenSaver: (value: ?boolean) => void,
|};
```


## Copy component inside your project src folder  

### Less only
    `npx @adactive/adsum-screensaver copy --less-only`
    
### Full copy
    `npx @adactive/adsum-screensaver copy`
