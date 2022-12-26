// @flow

import * as React from 'react';

import SlideWrapper from '../slideWrapper';

import './imageSlide.css';

const ImageSlide = ({ media }) => <img src={media.file.uri} alt="" />;

export { ImageSlide as ImageSlideType };
export default SlideWrapper(ImageSlide);
