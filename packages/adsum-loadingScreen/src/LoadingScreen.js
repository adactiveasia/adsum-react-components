import * as React from 'react';
import { connect } from 'react-redux';
import './LoadingScreen.css';

class LoadingScreen {
    static defaultProps = {
        open: true,
        hideLogo: false,
        hidePercentage: false,
        hideBar: false,
        transition: 'width .1s ease-in-out',
        minPercentage: 10,
        mainColor: '#6EC8F1',
        barColor: 'white',
        logo: '/assets/img/adsum-logo.png',
    };

    getPercentage() {
        const { percentage, minPercentage } = this.props;

        if (percentage < minPercentage) return minPercentage;

        if (percentage > 100) return 100;

        return percentage;
    }

    shouldDisplay() {
        const { open } = this.props;
        if (!open) return false;

        const percentage = this.getPercentage();
        if (percentage === 100) return false;

        return true;
    }

    renderLogo() {
        const { logo, hideLogo } = this.props;

        return hideLogo ? null : (
            <div className="logo-wrapper">
                <img src={logo} alt="loading screen logo" />
            </div>
        );
    }

    renderBar() {
        const { transition, barColor, hideBar } = this.props;
        const percentage = this.getPercentage();

        if (hideBar) return null;

        const barWrapperStyle = {
            border: `solid 3px ${barColor}`,
        };

        const barStyle = {
            width: `${percentage}%`,
            backgroundColor: barColor,
            transition,
        };

        return (
            <div className="progression-bar-wrapper" style={barWrapperStyle}>
                {
                    percentage === null ? null
                        : <div className="progression-bar" style={barStyle} />
                }
            </div>
        );
    }

    renderPercentage() {
        const { barColor, hidePercentage } = this.props;
        const percentage = this.getPercentage();

        if (hidePercentage) return null;

        const percentageStyle = {
            color: barColor,
        };

        return percentage === null ? null
            : (
                <div className="percentage-number" style={percentageStyle}>
                    {`${percentage} %`}
                </div>
            );
    }

    // ------------------------------------------ Render -------------------------------------------
    render() {
        const { mainColor } = this.props;

        const loadingScreenStyle = {
            backgroundColor: mainColor,
        };

        return !this.shouldDisplay() ? null : (
            <div className="loadingScreen" style={loadingScreenStyle}>
                { this.renderLogo() }
                { this.renderBar() }
                { this.renderPercentage() }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    percentage: state.loadingScreen.percentage,
});

export default connect(
    mapStateToProps,
    null,
)(LoadingScreen);
