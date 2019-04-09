// @flow

import * as React from 'react';
import type { Node } from 'react';
import Carousel from 'nuka-carousel';

import ImageSlide from './subComponents/imageSlide';
import VideoSlide from './subComponents/videoSlide';

import './adsumCarousel.css';

export type MediaType = {|
    file: {|
        uri: string,
        file_type: string
    |}
|};

type PropsType = {|
    isOpen?: boolean,
    medias?: Array<MediaType>,
    onMediaTouch?: (MediaType) => void,
    carouselOptions?: Object,
    style?: CSSStyleDeclaration,
    ButtonModalForImage?: ?HTMLButtonElement,
|};

class AdsumCarousel extends React.Component<PropsType> {
    static defaultProps = {
        isOpen: false,
        medias: [],
        onMediaTouch: null,
        carouselOptions: {
            dragging: false,
            swiping: false,
            speed: 1000,
            renderCenterLeftControls: null,
            renderCenterRightControls: null,
            renderCenterBottomControls: null,
            renderBottomCenterControls: null,
            arrows: false,
            pauseOnHover: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            adaptiveHeight: true,
            wrapAround: true,
        },
        dynamicAutoPlayInterval: false,
        style: {},
        ButtonModalForImage: null,
        autoSlide: false,
        autoSlideInterval: 10000,
    };

    constructor(props: PropsType) {
        super(props);

        this._videoPlayers = {};

        this.onPlayerInit = this.onPlayerInit.bind(this);
        this.slideDidChange = this.slideDidChange.bind(this);

        this.state = {
            setTimeoutSlide: null,
        };

    }

    componentDidMount() {
        const { setTimeoutSlide } = this.state;

        if (this._videoPlayers[0]) {
            if(setTimeoutSlide!==null) {clearTimeout(setTimeoutSlide)};

            this._videoPlayers[0].play();
            if(autoSlide){
                const firstVideoProp = this._videoPlayers[0].video.getProperties();
                const firstconvertedVideoDuration = (parseInt(firstVideoProp.duration) + 1)*1000;
                this.setState({
                    setTimeoutSlide: setTimeout(() => { this.carousel.goToSlide(1); }, firstconvertedVideoDuration),
                })
            }
        }
    }

    /**
     * Bind video players if need it
     *
     */
    onPlayerInit(videoPlayer: Player, id: number) {
        this._videoPlayers[id] = videoPlayer;
    }

    /**
     * To play video immediately if the media is a video on slide change
     * @param id
     */
    slideDidChange(id: number | string) {
        const { isOpen, autoSlide, autoSlideInterval } = this.props;
        const { setTimeoutSlide } = this.state;

        if (!isOpen) return;

        if (this._videoPlayers[id]) {
            if(setTimeoutSlide!==null) {clearTimeout(setTimeoutSlide)};

            const videoProp = this._videoPlayers[id].video.getProperties();
            const convertedVideoDuration = (parseInt(videoProp.duration) + 1)*1000;
            this._videoPlayers[id].play();

            if(autoSlide){
                if(id === (this.carousel.state.slideCount-1)){
                    this.setState({
                        setTimeoutSlide: setTimeout(() => { this.carousel.goToSlide(0); }, convertedVideoDuration),
                    })
                } else {
                    this.setState({
                        setTimeoutSlide: setTimeout(() => { this.carousel.goToSlide(id+1); }, convertedVideoDuration),
                    })
                }
            }

        } else {
            if(autoSlide){
                if(setTimeoutSlide!==null) {clearTimeout(setTimeoutSlide)};
    
                if(id === (this.carousel.state.slideCount-1)){
                    this.setState({
                        setTimeoutSlide: setTimeout(() => { this.carousel.goToSlide(0); }, autoSlideInterval),
                    })
                    
                } else {
                    this.setState({
                        setTimeoutSlide: setTimeout(() => { this.carousel.goToSlide(id+1); }, autoSlideInterval),
                    })
                }
            }
        }
    }

    /**
     * Create carousel slides content images or videos
     *
     */
    generateSlides(): Array<Node> {
        const {
            medias, onMediaTouch, ButtonModalForImage, style,
        } = this.props;

        const parentStyle = style || null;
        const ret = [];

        medias.forEach((media: MediaType, index: number) => {
            if (media.file.file_type === 'video/mp4' || media.file.file_type === 'video/x-m4v') {
                const component = (
                    <div
                        role="complementary"
                        key={media.file.uri}
                        onClick={() => {
                            onMediaTouch(media);
                        }}
                        onTouchEndCapture={() => {
                            onMediaTouch(media);
                        }}
                    >
                        <VideoSlide
                            index={index}
                            media={media}
                            onPlayerInit={this.onPlayerInit}
                            shouldReplayVideo={medias.length === 1 && (medias[0].file.file_type === 'video/mp4' || medias[0].file.file_type === 'video/x-m4v')}
                            parentStyle={parentStyle}
                        />
                    </div>
                );

                ret.push(component);
            } else {
                const component = (
                    <div
                        role="complementary"
                        key={media.file.uri}
                        onClick={() => {
                            onMediaTouch(media);
                        }}
                        onTouchEndCapture={() => {
                            onMediaTouch(media);
                        }}
                    >
                        <ImageSlide media={media} parentStyle={parentStyle} />
                        {
                            ButtonModalForImage
                                ? <ButtonModalForImage media={media} />
                                : null
                        }
                    </div>
                );

                ret.push(component);
            }
        });

        return ret;
    }

    render(): Node {
        const {
            isOpen, carouselOptions, style,
        } = this.props;

        if (!isOpen) return null;

        return (
            <div style={style}>
                <Carousel
                    {...carouselOptions}
                    afterSlide={this.slideDidChange}
                    className="adsumCarousel"
                    ref={(carousel: Carousel) => {
                        this.carousel = carousel;
                    }}
                >
                    {this.generateSlides()}
                </Carousel>
            </div>
        );
    }
}

export default AdsumCarousel;
