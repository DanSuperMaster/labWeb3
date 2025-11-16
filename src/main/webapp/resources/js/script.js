var print = document.querySelector(".draw-canvas");
var ctx = print.getContext("2d");
ctx.lineWidth = 1;
drawCoordinates();

print.addEventListener("click", handleCanvasClick);
print.addEventListener("mousemove", handleCanvasMouseMove);
print.addEventListener("mouseenter", handleCanvasMouseEnter);
print.addEventListener("mouseleave", handleCanvasMouseLeave);

document.addEventListener('DOMContentLoaded', function() {
    drawAreas();
    setupYFieldListener();
    syncHiddenFields();

    // Обновление канваса каждую секунду
    setInterval(function() {
        refreshCanvas();
    }, 1000);
});

var isMouseOverCanvas = false;
var currentMouseX = 0;
var currentMouseY = 0;

function handleCanvasMouseEnter() {
    isMouseOverCanvas = true;
    print.style.cursor = "crosshair";
    drawAreas();
}

function handleCanvasMouseLeave() {
    isMouseOverCanvas = false;
    print.style.cursor = "default";
    drawAreas();
}

function handleCanvasMouseMove(event) {
    if (!isMouseOverCanvas) return;

    var rect = print.getBoundingClientRect();
    currentMouseX = event.clientX - rect.left;
    currentMouseY = event.clientY - rect.top;

    drawAreas();
}

function handleCanvasClick(event) {
    var rect = print.getBoundingClientRect();
    var clickX = event.clientX - rect.left;
    var clickY = event.clientY - rect.top;

    var mathCoords = convertCanvasToMath(clickX, clickY);


    // НЕМЕДЛЕННО устанавливаем значения в скрытые поля
    var xInput = document.querySelector('.property-x');
    var yInput = document.querySelector('.property-y');

    if (xInput) xInput.value = mathCoords.x.toString();
    if (yInput) yInput.value = mathCoords.y.toString();

    // Также обновляем видимое поле Y
    var yField = document.querySelector('.y-field');
    if (yField) yField.value = mathCoords.y.toString();


    // Немедленно отправляем форму вместо использования remoteCommand
    submitFormDirectly();
}

function submitFormDirectly() {


    // Проверяем, есть ли выбранные R значения
    var selectedR = getRValues();
    if (selectedR.length === 0) {
        alert("Пожалуйста, выберите хотя бы одно значение R!");
        return;
    }

    // Находим и нажимаем кнопку Submit в основной форме
    var submitButton = document.querySelector('#mainForm [value="Submit"]');
    if (submitButton) {
        submitButton.click();
    } else {
        console.error("Кнопка Submit не найдена");
    }
}


function convertCanvasToMath(canvasX, canvasY) {
    var centerX = 23 * 8; // 184
    var centerY = 23 * 9; // 207

    var maxR = 5;

    var scaleX = 177 / maxR;
    var scaleY = 177 / maxR;

    var mathX = (canvasX - centerX) / scaleX;
    var mathY = (centerY - canvasY) / scaleY;

    mathX = Math.round(mathX * 100) / 100;
    mathY = Math.round(mathY * 100) / 100;

    return {x: mathX, y: mathY};
}

function convertMathToCanvas(mathX, mathY, currentR) {
    var centerX = 23 * 8;
    var centerY = 23 * 9;

    var scale = currentR / 5;
    var scaleX = 177 * scale;
    var scaleY = 177 * scale;

    var canvasX = centerX + mathX * (scaleX / 5);
    var canvasY = centerY - mathY * (scaleY / 5);

    return {x: canvasX, y: canvasY};
}

function drawAreas() {
    ctx.clearRect(0, 0, print.width, print.height);
    drawCoordinates();
    drawPoints();

    var selectedRadii = getRValues();

    var centerX = 23 * 8;
    var centerY = 23 * 9;

    if (selectedRadii.length > 0) {
        var colors = [
            'rgba(0, 0, 255, 0.3)',
            'rgba(0, 255, 0, 0.3)',
            'rgba(255, 0, 0, 0.3)',
            'rgba(255, 255, 0, 0.3)',
            'rgba(255, 0, 255, 0.3)',
        ];

        // Рисуем области для каждого выбранного R
        selectedRadii.forEach(function(currentR, index) {
            var color = colors[currentR % colors.length];

            var scale = currentR / 5;
            var scaledR = 177 * scale;
            var scaledHalfR = scaledR / 2;

            // Прямоугольник
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.rect(centerX, centerY, -scaledHalfR, -scaledR);
            ctx.fill();
            ctx.closePath();

            // Треугольник
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.moveTo(centerX, centerY);
            ctx.lineTo((centerX + scaledR), centerY);
            ctx.lineTo(centerX, (centerY - scaledR));
            ctx.closePath();
            ctx.fill();

            // Четверть круга
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, scaledHalfR, 0, 0.5 * Math.PI, false);
            ctx.closePath();
            ctx.fill();
        });
    }
}

