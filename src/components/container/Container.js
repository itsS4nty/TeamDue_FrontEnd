import React from 'react';
import { Board } from './board/Board';

export const Container = (props) => {
    return (
        <div className="container">
            <div className="color-picker">
                <input type="color" />
            </div>
            <div className="board-container">
                <Board />
            </div>
        </div>
    )
}