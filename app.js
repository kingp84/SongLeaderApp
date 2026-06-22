async function loadAssignmentsForDate(year, month, day) {
    const url = `/assignments/api/${year}/${month}/${day}/`;
    const response = await fetch(url);
    return await response.json();
}

function saveAsPDF() {
    const element = document.getElementById("song-list");

    const options = {
        margin: 10,
        filename: 'song_list.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(options).from(element).save();
}

// Example: attach to a date picker
document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById("date");

    if (dateInput) {
        dateInput.addEventListener("change", async () => {
            const dt = new Date(dateInput.value);
            const data = await loadAssignmentsForDate(
                dt.getFullYear(),
                dt.getMonth() + 1,
                dt.getDate()
            );

            displayAssignments(data.assignments);
        });
    }
});

function displayAssignments(assignments) {
    const container = document.getElementById("assignments");
    container.innerHTML = "";

    assignments.forEach(a => {
        const div = document.createElement("div");
        div.className = "assignment-item";
        div.textContent = `${a.role}: ${a.person || "Unassigned"}`;
        container.appendChild(div);
    });
}
