import React, { useState } from 'react';
import { Board } from './board/Board';

export const Container = (props) => {
    const [option, setOption] = useState('free');
    const [values, setValues] = useState({
        color: "#000000",
        size: "10"
    })
    const handleOnChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        })
    }
    return (
        <div className="container">
            <div className="color-picker">
                <input type="color" name="color" defaultValue={values.color} onChange={handleOnChange}/>
            </div>
            <div className="size-picker">
                <input type="range" name="size" min="1" max="50" defaultValue={values.size} onChange={handleOnChange}/>
            </div>
            <div>
                <input type='radio' id='free' checked={option === 'free'} onChange={() => setOption('free')} />
                <label htmlFor='free'>Free</label>
                <input type='radio' id='line' checked={option === 'line'} onChange={() => setOption('line')} />
                <label htmlFor='line'>Line</label>
                <input type='radio' id='rectangle' checked={option === 'rectangle'} onChange={() => setOption('rectangle')} />
                <label htmlFor='rectangle'>Rectangle</label>
            </div>
            <div className="board-container">
                <Board color={values.color} size={values.size} option={option}/>
            </div>
        </div>
    )
}
