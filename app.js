async function loadAssignmentsForDate(year, month, day) {
    const url = `https://pioneer-and-bell-speaktruth.onrender.com/assignments/api/${year}/${month}/${day}/`;

    console.log("Fetching:", url);

    try {
        const response = await fetch(url);

        console.log("Status:", response.status);

        if (!response.ok) {
            console.error("Fetch failed:", response.statusText);
            return { assignments: [] };
        }

        const data = await response.json();
        console.log("Data received:", data);
        return data;

    } catch (err) {
        console.error("Network error:", err);
        return { assignments: [] };
    }
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
