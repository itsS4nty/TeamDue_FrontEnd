import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
export const Board = (props) => {
    const [time, setTime] = useState(undefined);
    const [socket, setSocket] = useState(undefined);
    useEffect(() => {
        setSocket(io.connect("http://51.38.225.18:8080"));
        
        drawOnCanvas();
    }, []);
    useEffect(() => {
        if(!socket) return;
        socket.on("canvas-data", (data) => {
            var image = new Image();
            var canvas = document.querySelector("#board");
            var ctx = canvas.getContext("2d");
            image.onload= () => {
                ctx.drawImage(image, 0, 0);
            }
            image.src = data;
        });
    })
    const sendBase64Image = (base64image) => {
        socket.emit("canvas-data", base64image);
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
        ctx.lineWidth = 5;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'blue';
    
        canvas.addEventListener('mousedown', function(e) {
            canvas.addEventListener('mousemove', onPaint, false);
        }, false);
    
        canvas.addEventListener('mouseup', function() {
            canvas.removeEventListener('mousemove', onPaint, false);
        }, false);
    
        var onPaint = function() {
            ctx.beginPath();
            ctx.moveTo(last_mouse.x, last_mouse.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.closePath();
            ctx.stroke();
            if(time !== undefined) clearTimeout();
            setTime(setTimeout(() => {
                let base64image = canvas.toDataURL('image/png');
                sendBase64Image(base64image);
            }, 1000));
        };
    }
    return (
        <div id="sketch" className="sketch">
            <canvas className="board" id="board"></canvas>
        </div>
    )
}
