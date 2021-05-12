import React, { useEffect, useRef, useState } from 'react';
import {socket} from '../../../helpers/createSocket';
var oldColor = '#fff';
var oldSize = 5;

export const Board = ({color, size}) => {
    const [brushData, setBrushData] = useState({
        color: '#000',
        size: 5
    })
    useEffect(() => {
        drawOnCanvas();
    }, []);
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
            if (window.confirm("El socket con id " + data.idPeticion + " te ha enviado una peticion para entrar en la sala: " + data.roomKey)) {
                socket.emit('aceptado-room', data);
            } else {
                socket.emit('rechazado-room', data);
            }
        })
        /*socket.on("draw-data", (data) => {
            setBrushData(data);
        })*/
    });
    useEffect(() => {
        setBrushData({
            color: color,
            size: size
        });
    }, [color, size]);
    useEffect(() => {
        var canvas = document.querySelector('#board');
        var ctx = canvas.getContext('2d');
        changeBrushData(ctx, brushData);
    }, [brushData])
    const sendCtxData = (ctxData) => {
        socket.emit("canvas-data", ctxData);
    }
    const drawOnCanvas = () => {
        var canvas = document.querySelector('#board');
        var ctx = canvas.getContext('2d');
        var sketch = document.querySelector('#sketch');
        var sketch_style = getComputedStyle(sketch);
        canvas.width = parseInt(sketch_style.getPropertyValue('width'));
        canvas.height = parseInt(sketch_style.getPropertyValue('height'));
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
    const changeBrushData = (ctx, {color, size}, remote = false) => {
        ctx.lineWidth = size;
        ctx.strokeStyle = color;
        if(!remote) {
            oldColor = color;
            oldSize = size;
        }
    }
    return (
        <div id="sketch" className="sketch">
            <canvas onContextMenu={(e) => e.preventDefault()} className="board" id="board"></canvas>
        </div>
    )
}
