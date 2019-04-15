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
        modalWidth: "100%",
        modalHeight: "100%"
    }

    state = {
        modalIsOpen: false,
    };

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState) {
        const { modalState } = this.props;
        // const { modalIsOpen } = this.state;

        if(prevProps.modalState !== modalState){
            if(modalState){
                this.setState({
                    modalIsOpen: true,
                })
            } else {
                this.setState({
                    modalIsOpen: false,
                })
            }

        }
    }

    renderModal() {
        const { 
                backImage, 
                closeImage, 
                modalWidth, 
                modalHeight,
                children } = this.props;

        return(
            <div 
                className="modalContainer" 
                style={{
                        width: modalWidth,
                        height: modalHeight,
                        backgroundColor: "green"
                        }}>
                    <div className="modalController">
                        <div className="backButton">
                            <img src={backImage? backImage : null} />
                        </div>
                        <div className="closeButton">
                            <img src={closeImage} />
                        </div>
                    </div>
                    <div className="modalChildren">
                        {children}
                    </div>
            </div>
        )
    }

    render() {
        const { modalIsOpen } = this.state;

        return (
            <React.Fragment>
                {modalIsOpen && this.renderModal()}
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
    setPoi: (poi: ?array) => {
        dispatch(ModalActions.setPoi(poi));
    },
    setPoiParent: (parent: ?string) => {
        dispatch(ModalActions.setPoiParent(parent));
    },
    setPreviousPoi: (poi: ?array) => {
        dispatch(ModalActions.setPreviousPoi(poi));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
