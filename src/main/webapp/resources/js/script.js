var print = document.getElementById("draw");
var ctx = print.getContext("2d");
ctx.lineWidth = 1;
drawCoordinates();

print.addEventListener("click", handleCanvasClick);
print.addEventListener("mousemove", handleCanvasMouseMove);
print.addEventListener("mouseenter", handleCanvasMouseEnter);
print.addEventListener("mouseleave", handleCanvasMouseLeave);
document.addEventListener('DOMContentLoaded', function() {
    // Находим все радиокнопки и добавляем обработчики
    var radioButtons = document.querySelectorAll('input[name="j_idt6:j_idt25"]');
    radioButtons.forEach(function (radio) {
        radio.addEventListener('change', function () {
            drawAreas();
        });
    });
    drawAreas();
});



var isMouseOverCanvas = false;
var currentMouseX = 0;
var currentMouseY = 0;

function handleCanvasMouseEnter() {
    isMouseOverCanvas = true;
    print.style.cursor = "crosshair"; // Меняем курсор на прицел
    drawAreas(); // Перерисовываем с кругом разброса
}

function handleCanvasMouseLeave() {
    isMouseOverCanvas = false;
    print.style.cursor = "default"; // Возвращаем стандартный курсор
    drawAreas(); // Перерисовываем без круга разброса
}


function handleCanvasMouseMove(event) {
    if (!isMouseOverCanvas) return;

    var rect = print.getBoundingClientRect();
    currentMouseX = event.clientX - rect.left;
    currentMouseY = event.clientY - rect.top;

    // Перерисовываем canvas с обновленным кругом разброса
    drawAreas();
}


function handleCanvasClick(event) {
    // Получаем выбранные радиусы

    if (listOfR.length === 0) {
        document.getElementById("demo").innerHTML = "Ошибка: выберите радиус R";
        return;
    }

    // Получаем координаты клика относительно canvas
    var rect = print.getBoundingClientRect();
    var clickX = event.clientX - rect.left;
    var clickY = event.clientY - rect.top;

    // Генерируем случайную точку внутри круга разброса
    //var randomPoint = getRandomPointInCircle(clickX, clickY, spreadRadius);

    // Преобразуем координаты canvas в математические координаты
    //var mathCoords = convertCanvasToMath(randomPoint.x, randomPoint.y);

    // Отображаем точку разброса на графике
    //drawSpreadPoint(randomPoint.x, randomPoint.y);

    // Отправляем точку и получаем результат попадания
    //sendPointWithSpread(mathCoords.x, mathCoords.y, listOfR, randomPoint.x, randomPoint.y);
}

function convertCanvasToMath(canvasX, canvasY) {
    // Центр координат на canvas
    var centerX = 23 * 8; // 184
    var centerY = 23 * 9; // 207

    // Максимальные значения на осях (предполагаем R=3)
    var maxR = 3;

    // Масштабные коэффициенты
    var scaleX = 177 / maxR; // пикселей на единицу R по X
    var scaleY = 177 / maxR; // пикселей на единицу R по Y

    // Преобразуем координаты
    var mathX = (canvasX - centerX) / scaleX;
    var mathY = (centerY - canvasY) / scaleY; // инвертируем Y, так как на canvas ось Y направлена вниз

    // Округляем до 2 знаков после запятой
    mathX = Math.round(mathX * 100) / 100;
    mathY = Math.round(mathY * 100) / 100;

    return { x: mathX, y: mathY };
}

// Функция для преобразования математических координат в координаты canvas
function convertMathToCanvas(mathX, mathY, currentR) {
    // Центр координат на canvas
    var centerX = 23 * 8; // 184
    var centerY = 23 * 9; // 207

    // Масштабные коэффициенты (основаны на R=3)
    var scale = currentR / 3;
    var scaleX = 177 * scale; // пикселей для текущего R по X
    var scaleY = 177 * scale; // пикселей для текущего R по Y

    // Преобразуем координаты
    var canvasX = centerX + mathX * (scaleX / currentR);
    var canvasY = centerY - mathY * (scaleY / currentR); // инвертируем Y

    return { x: canvasX, y: canvasY };
}



