function updateAnalogClock() {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();
            
            const hourHand = document.getElementById('hourHand');
            const minuteHand = document.getElementById('minuteHand');
            const secondHand = document.getElementById('secondHand');
            
            const hourDeg = (hours % 12) * 30 + minutes * 0.5;
            const minuteDeg = minutes * 6;
            const secondDeg = seconds * 6;
            
            hourHand.style.transform = `rotate(${hourDeg}deg)`;
            minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
            secondHand.style.transform = `rotate(${secondDeg}deg)`;
}

function initClock() {
    setInterval(updateAnalogClock, 1000);
    updateAnalogClock();
}

document.addEventListener('DOMContentLoaded', initClock);
