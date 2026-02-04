// script.js
// Handles adding schedule items and UI interactions

function addSchedule() {
    const type = document.getElementById('assessmentType').value;
    const group = document.getElementById('group').value;
    const date = document.getElementById('date').value;
    if (!type || !group || !date) return alert('Please fill all fields.');
    const list = document.getElementById('scheduleList');
    const item = document.createElement('div');
    item.className = 'schedule-item';
    item.textContent = `${type} for ${group} on ${date}`;
    list.appendChild(item);
    document.getElementById('assessmentType').value = '';
    document.getElementById('group').value = '';
    document.getElementById('date').value = '';
}

// Attach event listener
window.onload = function() {
    document.getElementById('addBtn').onclick = addSchedule;
};
