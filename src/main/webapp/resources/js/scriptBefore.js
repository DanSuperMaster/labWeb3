var print = document.getElementById("draw");
var button = document.getElementById("button");
var ctx = print.getContext("2d");
button.addEventListener("click", pressed);
ctx.lineWidth = 1;
drawCoordinates();
const contextPath = 'http://localhost:8080';

// Добавляем обработчики событий для canvas
print.addEventListener("click", handleCanvasClick);
print.addEventListener("mousemove", handleCanvasMouseMove);
print.addEventListener("mouseenter", handleCanvasMouseEnter);
print.addEventListener("mouseleave", handleCanvasMouseLeave);

// Переменные для отслеживания состояния мыши
var isMouseOverCanvas = false;
var currentMouseX = 0;
var currentMouseY = 0;

// Система разброса
var spreadRadius = 20; // Начальный радиус разброса
var minSpreadRadius = 0; // Минимальный радиус
var maxSpreadRadius = 40; // Максимальный радиус
var hitCount = 0; // Счетчик попаданий
var missCount = 0; // Счетчик промахов
var requiredHits = 5; // Количество попаданий для уменьшения разброса
var requiredMisses = 5; // Количество промахов для увеличения разброса

const params = new URLSearchParams({
  x: "1000",
  y: "1000",
  r: "1000"
});



function getRandomPointInCircle(centerX, centerY, radius) {
  // Генерируем случайный угол и расстояние
  var angle = Math.random() * 2 * Math.PI;
  var distance = Math.random() * radius;

  // Вычисляем координаты
  var x = centerX + distance * Math.cos(angle);
  var y = centerY + distance * Math.sin(angle);

  return { x: x, y: y };
}

// Функция для обработки входа мыши на canvas
function handleCanvasMouseEnter() {
  isMouseOverCanvas = true;
  print.style.cursor = "crosshair"; // Меняем курсор на прицел
  drawAreas(); // Перерисовываем с кругом разброса
}

// Функция для обработки выхода мыши с canvas
function handleCanvasMouseLeave() {
  isMouseOverCanvas = false;
  print.style.cursor = "default"; // Возвращаем стандартный курсор
  drawAreas(); // Перерисовываем без круга разброса
}

// Функция для обработки движения мыши по canvas
function handleCanvasMouseMove(event) {
  if (!isMouseOverCanvas) return;

  var rect = print.getBoundingClientRect();
  currentMouseX = event.clientX - rect.left;
  currentMouseY = event.clientY - rect.top;

  // Перерисовываем canvas с обновленным кругом разброса
  drawAreas();
}

// Функция для отрисовки прицела и круга разброса
function drawCrosshairAndSpread(x, y) {
  var selectedRadii = getCheckedCheckBoxes();
  if (selectedRadii.length === 0) return;

  var currentR = parseFloat(selectedRadii[0]);

  // Преобразуем координаты мыши в математические координаты
  var mathCoords = convertCanvasToMath(x, y);

  // Отрисовываем круг разброса (прозрачный круг)
  ctx.beginPath();
  ctx.arc(x, y, spreadRadius, 0, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(0, 100, 255, 0.7)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Отрисовываем заливку круга разброса (очень прозрачная)
  ctx.beginPath();
  ctx.arc(x, y, spreadRadius, 0, 2 * Math.PI);
  ctx.fillStyle = 'rgba(0, 100, 255, 0.1)';
  ctx.fill();

  // Отрисовываем прицел (крестик)
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
  ctx.lineWidth = 1.5;

  // Вертикальная линия
  ctx.moveTo(x, y - 12);
  ctx.lineTo(x, y + 12);

  // Горизонтальная линия
  ctx.moveTo(x - 12, y);
  ctx.lineTo(x + 12, y);

  // Внешний круг прицела
  ctx.arc(x, y, 8, 0, 2 * Math.PI);

  ctx.stroke();

  // Отображаем координаты рядом с курсором
  ctx.fillStyle = 'black';
  ctx.font = '12px Arial';
  ctx.fillText(`X: ${mathCoords.x.toFixed(2)}, Y: ${mathCoords.y.toFixed(2)}`, x + 15, y - 15);

  // Показываем зону разброса
  var spreadInUnits = (spreadRadius / (177 / currentR)).toFixed(2);
  ctx.fillText(`Разброс: ±${spreadInUnits}`, x + 15, y + 30);
  ctx.fillText(`Радиус: ${spreadRadius}px`, x + 15, y + 45);
}

// Функция для обработки клика на canvas
function handleCanvasClick(event) {
  // Получаем выбранные радиусы
  var listOfR = getCheckedCheckBoxes();

  if (listOfR.length === 0) {
    document.getElementById("demo").innerHTML = "Ошибка: выберите радиус R";
    return;
  }

  // Получаем координаты клика относительно canvas
  var rect = print.getBoundingClientRect();
  var clickX = event.clientX - rect.left;
  var clickY = event.clientY - rect.top;

  // Генерируем случайную точку внутри круга разброса
  var randomPoint = getRandomPointInCircle(clickX, clickY, spreadRadius);

  // Преобразуем координаты canvas в математические координаты
  var mathCoords = convertCanvasToMath(randomPoint.x, randomPoint.y);

  // Отображаем точку разброса на графике
  drawSpreadPoint(randomPoint.x, randomPoint.y);

  // Отправляем точку и получаем результат попадания
  sendPointWithSpread(mathCoords.x, mathCoords.y, listOfR, randomPoint.x, randomPoint.y);
}

// Функция для отрисовки точки разброса (временная)
function drawSpreadPoint(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, 2 * Math.PI);
  ctx.fillStyle = 'rgba(255, 165, 0, 0.8)'; // Оранжевый цвет
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 100, 0, 0.9)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Исчезает через 500ms
  setTimeout(() => {
    drawAreas(); // Перерисовываем без временной точки
  }, 500);
}

