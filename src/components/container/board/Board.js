import React, { useEffect, useState } from 'react';
// import {socket} from '../../../helpers/createSocket';
import { ToastContainer, Slide } from 'react-toastify';
import rough from 'roughjs/bundled/rough.esm';
import {showToast} from '../../../helpers/toast';
import { SessionRequest } from '../../toasts/sessionRequest/SessionRequest';
import {cookies} from '../../../helpers/createCookies';
import { ColorizeTwoTone } from '@material-ui/icons';
import axios from 'axios';
var oldColor = '#fff';
var oldSize = 5;
var option = 'free';
var drawLine = false;
var cross = false;
var filter = '';
var distortion = 0;
var brightness = 1, saturate = 100, sepia = 0, blur = 0, contrast = 100, customFilter = false;
var imgStyle = {
    filter: `brightness(${brightness}) saturate(${saturate}%) sepia(${sepia}) blur(${blur}px) contrast(${contrast}%)`
};
const generator = rough.generator();
var sessionId = Math.floor(Math.random() * 1001)

var idSessionRoom = '', fileId = '', fileName = '';

export const Board = ({location, color, size, option:opt, img:image, filter:filterChange, brightness:brightnessChange, saturate:saturateChange, sepia:sepiaChange, blur:blurChange, contrast:contrastChange, customFilter:customFilterChange, changeColorDataDropper, distortion:distortionChange, socket}) => {
    const [lineCoordinates, setLineCoordinates] = useState({
        x1: undefined,
        y1: undefined
    });
    const [brushData, setBrushData] = useState({
        color: '#000',
        size: 5
    });
    const [canvasWH, setCanvasWH] = useState({
        width: 0,
        height: 0
    })
    useEffect(() => {
        const windowUrl = window.location.search;
        const params = new URLSearchParams(windowUrl);
        sessionId = sessionId.toString(); 
        idSessionRoom = params.get('roomId');
        fileId = params.get('fileId');
        fileName = params.get('fileName');
        if(!params.get('button')) socket.emit("join-room", {roomId: idSessionRoom, usuario: cookies.get('username')}); 
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
        var canvas = document.getElementById(sessionId);
        var rCanvas = rough.canvas(canvas);
        var ctx = canvas.getContext("2d");
        socket.on("canvas-data", (data) => {
            if(data.sessionId !== sessionId) {
                var {moveToX, moveToY, lineToX, lineToY, color, size} = data;
                // changeBrushData(ctx, {color, size}, true);
                draw(ctx, moveToX, moveToY, lineToX, lineToY, true, color, size);
            }
        });
        socket.on("peticion-recibida", (data) =>{
            var {idPeticion, nombreUsuario, roomKey} = data;
            showToast("request", <SessionRequest idPeticion={idPeticion} nombreUsuario={nombreUsuario} roomKey={roomKey}/>)
        });
        socket.on("draw-line", ({x1, y1, x2, y2, strokeWidth, stroke, roughness}) => {
            var line = generator.line(x1, y1, x2, y2, {roughness: roughness, strokeWidth: strokeWidth, stroke: stroke});
            rCanvas.draw(line);
        });
        socket.on("draw-rect", ({x1, y1, x2, y2, strokeWidth, stroke, roughness}) => {
            var rect = generator.rectangle(x1, y1, x2, y2, {roughness: roughness, strokeWidth: strokeWidth, stroke: stroke});
            rCanvas.draw(rect);
        });
        socket.on("background-image", (data) => {
            var {image, canvasWH:wh} = data;
            var canvas = document.getElementById(sessionId);
            var ctx = canvas.getContext("2d");
            var background = new Image();
            background.crossOrigin = "Anonymous";
            background.onload = () => {
                ctx.drawImage(background, 0, 0, wh.width, wh.height);
            }
            background.src = image;
        });
        socket.on("entrando-sala", (data) => {
            socket.emit("canvas", {canvas: canvas.toDataURL(), idRoom: idSessionRoom});
        })
        socket.on("canvas", (data) => {
            var im = new Image();
            im.onload = () => {
                ctx.drawImage(im, 0, 0);
            }
            im.src = data;
        })
        socket.emit("refresh-page", {usuario: cookies.get('username'), idRoom: idSessionRoom, canvas: canvas.toDataURL()});
        window.onpopstate = e => {
            socket.disconnect();
        }
    }, []);
    useEffect(() => {
        customFilter = customFilterChange;
        brightness = brightnessChange;
        blur = blurChange;
        contrast = contrastChange;
        sepia = sepiaChange;
        saturate = saturateChange;
        distortion = distortionChange;
        imgStyle  = {
            filter: `brightness(${brightness}) saturate(${saturate}%) sepia(${sepia}) blur(${blur}px) contrast(${contrast}%)`
        }
        setBrushData({
            color: color,
            size: size
        });
        option = opt;
        filter = filterChange;
        var canvas = document.getElementById(sessionId);
        //socket.emit('filters', {image: canvas.toDataURL(), canvasWH: canvasWH, idRoom: idSessionRoom});
        if(option === 'line' || option === 'rectangle') {
            drawLine = true;
            cross = true;
        } else {
            cross = false;
            drawLine = false;
        }
        
    }, [color, size, opt, filterChange, brightnessChange, blurChange, contrastChange, sepiaChange, saturateChange, customFilterChange, distortionChange]);
    useEffect(() => {
        var canvas = document.getElementById(sessionId);
        var ctx = canvas.getContext("2d");
        var background = new Image();
        background.crossOrigin = "Anonymous";
        background.src = image;
        background.onload = () => {
            ctx.drawImage(background, 0, 0, canvasWH.width, canvasWH.height);
        }
        socket.emit('background-image', {image:image, canvasWH: canvasWH, idRoom: idSessionRoom});
    }, [image, canvasWH]);
    useEffect(() => {
        var canvas = document.getElementById(sessionId);
        var ctx = canvas.getContext('2d');
        changeBrushData(ctx, brushData);
    }, [brushData]);
    useEffect(() => {
        var canvas = document.getElementById(sessionId);
        var ctx = canvas.getContext("2d");
        var background = new Image();
        var sketch = document.querySelector('#sketch');
        var sketch_style = getComputedStyle(sketch);
        var w = parseInt(sketch_style.getPropertyValue('width'));
        var h = parseInt(sketch_style.getPropertyValue('height'));
        background.crossOrigin = "Anonymous";
        background.src = `http://51.38.225.18:3000/file/${fileId}`;
        background.onload = () => {
            ctx.drawImage(background, 0, 0, w, h);
        }
    }, [])
    const sendCtxData = (ctxData) => {
        socket.emit("canvas-data", {canvas: ctxData, idRoom: idSessionRoom});
    }
    const drawOnCanvas = () => {
        // var rCanvas = document.getElementById("boardLineRect");
        // var rCtx = rCanvas.getContext("2d");
        // rCtx.clearRect(0, 0, rCanvas.width, rCanvas.height);
        var canvas = document.getElementById(sessionId);
        var ctx = canvas.getContext('2d');
        // ctx.clearRect(0, 0, canvas.width, canvas.height);
        var sketch = document.querySelector('#sketch');
        var sketch_style = getComputedStyle(sketch);
        canvas.width = parseInt(sketch_style.getPropertyValue('width'));
        canvas.height = parseInt(sketch_style.getPropertyValue('height'));
        setCanvasWH({
            ...canvasWH,
            width: canvas.width,
            height: canvas.height
        })
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
                size: ctx.lineWidth,
                sessionId: sessionId,
                idRoom: idSessionRoom
            }
            sendCtxData(movements);
            draw(ctx, lX, lY, mX, mY, false);
        };
    }
    const draw = (ctx, lineToX, lineToY, moveToX, moveToY, remote = false, color = undefined, size = undefined) => {
        if(option === 'free' || remote) {
            freeDraw(ctx, lineToX, lineToY, moveToX, moveToY, remote, color, size);
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
        ctx.lineWidth = sizeToDraw;
        ctx.strokeStyle = colorToDraw;
        ctx.closePath();
        ctx.stroke();
    }
    const handleOnClick = (e) => {
        if(option === 'line') {
            lineDraw(e);
        } else if(option === 'rectangle') {
            rectDraw(e);
        } else if(option === 'dropper') {
            getColor(e);
        }
    }
    const lineDraw = (e) => {
        var {x1, y1} = lineCoordinates;
        if(drawLine) {
            var canvas = document.getElementById(sessionId);
            var rCanvas = rough.canvas(canvas);
            var rect = canvas.getBoundingClientRect();
            if(x1 === undefined && y1 === undefined) {
                setLineCoordinates({
                    ...lineCoordinates,
                    x1: e.clientX - rect.left,
                    y1: e.clientY - rect.top
                });
            } else {
                var dataToSend = {
                    x1: x1,
                    y1: y1,
                    x2: e.clientX - rect.left,
                    y2: e.clientY - rect.top,
                    strokeWidth: oldSize,
                    stroke: oldColor,
                    roughness: distortion
                };
                var line = generator.line(x1, y1, dataToSend.x2, dataToSend.y2, {roughness: distortion, strokeWidth: oldSize, stroke: oldColor});
                rCanvas.draw(line);
                socket.emit('draw-line', {canvas: dataToSend, idRoom: idSessionRoom});
                setLineCoordinates({
                    ...lineCoordinates,
                    x1: undefined,
                    y1: undefined
                });
                return;
            }
        }
    }
    const rectDraw = (e) => {
        var {x1, y1} = lineCoordinates;
        if(drawLine) {
            var canvas = document.getElementById(sessionId);
            var ctx = canvas.getContext('2d');
            var rCanvas = rough.canvas(canvas);
            var rect = canvas.getBoundingClientRect();
            if(x1 === undefined && y1 === undefined) {
                setLineCoordinates({
                    ...lineCoordinates,
                    x1: e.clientX - rect.left,
                    y1: e.clientY - rect.top
                });
            } else {
                ctx.beginPath();
                var dataToSend = {
                    x1: x1,
                    y1: y1,
                    x2: e.clientX - rect.left - x1,
                    y2: e.clientY - rect.top - y1,
                    strokeWidth: oldSize,
                    stroke: oldColor,
                    roughness: distortion
                };
                var rectDraw = generator.rectangle(x1, y1, dataToSend.x2, dataToSend.y2, {roughness: distortion, strokeWidth: oldSize, stroke: oldColor});
                rCanvas.draw(rectDraw);
                socket.emit('draw-rect', {canvas: dataToSend, idRoom: idSessionRoom});
                setLineCoordinates({
                    ...lineCoordinates,
                    x1: undefined,
                    y1: undefined
                });
                return;
            }
        }
    }
    const getColor = (e) => {
        var canvas = document.getElementById(sessionId);
        var ctx = canvas.getContext('2d');
        var rect = canvas.getBoundingClientRect();
        var colorData = ctx.getImageData(e.clientX - rect.left, e.clientY - rect.top, 1, 1);
        var {0:r, 1:g, 2:b} = colorData.data;
        changeColorDataDropper({r, g, b});
    }
    const saveFile = (e) => {
        e.preventDefault();
        var canvas = document.getElementById(sessionId);
        let fileN, extensionN;
        fileN = fileName.split('.')[0]
        extensionN = fileName.split('.')[1]
        let data = {
            idArchivo: fileId,
            base64Data: canvas.toDataURL().replace(/^data:image\/png;base64,/, ""),
            usuario: cookies.get('username'),
            nombre: fileN,
            tipo: 'png'
        };
        socket.emit('guardar-fichero', data);
    }
    return (
        <div id="sketch" className="sketch">
            <input type='button' id='save' value='Guardar' onClick={saveFile} />
            <canvas onContextMenu={(e) => e.preventDefault()} className={`board ${filter} ${cross ? "crosshairCursor" : ""}`} style={{filter: customFilter ? imgStyle.filter: ''}} id={sessionId} onClick={handleOnClick}></canvas>
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
