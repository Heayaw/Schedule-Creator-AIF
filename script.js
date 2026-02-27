const calendar = {
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    currentDate: new Date(),
    viewDate: new Date(),
    startDate: null,
    endDate: null,
    savedRanges: [],
    activeHighlight: null
};

const init = () => {
    const storedData = localStorage.getItem('calendarSavedRanges');
    if (storedData) {
        calendar.savedRanges = JSON.parse(storedData).map(range => ({
            ...range,
            startDate: new Date(range.startDate),
            endDate: new Date(range.endDate)
        }));
    }
    renderCalendar();
    renderSavedRanges();
    
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

    const saveBtn = document.getElementById("save-range");
    const cancelLabelBtn = document.getElementById("cancel-label");
    if (saveBtn) saveBtn.addEventListener("click", saveLabeledRange);
    if (cancelLabelBtn) cancelLabelBtn.addEventListener("click", hideLabelEntry);
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
        const checkTime = checkDate.setHours(0,0,0,0);

        if (checkDate.toDateString() === calendar.currentDate.toDateString()) {
            span.classList.add('today');
        }

        if (calendar.startDate && checkDate.toDateString() === calendar.startDate.toDateString()) span.classList.add('range-start');
        if (calendar.endDate && checkDate.toDateString() === calendar.endDate.toDateString()) span.classList.add('range-end');
        if (calendar.startDate && calendar.endDate && checkDate > calendar.startDate && checkDate < calendar.endDate) span.classList.add('in-range');

        if (calendar.activeHighlight) {
            const start = new Date(calendar.activeHighlight.startDate).setHours(0,0,0,0);
            const end = new Date(calendar.activeHighlight.endDate).setHours(0,0,0,0);
            if (checkTime >= start && checkTime <= end) {
                span.classList.add('saved-active');
                if (checkTime === start) span.classList.add('saved-active-start');
                if (checkTime === end) span.classList.add('saved-active-end');
            }
        }

        span.style.cursor = "pointer"; 
        span.addEventListener("click", () => {
            calendar.activeHighlight = null;
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
        showLabelEntry(calendar.startDate, calendar.endDate);
    } else {
        alert("Please select a valid date range.");
    }
};

const cancelSelection = () => {
    calendar.startDate = null;
    calendar.endDate = null;
    calendar.activeHighlight = null;
    renderCalendar();
};

const formatDate = (date) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

const showLabelEntry = (startDate, endDate) => {
    const entry = document.getElementById('label-entry');
    const text = document.getElementById('selected-range-text');
    const labelInput = document.getElementById('range-label');
    if (!entry || !text || !labelInput) return;
    text.textContent = `${formatDate(startDate)} — ${formatDate(endDate)}`;
    labelInput.value = '';
    entry.style.display = 'block';
    labelInput.focus();
    calendar._tempSelection = { startDate, endDate };
};

const hideLabelEntry = () => {
    const entry = document.getElementById('label-entry');
    if (entry) entry.style.display = 'none';
    delete calendar._tempSelection;
};

const saveLabeledRange = () => {
    const labelInput = document.getElementById('range-label');
    if (!calendar._tempSelection || !labelInput) return;
    const label = labelInput.value.trim();
    if (!label) return;
    const { startDate, endDate } = calendar._tempSelection;
    calendar.savedRanges.push({ startDate: new Date(startDate), endDate: new Date(endDate), label });
    localStorage.setItem('calendarSavedRanges', JSON.stringify(calendar.savedRanges));
    hideLabelEntry();
    calendar.startDate = null;
    calendar.endDate = null;
    renderSavedRanges();
    renderCalendar();
};

const renderSavedRanges = () => {
    const container = document.getElementById('saved-ranges');
    if (!container) return;
    container.innerHTML = '';
    calendar.savedRanges.forEach((r, idx) => {
        const div = document.createElement('div');
        div.classList.add('saved-range');
        div.style.cursor = "pointer";
        
        div.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            focusRange(r);
        });

        div.innerHTML = `<div class="meta"><div>${formatDate(r.startDate)} — ${formatDate(r.endDate)}</div><div class="label">${r.label}</div></div>`;
        const del = document.createElement('button');
        del.classList.add('delete');
        del.textContent = 'Delete';
        del.addEventListener('click', (e) => {
            e.stopPropagation();
            removeSavedRange(idx);
        });
        div.appendChild(del);
        container.appendChild(div);
    });
};

const focusRange = (range) => {
    calendar.activeHighlight = range;
    calendar.viewDate = new Date(range.startDate);
    calendar.startDate = null;
    calendar.endDate = null;
    renderCalendar();
};

const removeSavedRange = (index) => {
    calendar.savedRanges.splice(index, 1);
    localStorage.setItem('calendarSavedRanges', JSON.stringify(calendar.savedRanges));
    calendar.activeHighlight = null;
    renderSavedRanges();
    renderCalendar();
};

document.addEventListener('DOMContentLoaded', init);