// Функция для отправки точки с учетом системы разброса
function sendPointWithSpread(x, y, r, canvasX, canvasY) {
  console.log("Отправка точки с разбросом: X=" + x + ", Y=" + y + ", R=" + r.join(','));

  const form = document.createElement('form');
  form.method = 'GET';
  form.action = 'control';

  const addField = (name, value) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  };

  addField('x', String(x));
  addField('y', String(y));
  addField('r', r.join(','));

  document.body.appendChild(form);
  form.submit();

  document.getElementById("demo").innerHTML = "Точка отправлена: X=" + x + ", Y=" + y + " (случайный разброс)";
}

// Функция для преобразования координат canvas в математические координаты
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

// Функция для отрисовки точек из таблицы
function drawPointsFromTable() {
  var table = document.getElementById("resultsTable");
  var rows = table.rows;

  // Начинаем с 1, чтобы пропустить заголовок
  for (var i = 1; i < rows.length; i++) {
    var cells = rows[i].cells;
    var x = parseFloat(cells[0].textContent);
    var y = parseFloat(cells[1].textContent);
    var r = parseFloat(cells[2].textContent);
    var control = cells[3].textContent.trim() === "Hit";

    // Отрисовываем точку
    drawPoint(x, y, r, control);
  }
}

// Функция для отрисовки одной точки
function drawPoint(x, y, r, isInArea) {
  // Получаем текущие выбранные радиусы для масштабирования
  var selectedRadii = getCheckedCheckBoxes();
  if (selectedRadii.length === 0) return;

  var currentR = parseFloat(selectedRadii[0]); // Используем первый выбранный радиус для масштабирования

  // Преобразуем математические координаты в координаты canvas
  var canvasCoords = convertMathToCanvas(x, y, currentR);

  // Выбираем цвет в зависимости от попадания в область
  var color = isInArea ? 'green' : 'red';

  // Отрисовываем точку
  ctx.beginPath();
  ctx.arc(canvasCoords.x, canvasCoords.y, 4, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.stroke();
}

// Функция для отправки точки (старая версия для кнопки)
function sendPoint(x, y, r) {
  console.log('Отправка точки: X=' + x + ', Y=' + y + ', R=' + r.join(','));

  const form = document.createElement('form');
  form.method = 'GET';
  form.action = 'control';

  const addField = (name, value) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  };

  addField('x', String(x));
  addField('y', String(y));
  addField('r', r.join(','));

  document.body.appendChild(form);
  form.submit();


  document.getElementById('demo').innerHTML =
    'Точка отправлена: X=' + x + ', Y=' + y;
}


// Загрузка сохраненных данных при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  // Даем время на полную загрузку DOM
  setTimeout(function() {
    addRadiusCheckboxListeners();

    // Проверяем, что canvas доступен
    if (print && print.getContext) {
      drawAreas();
      // Загружаем и отрисовываем точки из таблицы
      // Инициализируем отображение системы разброса
    } else {
      console.error('Canvas element not found or not supported');
    }
  }, 100);
});

// Остальные функции (getCheckedCheckBoxes, drawCoordinates, и т.д.) остаются без изменений
// ... [остальной код без изменений] ...

function getCheckedCheckBoxes() {
  var checkboxes = document.getElementsByClassName('checkbox');
  var checkboxesChecked = [];
  for (var index = 0; index < checkboxes.length; index++) {
    if (checkboxes[index].checked) {
      checkboxesChecked.push(checkboxes[index].value);
    }
  }
  return checkboxesChecked;
}

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
  ctx.moveTo(400 - 6, 23 * 9 - 6);
  ctx.lineTo(400, 23 * 9);
  ctx.moveTo(400 - 6, 23 * 9 + 6);
  ctx.lineTo(400, 23 * 9);
}

