// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import { ModalActions } from '..';

import './Modal.css';

/**
 * Modal widget, display a carousel of medias (images or videos) or "Touch to Navigate" message
 * @memberof module:Modal
 * @class
 * @extends React.Component
 */

type MappedStatePropsType = {|
    modalState: object,
|};

type MappedDispatchPropsType = {|
    openModal: (value: ?boolean) => void,
    setPoi: (poi: ?array) => void,
    setPoiParent: (parent: ?string) => void,
    setPreviousPoi: (poi: ?array) => void,
|};

// type OwnPropsType = {|
//     inactivityTimer: number,
//     openFirst: boolean,
//     children: *,
// |};

type PropsType = MappedStatePropsType & MappedDispatchPropsType & OwnPropsType;

type StateType = {||}

class Modal extends React.Component<PropsType, StateType> {
    static defaultProps = {
        backButton: false,
        modalPosition: {
            top: 0,
            right: null,
            bottom: null,
            left: 0,
        },
        modalWidth: "100%",
        modalHeight: "100%",
        modalColor: "white",
    }

    state = {
        modalIsOpen: false,
    };

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState) {
        const { modalState } = this.props;
        const { modalIsOpen } = this.state;

        // if(!modalIsOpen && modalState.open && prevProps.modalState.open !== modalState.open){
        //         this.setState({
        //             modalIsOpen: true,
        //         })
        //         console.log('pp')
        //     } 
        // if (modalIsOpen && !modalState.open && prevProps.modalState.open !== modalState.open) {
        //         this.setState({
        //             modalIsOpen: false,
        //         })
        // }

        // if(modalState.name==="promotion"){
        //     console.log("")
        // }
    }

    backFunction = () => {
        const { openModal, 
                setModal, 
                removeModalStructure,
                modalState } = this.props;
            
        if(modalState.structure.length>0){
            setModal(modalState.structure[modalState.structure.length-1])
            removeModalStructure();
        }
        else {
            openModal(false);
        }
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
                openModal,
                removeAllModalStructure } = this.props;

        return(
            <div 
                className="modalContainer" 
                style={{
                        width: modalWidth,
                        height: modalHeight,
                        top: modalPosition.top,
                        right: modalPosition.right,
                        bottom: modalPosition.bottom,
                        left: modalPosition.left,
                        backgroundColor: modalColor,
                        }}>
                    <div className="modalController">
                        <div className="backButton">
                            <img 
                                src={backImage ? backImage : null}
                                onClick={this.backFunction} 
                                />
                        </div>
                        <div className="closeButton">
                            <img 
                                src={closeImage} 
                                onClick={() => {
                                        openModal(false);
                                        removeAllModalStructure();
                                        }}/>
                        </div>
                    </div>
                    <div className="content">
                        {children}
                    </div>
            </div>
        )
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
    setPoi: (poi: ?array) => {
        dispatch(ModalActions.setPoi(poi));
    },
    setModalParent: (parent: ?string) => {
        dispatch(ModalActions.setModalParent(parent));
    },
    setModalStructure: (name: ?string) => {
        dispatch(ModalActions.setModalStructure(name));
    },
    removeModalStructure: () => {
        dispatch(ModalActions.removeModalStructure());
    },
    removeAllModalStructure: () => {
        dispatch(ModalActions.removeAllModalStructure());
    },
    setPreviousPoi: (poi: ?array) => {
        dispatch(ModalActions.setPreviousPoi(poi));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
