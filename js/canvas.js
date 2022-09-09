
// Vars
let canvas = document.getElementById('screen');
let ctx = canvas.getContext('2d');
let margin = 20;
let fontSize = 20;
let fontFamily = 'sans-serif';
let lineWidth = 2;
let borderWidth = 4;
let colorMain = false;
let colorLine = '#fff';
let colorText = '#fff';
let colorBorder = '#0880b0';
let colorScreen = '#2aa2d1';
let canvasW = canvas.width;
let canvasH = canvas.height;
let screenW = Number(canvas.dataset.width);
let screenH = Number(canvas.dataset.height);
let w = canvasW - margin * 2;
let h = Math.floor(screenH / screenW * w);
let x = margin;
let y = (canvasH - h) / 2;
let a = 10; // Arrow width
let b = borderWidth + 1; // Border offset

// Background
if (colorMain) {
	ctx.fillStyle = colorMain;
	ctx.fillRect(0, 0, canvasW, canvasH);
}

// Draw the screen
ctx.lineWidth = borderWidth;
ctx.strokeStyle = colorBorder;
ctx.strokeRect(x, y, w, h);
ctx.fillStyle = colorScreen;
ctx.fillRect(x, y, w, h);

// Draw the diagonale
ctx.lineCap = 'round';
ctx.lineWidth = lineWidth;
ctx.strokeStyle = colorLine;
ctx.beginPath();
ctx.moveTo(x + b        , y - b + h - a);
ctx.lineTo(x + b        , y - b + h);
ctx.lineTo(x + b + a    , y - b + h);
ctx.moveTo(x + b        , y - b + h);
ctx.lineTo(x - b + w    , y + b);
ctx.moveTo(x - b + w - a, y + b);
ctx.lineTo(x - b + w    , y + b);
ctx.lineTo(x - b + w    , y + b + a);
ctx.stroke();
ctx.closePath();

// Draw the text
ctx.textAlign = 'left';
ctx.font = fontSize + 'px ' + fontFamily;
ctx.fillStyle = colorText;
ctx.fillText(canvas.dataset.ratio, x + b, y + b + fontSize);
ctx.textAlign = 'center';
ctx.save();
ctx.translate(x + w / 2, h / 2 + y - fontSize / 2);
ctx.rotate(-h / w);
ctx.fillText(canvas.dataset.size + '"', 0, 0);
ctx.restore();
