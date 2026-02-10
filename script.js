const calendar = {
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    currentDate: new Date(),
    viewDate: new Date()
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

        if (i === calendar.currentDate.getDate() && 
            month === calendar.currentDate.getMonth() && 
            year === calendar.currentDate.getFullYear()) {
            span.classList.add('today');
        }
        
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

document.addEventListener('DOMContentLoaded', init);