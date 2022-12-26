import * as React from 'react';
import VideoPlayer from '../videoPlayer';
import SlideWrapper from '../slideWrapper';

import './videoSlide.css';

const VideoSlide = ({
    index,
    media,
    onPlayerInit,
    onVideoEnded,
    shouldReplayVideo,
}) => {
    const videoOptions = {
        sources: [{
            src: media.file.uri,
            type: media.file.file_type,
        }],
    };

    return (
        <VideoPlayer
            className="screenVideo"
            id={index}
            onPlayerInit={onPlayerInit}
            onVideoEnded={onVideoEnded}
            shouldReplayVideo={shouldReplayVideo}
            {...videoOptions}
        />
    );
};

export { VideoSlide as VideoSlideType };
export default SlideWrapper(VideoSlide);
