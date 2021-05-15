import React, { useEffect, useState } from 'react';
import {socket} from '../../../helpers/createSocket';
import { ToastContainer, Slide } from 'react-toastify';
import rough from 'roughjs/bundled/rough.esm';
import {showToast} from '../../../helpers/toast';
import { SessionRequest } from '../../toasts/sessionRequest/SessionRequest';
var oldColor = '#fff';
var oldSize = 5;
var option = 'free';
var drawLine = false;
var cross = false;
const generator = rough.generator();

const createElement = (x1, y1, x2, y2) => {
    const roughElement = generator.line(x1, y1, x2, y2);
    return {x1, y1, x2, y2, roughElement};
}

export const Board = ({color, size, option:opt}) => {
    const [lineCoordinates, setLineCoordinates] = useState({
        x1: undefined,
        y1: undefined
    })
    const [brushData, setBrushData] = useState({
        color: '#000',
        size: 5
    })
    useEffect(() => {
        drawOnCanvas();
    }, []);
    // useEffect(() => {
    //     // const rCanvas = document.getElementById("boardLineRect");
    //     // const rCtx = rCanvas.getContext("2d");
    //     // rCtx.clearRect(0, 0, rCtx.width, rCtx.height);
    //     // const rrCanvas = rough.canvas(rCanvas);
    //     // elements.forEach(({roughElement}) => rrCanvas.draw(roughElement));
    //     // const rect = generator.rectangle(10, 10, 100, 100);
    //     // const line = generator.line(10, 10, 110, 110);
    //     // rrCanvas.draw(rect);
    //     // rrCanvas.draw(line);
    // }, [elements])
    useEffect(() => {
        if(!socket) return;
        socket.on("canvas-data", (data) => {
            var canvas = document.querySelector("#board");
            var ctx = canvas.getContext("2d");
            var {moveToX, moveToY, lineToX, lineToY, color, size} = data;
            // changeBrushData(ctx, {color, size}, true);
            draw(ctx, moveToX, moveToY, lineToX, lineToY, true, color, size);
        });
        socket.on("peticion-recibida", (data) =>{
            var {idPeticion, nombreUsuario, roomKey} = data;
            showToast("request", <SessionRequest idPeticion={idPeticion} nombreUsuario={nombreUsuario} roomKey={roomKey}/>)
            
            // if (window.confirm("El socket con id " + data.idPeticion + " te ha enviado una peticion para entrar en la sala: " + data.roomKey)) {
            //     socket.emit('aceptado-room', data);
            // } else {
            //     socket.emit('rechazado-room', data);
            // }
        })
    }, []);
    useEffect(() => {
        setBrushData({
            color: color,
            size: size
        });
        option = opt;
        if(option === 'line') {
            drawLine = true;
            cross = true;
        } else {
            cross = false;
            drawLine = false;
        }
    }, [color, size, opt]);
    useEffect(() => {
        var canvas = document.querySelector('#board');
        var ctx = canvas.getContext('2d');
        changeBrushData(ctx, brushData);
    }, [brushData])
    const sendCtxData = (ctxData) => {
        socket.emit("canvas-data", ctxData);
    }
    const drawOnCanvas = () => {
        // var rCanvas = document.getElementById("boardLineRect");
        // var rCtx = rCanvas.getContext("2d");
        // rCtx.clearRect(0, 0, rCanvas.width, rCanvas.height);
        var canvas = document.querySelector('#board');
        var ctx = canvas.getContext('2d');
        // ctx.clearRect(0, 0, canvas.width, canvas.height);
        var sketch = document.querySelector('#sketch');
        var sketch_style = getComputedStyle(sketch);
        canvas.width = parseInt(sketch_style.getPropertyValue('width'));
        canvas.height = parseInt(sketch_style.getPropertyValue('height'));
        // canvas.width = canvas.parentNode.offsetWidth;
        // canvas.height = canvas.parentNode.offsetHeight;
        var mouse = {x: 0, y: 0};
        var last_mouse = {x: 0, y: 0};
        /* Mouse Capturing Work */
        canvas.addEventListener('mousemove', function(e) {
            last_mouse.x = mouse.x;
            last_mouse.y = mouse.y;
            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;
        }, false);
        /* Drawing on Paint App */
        ctx.lineWidth = brushData.size;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = brushData.color;
        canvas.addEventListener('mousedown', function(e) {
            canvas.addEventListener('mousemove', onPaint, false);
        }, false);
    
        canvas.addEventListener('mouseup', function() {
            canvas.removeEventListener('mousemove', onPaint, false);
        }, false);
        var onPaint = function() {
            var {x:lX, y:lY} = last_mouse;
            var {x:mX, y: mY} = mouse;
            var movements = {
                moveToX: lX,
                moveToY: lY,
                lineToX: mX,
                lineToY: mY,
                color: ctx.strokeStyle,
                size: ctx.lineWidth
            }
            sendCtxData(movements);
            draw(ctx, lX, lY, mX, mY, false);
        };
    }
    const draw = (ctx, lineToX, lineToY, moveToX, moveToY, remote = false, color = undefined, size = undefined) => {
        if(option === 'free') {
            freeDraw(ctx, lineToX, lineToY, moveToX, moveToY, remote, color, size);
        } else if(option === 'line') {
            // stuff...
            lineDraw(lineToX, lineToY, moveToX, moveToY);
        } else if(option === 'rectangle') {
            // stuff...
        }
        
    }
    const changeBrushData = (ctx, {color, size}, remote = false) => {
        ctx.lineWidth = size;
        ctx.strokeStyle = color;
        if(!remote) {
            oldColor = color;
            oldSize = size;
        }
    }
    const freeDraw = (ctx, lineToX, lineToY, moveToX, moveToY, remote, color, size) => {
        var colorToDraw, sizeToDraw;
        if(!remote) {
            colorToDraw = oldColor;
            sizeToDraw = oldSize;
        } else {
            colorToDraw = color;
            sizeToDraw = size;
        }
        ctx.beginPath();
        ctx.moveTo(moveToX, moveToY);
        ctx.lineTo(lineToX, lineToY);
        // changeBrushData(ctx, {color: colorToDraw, size: sizeToDraw});
        ctx.lineWidth = sizeToDraw;
        ctx.strokeStyle = colorToDraw;
        ctx.closePath();
        ctx.stroke();
    }
    const lineDraw = (e) => {
        var {x1, y1} = lineCoordinates;
        if(drawLine) {
            var canvas = document.querySelector('#board');
            var ctx = canvas.getContext('2d');
            var rect = canvas.getBoundingClientRect();
            if(x1 === undefined && y1 === undefined) {
                setLineCoordinates({
                    ...lineCoordinates,
                    x1: e.clientX - rect.left,
                    y1: e.clientY - rect.top
                });
            } else {
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
                // changeBrushData(ctx, {color: colorToDraw, size: sizeToDraw});
                // ctx.lineWidth = sizeToDraw;
                // ctx.strokeStyle = colorToDraw;
                ctx.closePath();
                ctx.stroke();
                setLineCoordinates({
                    ...lineCoordinates,
                    x1: undefined,
                    y1: undefined
                });
                return;
            }
        }
    }
    const lineRect = (e) => {
        var {x1, y1} = lineCoordinates;
        if(drawLine) {
            var canvas = document.querySelector('#board');
            var ctx = canvas.getContext('2d');
            var rect = canvas.getBoundingClientRect();
            if(x1 === undefined && y1 === undefined) {
                setLineCoordinates({
                    ...lineCoordinates,
                    x1: e.clientX - rect.left,
                    y1: e.clientY - rect.top
                });
            } else {
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.strokeRect(x1, y1, e.clientX - rect.left - x1, e.clientY - rect.top - y1);
                // changeBrushData(ctx, {color: colorToDraw, size: sizeToDraw});
                // ctx.lineWidth = sizeToDraw;
                // ctx.strokeStyle = colorToDraw;
                ctx.closePath();
                ctx.stroke();
                setLineCoordinates({
                    ...lineCoordinates,
                    x1: undefined,
                    y1: undefined
                });
                return;
            }
        }
    }
    return (
        <div id="sketch" className="sketch">
            {/*<canvas onContextMenu={(e) => e.preventDefault()} className="board" id="boardLineRect"></canvas>*/}
            <canvas onContextMenu={(e) => e.preventDefault()} className={`board ${cross ? "crosshairCursor" : ""}`} id="board" onClick={lineRect}></canvas>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                rtl={false}
                pauseOnFocusLoss={false}
                pauseOnHover={false}
                transition={Slide}
                toastClassName="toastClass"
                closeOnClick
                draggable
            />
        </div>
    )
}
