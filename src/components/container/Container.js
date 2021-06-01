import React, { useEffect, useState } from 'react';
import { Board } from './board/Board';
import {cookies} from '../../helpers/createCookies';
import { socket } from '../../helpers/createSocket';
var idSessionRoom = '';

export const Container = (props) => {
    if(!cookies.get('loggedIn')) props.history.push('/login');
    const [showRanges, setShowRanges] = useState(false);
    const [option, setOption] = useState('free');
    const [values, setValues] = useState({
        color: "#000000",
        size: "10",
        distortion: "0",
        img: ''
    });
    const [filter, setFilter] = useState('');
    const [customFilter, setCustomFilter] = useState({
        brightness: "1",
        saturate: "100",
        sepia: "0",
        blur: "0",
        contrast: "100"
    });
    const [useCustomFilter, setUseCustomFilter] = useState(false);
    const handleOnChangeBrushData = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        });
    }
    const handleOnChangeCustomFilterData = (e) => {
        setCustomFilter({
            ...customFilter,
            [e.target.name]: e.target.value
        });
        setTimeout(() => {
            socket.emit('customFilter', {custom: customFilter, idRoom: idSessionRoom, user: cookies.get('username')});
        }, 100);
    }
    const handleClickOnResetButton = () => {
        setCustomFilter({
            brightness: "1",
            saturate: "100",
            sepia: "0",
            blur: "0",
            contrast: "100"
        }, () => {
        });
    }
    const changeColorDataDropper = ({r, g, b}) => {
        console.log("Datos des del hijo: ", rgbToHex(r, g, b));
        setValues({
            ...values,
            color: rgbToHex(r, g, b)
        })
    }
    const componentToHex = (c) => {
        var hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      }
      
    const rgbToHex = (r, g, b) => {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
    useEffect(() => {
        const windowUrl = window.location.search;
        const params = new URLSearchParams(windowUrl);
        idSessionRoom = params.get('roomId');
    }, []);
    useEffect(() => {
        socket.on('filter', (data) => {
            if(data.user !== cookies.get('username')) setFilter(data.filter);
        });
        socket.on('customFilter', (data) => {
            if(data.user !== cookies.get('username')) setCustomFilter(data.custom);
        });
    }, []);
    return (
        <div className="container">
            <div className="color-picker">
                <input type="color" name="color" value={values.color} onChange={handleOnChangeBrushData}/> &nbsp;
                <input id="imgUrl" type="text" name="img" placeholder="URL de la imagen" value={values.img} onChange={handleOnChangeBrushData}/>
            </div>
            <div >
                <div className="switch-field options">
                    <input type='radio' id='free' checked={option === 'free'} onChange={() => setOption('free')} />
                    <label htmlFor='free'>🖌️</label>
                    <input type='radio' id='line' checked={option === 'line'} onChange={() => setOption('line')} />
                    <label htmlFor='line'>📏</label>
                    <input type='radio' id='rectangle' checked={option === 'rectangle'} onChange={() => setOption('rectangle')} />
                    <label htmlFor='rectangle'>🔳</label>
                    <input type='radio' id='dropper' checked={option === 'dropper'} onChange={() => setOption('dropper')} />
                    <label htmlFor='dropper'>💉</label>
                    &nbsp;
                </div>
                <div className="size-picker">
                    <h3 className="optionName">Tamaño del pincel</h3>
                    <input type="range" name="size" min="1" max="50" defaultValue={values.size} onChange={handleOnChangeBrushData}/>
                    {option === 'line' || option === 'rectangle' ? (
                        <span>
                            <h3 className="optionName">Tamaño de distorsión</h3>
                            <input type="range" name="distortion" min="0" max="15" step="0.1" defaultValue={values.distortion} onChange={handleOnChangeBrushData}/>
                        </span>
                    ) : (
                        <span hidden></span>
                    )}
                </div>
            </div>
            <div className="filters">
                {showRanges ? (
                    <div style={{float: 'right'}}>
                        <form className="switch-field" id="filterData">
                            <input type="button" id="reset" name="reset" value="Reset" onClick={handleClickOnResetButton}/>
                            <label htmlFor="reset">Reset</label>
                            <input type="radio" id="return" name="return" value="Volver" onChange={() =>{setFilter(''); setShowRanges(false); setUseCustomFilter(false);}}/>
                            <label htmlFor="return">Volver</label>
                        </form>
                        <br />
                        <h3 className="optionName">Brillo</h3>
                        <input type="range" name="brightness" min="0" max="4" step="0.1" defaultValue={customFilter.brightness} onChange={handleOnChangeCustomFilterData}/>
                        <h3 className="optionName">Saturación</h3>
                        <input type="range" name="saturate" min="0" max="200" defaultValue={customFilter.saturate} onChange={handleOnChangeCustomFilterData}/>
                        <h3 className="optionName">Sepia</h3>
                        <input type="range" name="sepia" min="0" max="100" defaultValue={customFilter.sepia} onChange={handleOnChangeCustomFilterData}/>
                        <h3 className="optionName">Difuminar</h3>
                        <input type="range" name="blur" min="0" max="15" defaultValue={customFilter.blur} onChange={handleOnChangeCustomFilterData}/>
                        <h3 className="optionName">Contraste</h3>
                        <input type="range" name="contrast" min="50" max="150" defaultValue={customFilter.contrast} onChange={handleOnChangeCustomFilterData}/>
                    </div>
                ): (
                    <div className="switch-field">
                        <input type="radio" id="empty" name="" value="Normal" checked={filter === ''} onChange={() => {setFilter(''); setShowRanges(false); socket.emit('filter', {filter: filter, idRoom: idSessionRoom, user: cookies.get('username')})}}/>
                        <label htmlFor='empty'>Normal</label>
                        <input type="radio" id="grayscale" name="grayscale" value="Blanco y negro" checked={filter === 'grayscale'} onChange={() => {setFilter('grayscale'); setShowRanges(false); socket.emit('filter', {filter: filter, idRoom: idSessionRoom, user: cookies.get('username')})}}/>
                        <label htmlFor='grayscale'>Blanco y negro</label>
                        <input type="radio" id="invert" name="invert" value="Invertir" checked={filter === 'invert'} onChange={() => {setFilter('invert'); setShowRanges(false); socket.emit('filter', {filter: filter, idRoom: idSessionRoom, user: cookies.get('username')})}}/>
                        <label htmlFor='invert'>Invertir</label>
                        <input type="radio" id="brightness" name="brightness" value="Brillo" checked={filter === 'brightness'} onChange={() => {setFilter('brightness'); setShowRanges(false); socket.emit('filter', {filter: filter, idRoom: idSessionRoom, user: cookies.get('username')})}}/>
                        <label htmlFor='brightness'>Brillo</label>
                        <input type="radio" id="saturation" name="saturation" value="Saturar" checked={filter === 'saturation'} onChange={() => {setFilter('saturation'); setShowRanges(false); socket.emit('filter', {filter: filter, idRoom: idSessionRoom, user: cookies.get('username')})}}/>
                        <label htmlFor='saturation'>Saturar</label>
                        <input type="radio" id="sepia" name="sepia" value="Sepia" checked={filter === 'sepia'} onChange={() => {setFilter('sepia'); setShowRanges(false); socket.emit('filter', {filter: filter, idRoom: idSessionRoom, user: cookies.get('username')})}}/>
                        <label htmlFor='sepia'>Sepia</label>
                        <input type="radio" id="blur" name="blur" value="Difuminar" checked={filter === 'blur'} onChange={() => {setFilter('blur'); setShowRanges(false); socket.emit('filter', {filter: filter, idRoom: idSessionRoom, user: cookies.get('username')})}}/>
                        <label htmlFor='blur'>Difuminar</label>
                        <input type="radio" id="contrast" name="contrast" value="Contrastar" checked={filter === 'contrast'} onChange={() => {setFilter('contrast'); setShowRanges(false); socket.emit('filter', {filter: filter, idRoom: idSessionRoom, user: cookies.get('username')})}}/>
                        <label htmlFor='contrast'>Contrastar</label>
                        <input type="radio" id="custom" name="custom" value="Personalizado" checked={filter === 'custom'} onChange={() => {setFilter('normal'); setShowRanges(true); setUseCustomFilter(true);}}/>
                        <label htmlFor='custom'>Personalizado</label>
                    </div>
                )}
            </div>
            <div className="board-container">
                <Board color={values.color} size={values.size} option={option} img={values.img} filter={filter} brightness={customFilter.brightness} saturate={customFilter.saturate} sepia={customFilter.sepia} blur={customFilter.blur} contrast={customFilter.contrast} customFilter={useCustomFilter} changeColorDataDropper={changeColorDataDropper} distortion={values.distortion} socket={socket}/>
            </div>
        </div>
    )
}
