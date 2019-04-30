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

    There is 2 redux prop actions that this component have:
    - Action to close Screen Saver 
    **(ScreenSaverActions.screenSaverClose)**
    - Action to restart the timer (mainly used to on main app div onClick)
    **(ScreenSaverActions.appClick)**

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
 
```javascript
type OwnPropsType = {|
    inactivityTimer: number,
    openFirst: boolean,
    children: Element<any>
|};

static defaultProps = {
    inactivityTimer: 10000,
    openFirst: true,
};
```


## Copy component inside your project src folder  

### Less only
    `npx @adactive/adsum-screensaver copy --less-only`
    
### Full copy
    `npx @adactive/adsum-screensaver copy`
