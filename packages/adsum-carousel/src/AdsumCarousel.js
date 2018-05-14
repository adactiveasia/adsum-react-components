import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Carousel from 'nuka-carousel';

import ImageSlide from './subComponents/imageSlide';
import VideoSlide from './subComponents/videoSlide';

import './adsumCarousel.css';

class AdsumCarousel extends Component {
    constructor(props) {
        super(props);

        this._videoPlayers = {};

        this.onPlayerInit = this.onPlayerInit.bind(this);
        this.slideDidChange = this.slideDidChange.bind(this);
        this.goToNextSlide = this.goToNextSlide.bind(this);
        this.playVideo = this.playVideo.bind(this);

        this.state = { autoplay: true };
    }

    componentDidMount() {
        if (this._videoPlayers[0]) {
            this.playVideo(0);
        }
    }

    /**
     * Bind video players if need it
     *
     */
    onPlayerInit(videoPlayer, id) {
        this._videoPlayers[id] = videoPlayer;
    }

    /**
     * To play the video in the slide
     * @param id
     */
    playVideo(id) {
        this.setState(
            { autoplay: false },
            () => this._videoPlayers[id].play()
        );
    }


    /**
     * Wrapper for nuka-carousel to select next slide
     */
    goToNextSlide() {
        this.setState(
            { autoplay: true },
            () => this.carousel.nextSlide()
        );
    }

    /**
     * To play video immediately if the media is a video on slide change
     * @param id
     */
    slideDidChange(id) {
        if (!this.props.isOpen) return;
        if (this._videoPlayers[id]) return this.playVideo(id);
    }

    /**
     * Create carousel slides content images or videos
     *
     */
    generateSlides() {
        const {medias, onMediaTouch} = this.props;

        const ret = [];
        medias.forEach((media, index) => {
            if (media.file.file_type === 'video/mp4') {
            const component = (
                <div key={media.file.uri} onClick={()=>{onMediaTouch(media)}} onTouchEndCapture={()=>{onMediaTouch(media)}} >
                    <VideoSlide
                        index={index}
                        media={media}
                        onPlayerInit={this.onPlayerInit}
                        onVideoEnded={this.goToNextSlide}
                        shouldReplayVideo={medias.length === 1 && medias[0].file.file_type === 'video/mp4'}
                    />
                </div>
            );

            ret.push(component);
        } else {
            const component = (
                <div key={media.file.uri} onClick={()=>{onMediaTouch(media)}} onTouchEndCapture={()=>{onMediaTouch(media)}} >
                    <ImageSlide media={media} />
                </div>
        );

            ret.push(component);
        }
    });

        return ret;
    }

    render() {
        const {
            isOpen,autoplayInterval
        } = this.props;

        if (!isOpen) return null;

        const carouselSettings = {
            dragging: false,
            swiping: false,
            autoplay: this.state.autoplay,
            autoplayInterval,
            speed: 1000,
            afterSlide: this.slideDidChange,
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
            decorators: []
        };

        return (
            <div style={this.props.style? this.props.style: null} >
                <Carousel {...carouselSettings} className="adsumCarousel" ref={carousel => this.carousel = carousel}>
                    { this.generateSlides() }
                </Carousel>
            </div>
        );
    }
}

AdsumCarousel.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    medias: PropTypes.arrayOf(PropTypes.object).isRequired,
    onMediaTouch: PropTypes.func.isRequired,
    autoplayInterval: PropTypes.number,
};

AdsumCarousel.defaultProps = {
    isOpen: false,
    medias: [],
    onMediaTouch: null,
    autoplayInterval: 10000
};

export default AdsumCarousel;