function drawAreas() {
    // Очищаем canvas перед отрисовкой
    ctx.clearRect(0, 0, print.width, print.height);

    // Перерисовываем координатную систему
    drawCoordinates();

    // Получаем выбранные радиусы
    var selectedRadii = getRValue();
    console.log(selectedRadii);

    // Центр координат
    var centerX = 23 * 8; // 184
    var centerY = 23 * 9; // 207

    if (selectedRadii != null) {
        var colors = [
            'rgba(0, 0, 255, 0.3)',    // синий
            'rgba(0, 255, 0, 0.3)',    // зеленый
            'rgba(255, 0, 0, 0.3)',    // красный
            'rgba(255, 255, 0, 0.3)',  // желтый
            'rgba(255, 0, 255, 0.3)',  // пурпурный
        ];

        var currentR = parseInt(selectedRadii);
        var color = colors[currentR % colors.length];

        var scale = currentR / 5;
        var scaledR = 177 * scale;
        var scaledHalfR = scaledR / 2;


        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.rect(centerX, centerY, -scaledHalfR, -scaledR);
        ctx.fill();
        ctx.closePath();


        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.moveTo(centerX, centerY);
        ctx.lineTo((centerX + scaledR), centerY);
        ctx.lineTo(centerX, (centerY - scaledR));
        ctx.closePath();
        ctx.fill();


        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, scaledHalfR, 0, 0.5 * Math.PI, false);
        ctx.closePath();
        ctx.fill();


    }

}

// функции для получения выбранных параметров (кроме r нам больше ничего не надо, т.к. через бины работаем)

function getRValue() {
    var rRadio = document.querySelector('input[name="j_idt6:j_idt25"]:checked');
    if (rRadio) {
        var value = rRadio.value;
        console.log("Radio value:", value);
        return parseInt(value);
    }

    console.log("No radio button selected");
    return null;
}




// функции для отрисовки осей графика


function drawCoordinates() {
    ctx.beginPath();
    ctx.strokeStyle = 'black';

    ctx.moveTo(23 * 8, 0);
    ctx.lineTo(23 * 8, 400);
    ctx.moveTo(0, 23 * 9);
    ctx.lineTo(400, 23 * 9);
    drawArrowX();
    drawArrowY();
    drawSmallLines();
    drawLetters();
    ctx.stroke();
}

function drawArrowX() {
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'black'
    ctx.moveTo(400 - 6, 23 * 9 - 6);
    ctx.lineTo(400, 23 * 9);
    ctx.moveTo(400 - 6, 23 * 9 + 6);
    ctx.lineTo(400, 23 * 9);
}

function drawArrowY() {
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'black'
    ctx.moveTo(23 * 8 - 6, 0 + 6);
    ctx.lineTo(23 * 8, 0);
    ctx.moveTo(23 * 8 + 6, 0 + 6);
    ctx.lineTo(23 * 8, 0);
}

function drawSmallLines() {
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'black'
    ctx.moveTo(23 * 8 - 3, 120);
    ctx.lineTo(23 * 8 + 3, 120);

    ctx.moveTo(23 * 8 - 3, 30);
    ctx.lineTo(23 * 8 + 3, 30);

    ctx.moveTo(23 * 8 - 3, 295);
    ctx.lineTo(23 * 8 + 3, 295);

    ctx.moveTo(23 * 8 - 3, 390);
    ctx.lineTo(23 * 8 + 3, 390);

    ctx.moveTo(361, 23 * 9 - 3);
    ctx.lineTo(361, 23 * 9 + 3);

    ctx.moveTo(270, 23 * 9 - 3);
    ctx.lineTo(270, 23 * 9 + 3);

    ctx.moveTo(96, 23 * 9 - 3);
    ctx.lineTo(96, 23 * 9 + 3);

    ctx.moveTo(8, 23 * 9 - 3);
    ctx.lineTo(8, 23 * 9 + 3);
}

function drawLetters() {
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'black'
    ctx.fillText("2.5", 23 * 8 - 22, 110);

    ctx.fillText("5", 23 * 8 - 12, 30);

    ctx.fillText("-2.5", 23 * 8 + 6, 300);

    ctx.fillText("-5", 23 * 8 + 6, 390);

    ctx.fillText("5", 358, 23 * 9 + 12);

    ctx.fillText("2.5", 270, 23 * 9 + 12);

    ctx.fillText("-2.5", 96, 23 * 9 + 12);
    ctx.fillText("-5", 8, 23 * 9 + 12);
}









