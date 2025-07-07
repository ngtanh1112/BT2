const daysTag = document.querySelector(".days"),
    currentDate = document.querySelector(".current-date"),
    prevNextIcon = document.querySelectorAll(".icons span"),
    currentTime = document.querySelector(".current-time"),
    monthsTag = document.querySelector(".months"),
    yearsTag = document.querySelector(".years"),
    headerLeftIcon = document.querySelector(".header-left"),
    weeksTag = document.querySelector(".weeks");

const today = new Date();
let currYear = today.getFullYear(),
    currMonth = today.getMonth(),
    currDay = today.getDay(),
    currentView = 'day';

let yearRangeStart = Math.floor(currYear / 10) * 10;

// Scroll navigation variables
let scrollAccumulator = 0;
const scrollThreshold = 100; // Ngưỡng scroll để trigger chuyển tháng
let isScrolling = false;
let scrollTimeout;

const months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months_temp = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct", "Nov", "Dec"];

currentTime.innerText = `${daysOfWeek[currDay]}, ${months[currMonth]} ${today.getDate()}`;

const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(),
        lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
        lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(),
        lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
    let liTag = "";

    for (let i = firstDayofMonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) {
        let isToday = i === today.getDate() && currMonth === today.getMonth() && currYear === today.getFullYear() ? "active" : "";
        liTag += `<li class="${isToday}">${i}</li>`;
    }

    let totalDaysAdded = firstDayofMonth + lastDateofMonth;
    for (let i = 1; i <= 42 - totalDaysAdded; i++) {
        liTag += `<li class="inactive">${i}</li>`;
    }

    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    currDay = new Date(currYear, currMonth, today.getDate()).getDay();
    daysTag.innerHTML = liTag;
    setTimeout(() => {
        weeksTag.classList.add("active");
        daysTag.classList.add("active");
    }, 10);
}

const renderMonth = () => {
    let liTag = "";
    const realMonth = today.getMonth();
    const realYear = today.getFullYear();

    currentDate.innerText = `${currYear}`;

    for (let i = 0; i < months_temp.length; i++) {
        const isActive = (i === realMonth && currYear === realYear) ? "active" : "";
        liTag += `<li class="month ${isActive}" data-month="${i}" data-year="${currYear}">${months_temp[i]}</li>`;
    }

    for (let i = 0; i < 4; i++) {
        const isActive = (i === realMonth && currYear + 1 === realYear) ? "active" : "";
        liTag += `<li class="month next-year ${isActive}" data-month="${i}" data-year="${currYear + 1}">${months_temp[i]}</li>`;
    }

    monthsTag.innerHTML = liTag;
    setTimeout(() => {
        monthsTag.classList.add("active");
    }, 10);

    const monthIcons = document.querySelectorAll(".month");
    monthIcons.forEach(icon => {
        icon.addEventListener("click", () => {
            currMonth = parseInt(icon.getAttribute("data-month"));
            currYear = parseInt(icon.getAttribute("data-year"));
            switchToView('day');
        });
    });
}

const renderYear = () => {
    let liTag = "";
    const realYear = today.getFullYear();

    currentDate.innerText = `${yearRangeStart} - ${yearRangeStart + 9}`;

    const prevDecadeStart = yearRangeStart - 10;
    for (let i = 4; i < 10; i++) {
        const year = prevDecadeStart + i;
        liTag += `<li class="year inactive" data-year="${year}">${year}</li>`;
    }

    for (let i = 0; i < 10; i++) {
        const year = yearRangeStart + i;
        const isActive = (year === realYear) ? "active" : "";
        liTag += `<li class="year ${isActive}" data-year="${year}">${year}</li>`;
    }

    yearsTag.innerHTML = liTag;
    setTimeout(() => {
        yearsTag.classList.add("active");
    }, 10);

    const yearIcons = document.querySelectorAll(".year");
    yearIcons.forEach(icon => {
        icon.addEventListener("click", () => {
            currYear = parseInt(icon.getAttribute("data-year"));
            switchToView('month');
        });
    });
}

