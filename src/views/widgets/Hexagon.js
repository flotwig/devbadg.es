import React, { Component } from 'react';

export default class Hexagon extends Component {
    render() {
        return (
            <svg height="300" width="280">
                <polygon points="300,150 225,280 75,280 0,150 75,20 225,20"></polygon>
            </svg>
        )
    }
}