function drawArrowY() {
  ctx.moveTo(23 * 8 - 6, 0 + 6);
  ctx.lineTo(23 * 8, 0);
  ctx.moveTo(23 * 8 + 6, 0 + 6);
  ctx.lineTo(23 * 8, 0);
}

function drawSmallLines() {
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
  ctx.fillText("1.5", 23 * 8 - 22, 110);

  ctx.fillText("3", 23 * 8 - 12, 30);

  ctx.fillText("-1.5", 23 * 8 + 6, 300);

  ctx.fillText("-3", 23 * 8 + 6, 390);

  ctx.fillText("3", 358, 23 * 9 + 12);

  ctx.fillText("1.5", 270, 23 * 9 + 12);

  ctx.fillText("-1.5", 96, 23 * 9 + 12);
  ctx.fillText("-3", 8, 23 * 9 + 12);
}

function drawAreas() {
  // Очищаем canvas перед отрисовкой
  ctx.clearRect(0, 0, print.width, print.height);

  // Перерисовываем координатную систему
  drawCoordinates();

  // Получаем выбранные радиусы
  var selectedRadii = getCheckedCheckBoxes();

  // Центр координат
  var centerX = 23 * 8; // 184
  var centerY = 23 * 9; // 207

  // Если выбран радиус, рисуем области
  if (selectedRadii.length > 0) {
    // Цвета для разных радиусов
    var colors = [
      'rgba(0, 0, 255, 0.3)',    // синий
      'rgba(0, 255, 0, 0.3)',    // зеленый
      'rgba(255, 0, 0, 0.3)',    // красный
      'rgba(255, 255, 0, 0.3)',  // желтый
      'rgba(255, 0, 255, 0.3)',  // пурпурный
      'rgba(0, 255, 255, 0.3)',  // голубой
      'rgba(128, 0, 128, 0.3)',  // фиолетовый
      'rgba(255, 165, 0, 0.3)'   // оранжевый
    ];

    // Отрисовываем области для каждого выбранного радиуса
    for (var i = 0; i < selectedRadii.length; i++) {
      var currentR = parseFloat(selectedRadii[i]);
      var color = colors[i % colors.length];

      var scale = currentR / 3;
      var scaledR = 177 * scale;
      var scaledHalfR = scaledR / 2;

      // Сектор круга (1-я четверть)
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, scaledHalfR, Math.PI, 0.5 * Math.PI, true);
      ctx.closePath();
      ctx.fill();

      // Треугольник (3-я четверть)
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + scaledR, centerY);
      ctx.lineTo(centerX, centerY + scaledHalfR);
      ctx.closePath();
      ctx.fill();

      // Прямоугольник (4-я четверть)
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.rect(centerX, centerY, -scaledR, -scaledHalfR);
      ctx.fill();
      ctx.closePath();

      // Подпись радиуса
      ctx.fillStyle = 'black';
      ctx.font = '12px Arial';
      ctx.fillText('R=' + currentR, centerX + 10, 20 + i * 15);
    }

  }

  // Отрисовываем точки из таблицы
  drawPointsFromTable();

  // Отрисовываем прицел и круг разброса если мышь над canvas
  if (isMouseOverCanvas) {
    drawCrosshairAndSpread(currentMouseX, currentMouseY);
  }
}


function pressed() {
  var listOfR = getCheckedCheckBoxes();
  var xCoordinateElement = document.getElementById("X");
  var yCoordinateList = document.querySelector('input[name="numberGroup"]:checked');
  var YCoordinate = -10;
  var XCoordinate = "";

  if ((listOfR.length != 0) && (xCoordinateElement) && (yCoordinateList != null)) {
    YCoordinate = yCoordinateList.value;
    XCoordinate = xCoordinateElement.value;
    XCoordinate = XCoordinate.replace(',', '.')

    if (!isNaN(XCoordinate) && (XCoordinate >= -5) && (XCoordinate <= 5)) {
      console.log("sending ... ")
      sendPoint(XCoordinate, YCoordinate, listOfR);
    } else {
      document.getElementById("demo").innerHTML = "You noob! X должен быть числом от -5 до 5";
    }
  } else {
    var errorMessage = "Ошибка: ";
    if (listOfR.length === 0) errorMessage += "выберите R, ";
    if (!xCoordinateElement) errorMessage += "элемент X не найден, ";
    if (yCoordinateList == null) errorMessage += "выберите Y";

    document.getElementById("demo").innerHTML = errorMessage;
  }
}


// Добавляем обработчики событий для чекбоксов радиуса
function addRadiusCheckboxListeners() {
  var checkboxes = document.getElementsByClassName('checkbox');
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener('change', function() {
      drawAreas();
    });
  }
}

// Вызываем эту функцию после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
  addRadiusCheckboxListeners();
  drawAreas();
});