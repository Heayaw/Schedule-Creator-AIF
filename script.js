const calendar = {
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    currentDate: new Date(),
    viewDate: new Date(),
    startDate: null,
    endDate: null
};

const init = () => {
    renderCalendar();
    
    document.getElementById("prev-month").addEventListener("click", (e) => {
        e.preventDefault();
        calendar.viewDate.setMonth(calendar.viewDate.getMonth() - 1);
        renderCalendar();
    });
    
    document.getElementById("next-month").addEventListener("click", (e) => {
        e.preventDefault();
        calendar.viewDate.setMonth(calendar.viewDate.getMonth() + 1);
        renderCalendar();
    });

    document.querySelector(".cancel").addEventListener("click", cancelSelection);
    document.querySelector(".apply").addEventListener("click", applyRange);
};

const renderCalendar = () => {
    const leftDate = new Date(calendar.viewDate);
    renderMonth(leftDate, ".left-side");

    const rightDate = new Date(calendar.viewDate);
    rightDate.setMonth(rightDate.getMonth() + 1);
    renderMonth(rightDate, ".right-side");
};

const renderMonth = (date, containerSelector) => {
    const container = document.querySelector(containerSelector);
    const month = date.getMonth();
    const year = date.getFullYear();
    
    container.querySelector(".month-year").textContent = `${calendar.months[month]} ${year}`;
    const datesContainer = container.querySelector(".dates");
    datesContainer.innerHTML = "";

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
    const lastDateOfPrevMonth = new Date(year, month, 0).getDate();

    for (let i = firstDayOfMonth; i > 0; i--) {
        const span = document.createElement("span");
        span.classList.add('disabled');
        span.textContent = lastDateOfPrevMonth - i + 1;
        datesContainer.appendChild(span);
    }

    for (let i = 1; i <= lastDateOfMonth; i++) {
        const span = document.createElement('span');
        span.textContent = i;
        
        const checkDate = new Date(year, month, i);

        if (checkDate.toDateString() === calendar.currentDate.toDateString()) {
            span.classList.add('today');
        }

        if (calendar.startDate && checkDate.toDateString() === calendar.startDate.toDateString()) {
            span.classList.add('range-start');
        }

        if (calendar.endDate && checkDate.toDateString() === calendar.endDate.toDateString()) {
            span.classList.add('range-end');
        }

        if (calendar.startDate && calendar.endDate && checkDate > calendar.startDate && checkDate < calendar.endDate) {
            span.classList.add('in-range');
        }

        // FORCE THE CLICK LOGIC HERE
        span.style.cursor = "pointer"; 
        span.addEventListener("click", () => {
            handleDateClick(i, month, year);
        });
        
        datesContainer.appendChild(span);
    }

    const totalCells = 42;
    const currentCells = datesContainer.children.length;
    for (let i = 1; i <= (totalCells - currentCells); i++) {
        const span = document.createElement('span');
        span.classList.add('disabled');
        span.textContent = i;
        datesContainer.appendChild(span);
    }
};

const handleDateClick = (day, month, year) => {
    const selected = new Date(year, month, day);

    if (!calendar.startDate || (calendar.startDate && calendar.endDate)) {
        calendar.startDate = selected;
        calendar.endDate = null;
    } else if (selected < calendar.startDate) {
        calendar.startDate = selected;
    } else {
        calendar.endDate = selected;
    }

    renderCalendar();
};

const applyRange = () => {
    if (calendar.startDate && calendar.endDate) {
        const displayText = `${formatDate(calendar.startDate)} - ${formatDate(calendar.endDate)}`;
        document.getElementById("date-input").value = displayText;

        closeCalendar();

        processDateRange(calendar.startDate, calendar.endDate);
    } else {
        alert("Please select a valid date range.");
    }
}

const cancelSelection = () => {
    calendar.startDate = null;
    calendar.endDate = null;
    renderCalendar();
    closeCalendar();
}

const formatDate = (date) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

const closeCalendar = () => {
    document.querySelector(".calendar").style.display = "none";
};

const openCalendar = () => {
    document.querySelector(".calendar").style.display = "block";
};

const processDateRange = (startDate, endDate) => {
    console.log(`Date range selected: ${formatDate(startDate)} to ${formatDate(endDate)}`);
};

document.addEventListener('DOMContentLoaded', init);