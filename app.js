// ===============================
// 1. Load Assignments from API
// ===============================
async function loadAssignmentsForDate(year, month, day) {
    const url = `https://speaktruth.onrender.com/assignments/api/${year}/${month}/${day}/`;

    console.log("Fetching:", url);

    try {
        const response = await fetch(url);

        console.log("Status:", response.status);

        if (!response.ok) {
            console.error("Fetch failed:", response.statusText);
            return { assignments: {}, notes: [] };
        }

        const data = await response.json();
        console.log("Data received:", data);
        return data;

    } catch (err) {
        console.error("Network error:", err);
        return { assignments: {}, notes: [] };
    }
}

// ===============================
// 2. Save as PDF
// ===============================
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

// ===============================
// 3. Date Picker Listener
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById("date");

    if (dateInput) {
        dateInput.addEventListener("change", async function () {
            try {
                const [year, month, day] = dateInput.value.split("-").map(Number);

                const data = await loadAssignmentsForDate(year, month, day);

                displayAssignments(data);
                fillAssignmentFields(data);   // ⭐ Correct call

            } catch (err) {
                console.error("Error during assignment load/display:", err);
            }
        });
    } else {
        console.warn("No #date input found in DOM.");
    }
});

// ===============================
// 4. Display Assignments (visual list)
// ===============================
function displayAssignments(data) {
    const container = document.getElementById("assignments");
    if (!container) {
        console.warn("No #assignments container found in DOM.");
        return;
    }

    container.innerHTML = "";

    const assignments = data.assignments || {};

    for (const roleKey in assignments) {
        const div = document.createElement("div");
        div.className = "assignment-item";

        const roleName = roleKey
            .replace(/_/g, " ")
            .replace(/\b\w/g, c => c.toUpperCase());

        const person = assignments[roleKey] || "Unassigned";

        div.textContent = `${roleName}: ${person}`;
        container.appendChild(div);
    }
}