const switchToView = (view) => {
    currentView = view;

    weeksTag.style.display = "none";
    daysTag.style.display = "none";
    monthsTag.style.display = "none";
    yearsTag.style.display = "none";
    weeksTag.classList.remove("active");
    daysTag.classList.remove("active");
    monthsTag.classList.remove("active");
    yearsTag.classList.remove("active");

    switch (view) {
        case 'day':
            weeksTag.style.display = "flex";
            daysTag.style.display = "flex";
            renderCalendar();
            break;
        case 'month':
            monthsTag.style.display = "flex";
            renderMonth();
            break;
        case 'year':
            yearsTag.style.display = "flex";
            renderYear();
            break;
    }
}

// Scroll Navigation Functions
const handleScrollNavigation = (direction) => {
    if (isScrolling) return;

    isScrolling = true;

    if (currentView === 'day') {
        currMonth = direction === 'down' ? currMonth + 1 : currMonth - 1;

        if (currMonth < 0 || currMonth > 11) {
            currYear = currMonth < 0 ? currYear - 1 : currYear + 1;
            currMonth = currMonth < 0 ? 11 : 0;
        }

        weeksTag.classList.remove("active");
        daysTag.classList.remove("active");
        setTimeout(() => {
            renderCalendar();
            isScrolling = false;
        }, 300);

    } else if (currentView === 'month') {
        currYear = direction === 'down' ? currYear + 1 : currYear - 1;
        monthsTag.classList.remove("active");
        setTimeout(() => {
            renderMonth();
            isScrolling = false;
        }, 300);

    } else if (currentView === 'year') {
        yearRangeStart = direction === 'down' ? yearRangeStart + 10 : yearRangeStart - 10;
        yearsTag.classList.remove("active");
        setTimeout(() => {
            renderYear();
            isScrolling = false;
        }, 300);
    }
}

// Add wheel event listener to calendar
const calendarElement = document.querySelector('.calendar');
calendarElement.addEventListener('wheel', (e) => {
    e.preventDefault(); // Ngăn scroll mặc định

    // Tích lũy scroll delta
    scrollAccumulator += e.deltaY;

    // Clear timeout trước đó
    clearTimeout(scrollTimeout);

    // Kiểm tra ngưỡng scroll
    if (Math.abs(scrollAccumulator) >= scrollThreshold) {
        const direction = scrollAccumulator > 0 ? 'down' : 'up';
        handleScrollNavigation(direction);
        scrollAccumulator = 0; // Reset accumulator
    }

    // Reset accumulator sau 200ms không có scroll
    scrollTimeout = setTimeout(() => {
        scrollAccumulator = 0;
    }, 200);
});

// Touch support cho mobile
let touchStartY = 0;
let touchEndY = 0;

calendarElement.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
});

calendarElement.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Ngăn scroll mặc định trên mobile
});

calendarElement.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].clientY;
    const touchDiff = touchStartY - touchEndY;

    // Chỉ xử lý nếu swipe đủ mạnh (> 50px)
    if (Math.abs(touchDiff) > 50) {
        const direction = touchDiff > 0 ? 'down' : 'up';
        handleScrollNavigation(direction);
    }
});

renderCalendar();

prevNextIcon.forEach(icon => {
    icon.addEventListener("click", () => {
        if (currentView === 'day') {
            currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

            if (currMonth < 0 || currMonth > 11) {
                currYear = currMonth < 0 ? currYear - 1 : currYear + 1;
                currMonth = currMonth < 0 ? 11 : 0;
            }
            weeksTag.classList.remove("active");
            daysTag.classList.remove("active");
            setTimeout(() => renderCalendar(), 300);
        } else if (currentView === 'month') {
            currYear = icon.id === "prev" ? currYear - 1 : currYear + 1;
            monthsTag.classList.remove("active");
            setTimeout(() => renderMonth(), 300);
        } else if (currentView === 'year') {
            yearRangeStart = icon.id === "prev" ? yearRangeStart - 10 : yearRangeStart + 10;
            yearsTag.classList.remove("active");
            setTimeout(() => renderYear(), 300);
        }
    });
});

