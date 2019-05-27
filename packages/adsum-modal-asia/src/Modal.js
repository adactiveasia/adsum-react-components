// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import { ModalActions } from '..';

import './Modal.css';
import defaultCloseImage from './close.svg';

/**
 * Modal widget, display a carousel of medias (images or videos) or "Touch to Navigate" message
 * @memberof module:Modal
 * @class
 * @extends React.Component
 */

type MappedDispatchPropsType = {|
    openModal: (value: ?boolean) => void,
    setModal: (name: ?boolean) => void,
    removeModalStructure: () => void,
    removeAllModalStructure: () => void,
    setPoi: (poi: ?array) => void,
    removePoiStructure: () => void,
    removeAllPoiStructure: () => void,
|};

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
    modalClassName: string,
|};

type PropsType = MappedStatePropsType & MappedDispatchPropsType & OwnPropsType;

type StateType = {||}

class Modal extends React.Component<PropsType, StateType> {
    static defaultProps = {
        backButton: null,
        modalPosition: {
            top: 0,
            right: null,
            bottom: null,
            left: 0,
        },
        modalWidth: '100%',
        modalHeight: '100%',
        modalColor: 'white',
        overlayOpen: true,
        overlayWidth: '100%',
        overlayHeight: '100%',
        overlayColor: 'white',
        overlayOpacity: '0.0',
        overlayPosition: {
            top: 0,
            right: null,
            bottom: null,
            left: 0,
        },
    }

    handleBack = () => {
        const {
            openModal,
            setModal,
            removeModalStructure,
            modalState,
            setPoi,
            removePoiStructure,
            customBackFunction,
        } = this.props;

        if (modalState.structure.length > 0) {
            ModalActions.modalToggle(true);

            if (customBackFunction) {
                customBackFunction();
            }

            setModal(modalState.structure[modalState.structure.length - 1]);
            removeModalStructure();

            if (modalState.poiStructure.length > 0) {
                if (customBackFunction) {
                    customBackFunction();
                }

                setPoi(modalState.poiStructure[modalState.poiStructure.length - 1]);
                removePoiStructure();
            }
        } else {
            if (customBackFunction) {
                customBackFunction();
            }
            openModal(false);
        }
    }

    handleClose = () => {
        const {
            openModal,
            removeAllModalStructure,
            removeAllPoiStructure,
            customCloseFunction,
        } = this.props;

        if (customCloseFunction) {
            customCloseFunction();
        }

        openModal(false);
        removeAllModalStructure();
        removeAllPoiStructure();
    }

    renderModal() {
        const {
            backImage,
            closeImage,
            modalWidth,
            modalHeight,
            modalPosition,
            modalColor,
            children,
            overlayOpen,
            overlayPosition,
            overlayWidth,
            overlayHeight,
            overlayColor,
            overlayOpacity,
            modalClassName,
        } = this.props;
        return (
            <React.Fragment>
                <div
                    className={modalClassName || 'modalContainer'}
                    style={{
                        width: modalWidth,
                        height: modalHeight,
                        top: modalPosition.top,
                        right: modalPosition.right,
                        bottom: modalPosition.bottom,
                        left: modalPosition.left,
                        backgroundColor: modalColor,
                    }}
                >
                    <div className="backButton">
                        {backImage
                            && (
                                <img
                                    src={backImage}
                                    onClick={this.handleBack}
                                    alt="modalBack"
                                />
                            )}
                    </div>
                    <div className="closeButton">
                        <img
                            src={closeImage || defaultCloseImage}
                            onClick={this.handleClose}
                            alt="modalClose"
                        />
                    </div>
                    <div className="content">
                        {children}

                    </div>
                </div>
                {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                <div
                    className="modalOverlay"
                    onClick={this.handleClose}
                    style={{
                        display: overlayOpen ? 'initial' : 'none',
                        width: overlayWidth,
                        height: overlayHeight,
                        backgroundColor: overlayColor,
                        opacity: overlayOpacity,
                        top: overlayPosition.top,
                        right: overlayPosition.right,
                        bottom: overlayPosition.bottom,
                        left: overlayPosition.left,
                    }}
                />
            </React.Fragment>
        );
    }

    render() {
        const { modalState } = this.props;

        return (
            <React.Fragment>
                {modalState.open && this.renderModal()}
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: AppStateType): MappedStatePropsType => ({
    modalState: state.modal,
});

const mapDispatchToProps = (dispatch: *): MappedDispatchPropsType => ({
    openModal: (value: ?boolean) => {
        dispatch(ModalActions.openModal(value));
    },
    setModal: (name: ?boolean) => {
        dispatch(ModalActions.setModal(name));
    },
    removeModalStructure: () => {
        dispatch(ModalActions.removeModalStructure());
    },
    removeAllModalStructure: () => {
        dispatch(ModalActions.removeAllModalStructure());
    },
    setPoi: (poi: ?array) => {
        dispatch(ModalActions.setPoi(poi));
    },
    removePoiStructure: () => {
        dispatch(ModalActions.removePoiStructure());
    },
    removeAllPoiStructure: () => {
        dispatch(ModalActions.removeAllPoiStructure());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
