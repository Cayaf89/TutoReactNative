// Animations/FadeIn.js

import React from 'react'
import { Animated, Dimensions } from 'react-native'

class EnlargeShrink extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            viewSize: new Animated.Value(40),
        }
    }

    _getSize() {
        if (this.props.shouldEnlarge) {
            return 80
        }
        return 40
    }

    componentDidUpdate() {
        Animated.spring(
            this.state.viewSize,
            {
                toValue: this._getSize(),
            }
        ).start()
    }

    render() {
        return (
            <Animated.View
                style={{ width: this.state.viewSize, height: this.state.viewSize }}>
                {this.props.children}
            </Animated.View>
        )
    }
}

export default EnlargeShrink