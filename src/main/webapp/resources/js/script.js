function selectButton(clickedId) {
    var buttons = document.querySelectorAll('.command-button');
    buttons.forEach(function(button) {
    button.classList.remove('selected-button');
    });

    // Выделяем нажатую кнопку
    var clickedButton = document.getElementById(clickedId);
    if (clickedButton) {
        clickedButton.classList.add('selected-button');
    }
}