// Функция для получения множества выбранных R значений
function getRValues() {
    var selectedR = [];

    // Ищем все кнопки R по классу command-buttons
    var rButtons = document.querySelectorAll('.command-buttons input[type="submit"], .command-buttons button');

    rButtons.forEach(function(button) {
        // Проверяем стиль или класс для определения выбранного состояния
        if (button.style.backgroundColor !== '' && button.style.backgroundColor !== 'white' ||
            button.className.includes('selected') ||
            button.getAttribute('data-selected') === 'true') {
            var value = parseInt(button.value);
            if (!isNaN(value)) {
                selectedR.push(value);
            }
        }
    });

    // Альтернативный подход: проверяем по тексту кнопки
    if (selectedR.length === 0) {
        var possibleValues = [1, 2, 3, 4, 5];
        possibleValues.forEach(function(value) {
            var button = document.querySelector('.command-buttons input[value="' + value + '"], .command-buttons button[value="' + value + '"]');
            if (button && (button.style.backgroundColor !== '' && button.style.backgroundColor !== 'white' ||
                button.className.includes('selected') ||
                button.getAttribute('data-selected') === 'true')) {
                selectedR.push(value);
            }
        });
    }

    return selectedR;
}

// Функции для отрисовки осей графика
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

function syncHiddenFields() {
    var xInput = document.querySelector('.property-x');
    var yInput = document.querySelector('.property-y');

    var xValue = xInput ? xInput.value : '';
    var yValue = yInput ? yInput.value : '';


    var yField = document.querySelector('.y-field');
    if (yField && yValue) {
        yField.value = yValue;
    }
}

function setXValueAndSync(value) {
    console.log("Установка X:", value);

    var xInput = document.querySelector('.property-x');
    if (xInput) {
        xInput.value = value;
        // Триггерим событие change для синхронизации с бэкендом
        var event = new Event('change', { bubbles: true });
        xInput.dispatchEvent(event);
    }

    syncHiddenFields();
    drawAreas();
}

function setYValueAndSync(value) {
    console.log("Установка Y:", value);

    var yInput = document.querySelector('.property-y');
    if (yInput) {
        yInput.value = value;
        // Триггерим событие change для синхронизации с бэкендом
        var event = new Event('change', { bubbles: true });
        yInput.dispatchEvent(event);
    }

    var yField = document.querySelector('.y-field');
    if (yField) {
        yField.value = value;
    }

    syncHiddenFields();
}

function setupYFieldListener() {
    var yField = document.querySelector('.y-field');
    if (yField) {
        yField.addEventListener('input', function() {
            setYValueAndSync(this.value);
        });

        yField.addEventListener('change', function() {
            setYValueAndSync(this.value);
        });
    }
}

function getPointsFromTable() {
    var points = [];
    var table = document.querySelector('.dots-table');

    if (!table) {
        return points;
    }

    var rows = table.querySelectorAll('tr');

    for (var i = 1; i < rows.length; i++) {
        var cells = rows[i].querySelectorAll('td');
        if (cells.length >= 4) {
            var point = {
                x: parseFloat(cells[0].textContent.trim()),
                y: parseFloat(cells[1].textContent.trim()),
                r: parseFloat(cells[2].textContent.trim()),
                inArea: cells[3].textContent.trim() === 'In area'
            };
            points.push(point);
        }
    }

    return points;
}

function drawPoints() {
    var points = getPointsFromTable();
    var currentRValues = getRValues();

    if (currentRValues.length === 0) {
        return;
    }


    points.forEach(function(point) {
        if (currentRValues.includes(point.r)) {
            drawSinglePoint(point);
        }
    });
}

function drawSinglePoint(point) {
    var canvasCoords = convertMathToCanvas(point.x, point.y, point.r);

    ctx.beginPath();
    ctx.arc(canvasCoords.x, canvasCoords.y, 4, 0, 2 * Math.PI);

    if (point.inArea) {
        ctx.fillStyle = 'green';
    } else {
        ctx.fillStyle = 'red';
    }

    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();
}

function refreshCanvas() {
    drawAreas();
}

function toggleRButton(button) {
    var isSelected = button.getAttribute('data-selected') === 'true';
    button.setAttribute('data-selected', !isSelected);

    if (!isSelected) {
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';

    } else {
        button.style.backgroundColor = '';
        button.style.color = '';
    }


    // Перерисовываем области после изменения выбора R
    setTimeout(drawAreas, 100);
}

function submitForm() {

    // Проверяем, есть ли выбранные R значения
    var selectedR = getRValues();
    if (selectedR.length === 0) {
        alert("Пожалуйста, выберите хотя бы одно значение R!");
        return;
    }

    // Вызываем remoteCommand для отправки данных
    if (typeof myCommand !== 'undefined') {
        myCommand();
    }
}