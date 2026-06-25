// ===============================
// 1. Load Assignments from API
// ===============================
async function loadAssignmentsForDate(year, month, day) {
    const url = `https://pioneer-and-bell-speaktruth.onrender.com/assignments/api/${year}/${month}/${day}/`;

    console.log("Fetching:", url);

    try {
        const response = await fetch(url, {
            headers: {
                "X-API-Key": "c4f9e8b2d7a14f0c9e3b5d2a8f6c1e4b7d9a2c3f5e8b1d4c6f0a2e9b7c3d1f5"
            }
        });

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
        dateInput.addEventListener("change", async () => {
            const dt = new Date(dateInput.value);

            const data = await loadAssignmentsForDate(
                dt.getFullYear(),
                dt.getMonth() + 1,
                dt.getDate()
            );

            displayAssignments(data);
            fillAssignmentFields(data.assignments);
        });
    }
});

// ===============================
// 4. Display Assignments (visual list)
// ===============================
function displayAssignments(data) {
    const container = document.getElementById("assignments");
    container.innerHTML = "";

    const assignments = data.assignments;

    for (const roleKey in assignments) {
        const div = document.createElement("div");
        div.className = "assignment-item";

        const roleName = roleKey.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
        const person = assignments[roleKey] || "Unassigned";

        div.textContent = `${roleName}: ${person}`;
        container.appendChild(div);
    }

    // Display notes if present
    if (data.notes && data.notes.length > 0) {
        const notesDiv = document.createElement("div");
        notesDiv.className = "assignment-notes";
        notesDiv.textContent = "Notes: " + data.notes.join(" | ");
        container.appendChild(notesDiv);
    }
}

// ===============================
// 5. Autofill Form Fields
// ===============================
function fillAssignmentFields(a) {
    document.getElementById("openingprayer").value = a.opening_prayer || "";
    document.getElementById("closingprayer").value = a.closing_prayer || "";
    document.getElementById("scriptures").value = a.scripture_reading || "";
    document.getElementById("preaching").value = a.preaching || "";
    document.getElementById("invitation").value = a.invitation || "";
    document.getElementById("classteacher").value = a.bible_class || "";

    // Optional notes box
    const notesBox = document.getElementById("notes");
    if (notesBox && a.notes) {
        notesBox.value = a.notes.join("\n");
    }
}