headerLeftIcon.addEventListener("click", () => {
    if (currentView === 'day') {
        weeksTag.classList.remove("active");
        daysTag.classList.remove("active");
        setTimeout(() => switchToView('month'), 300);
    } else if (currentView === 'month') {
        monthsTag.classList.remove("active");
        setTimeout(() => switchToView('year'), 300);
    }
});

// Focus Timer Logic
const minuteDisplay = document.querySelector('.minute');
const minusBtn = document.querySelector('.fa-minus');
const plusBtn = document.querySelector('.fa-plus');
const focusBtn = document.querySelector('.focus button');

let focusMinutes = 25;
let isTimerRunning = false;
let timerInterval;
let remainingTime = 0;

minuteDisplay.textContent = `${focusMinutes} min`;

minusBtn.addEventListener('click', () => {
    if (!isTimerRunning && focusMinutes > 1) {
        focusMinutes--;
        minuteDisplay.textContent = `${focusMinutes} min`;
    }
});

plusBtn.addEventListener('click', () => {
    if (!isTimerRunning && focusMinutes < 180) {
        focusMinutes++;
        minuteDisplay.textContent = `${focusMinutes} min`;
    }
});

focusBtn.addEventListener('click', () => {
    if (!isTimerRunning) {
        startTimer();
    } else {
        stopTimer();
    }
});

function startTimer() {
    isTimerRunning = true;
    remainingTime = focusMinutes * 60;
    focusBtn.textContent = 'Stop';
    focusBtn.style.backgroundColor = 'rgb(220, 53, 69)';

    minusBtn.style.opacity = '0.5';
    plusBtn.style.opacity = '0.5';
    minusBtn.style.cursor = 'not-allowed';
    plusBtn.style.cursor = 'not-allowed';

    timerInterval = setInterval(() => {
        remainingTime--;

        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;

        minuteDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (remainingTime <= 0) {
            stopTimer();
            showNotification();
        }
    }, 1000);
}

function stopTimer() {
    isTimerRunning = false;
    clearInterval(timerInterval);
    focusBtn.textContent = 'Focus';
    focusBtn.style.backgroundColor = 'rgb(0, 166, 255)';
    minuteDisplay.textContent = `${focusMinutes} min`;

    minusBtn.style.opacity = '1';
    plusBtn.style.opacity = '1';
    minusBtn.style.cursor = 'pointer';
    plusBtn.style.cursor = 'pointer';
}

function showNotification() {
    if ('Notification' in window) {
        if (Notification.permission === 'granted') {
            new Notification('Focus Timer', {
                body: 'Your focus session is complete!',
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>'
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('Focus Timer', {
                        body: 'Your focus session is complete!'
                    });
                }
            });
        }
    }

    alert('Focus time completed! Great job! 🎉');
}

if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// Collapse functionality
const collapseBtn = document.getElementById('collapse');
const header = document.querySelector('.header');
const calendar = document.querySelector('.calendar');
const container = document.querySelector('.container');

let isCollapsed = false;

collapseBtn.addEventListener('click', () => {
    if (!isCollapsed) {
        header.style.opacity = '0';
        calendar.style.opacity = '0';
        header.style.transform = 'translateY(-20px)';
        calendar.style.transform = 'translateY(-20px)';

        setTimeout(() => {
            header.style.display = 'none';
            calendar.style.display = 'none';
            container.style.minHeight = 'auto';
            container.style.height = 'auto';
        }, 300);

        collapseBtn.className = 'fa fa-angle-up';
        isCollapsed = true;

    } else {
        header.style.display = 'flex';
        calendar.style.display = 'block';
        container.style.minHeight = '490px';

        setTimeout(() => {
            header.style.opacity = '1';
            calendar.style.opacity = '1';
            header.style.transform = 'translateY(0)';
            calendar.style.transform = 'translateY(0)';
        }, 50);

        collapseBtn.className = 'fa fa-angle-down';
        isCollapsed = false;
    }
});