// ===============================
// 1. Load Assignments from API
// ===============================
async function loadAssignmentsForDate(year, month, day) {
    const url = `https://speaktruth.onrender.com/assignments/api/${year}/${month}/${day}/`;

    console.log("Fetching:", url);

    try {
        const response = await fetch(url, {
            // headers: {
            //     "X-API-Key": "c4f9e8b2d7a14f0c9e3b5d2a8f6c1e4b7d9a2c3f5e8b1d4c6f0a2e9b7c3d1f5"
            // }

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
        dateInput.addEventListener("change", async function () {
            try {
                const [year, month, day] = dateInput.value.split("-").map(Number);
        
                const url = `https://speaktruth.onrender.com/assignments/api/${year}/${month}/${day}/`;
        
                console.log("Fetching:", url);
        
                const response = await fetch(url);
                const data = await response.json();
        
                displayAssignments(data.assignments);
                fillAssignmentFields(data.assignments);
        
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

    const assignments = data && data.assignments ? data.assignments : {};

    // Show each assignment key/value
    for (const roleKey in assignments) {
        if (!Object.prototype.hasOwnProperty.call(assignments, roleKey)) continue;

        const div = document.createElement("div");
        div.className = "assignment-item";

        const roleName = roleKey
            .replace(/_/g, " ")
            .replace(/\b\w/g, c => c.toUpperCase());

        const person = assignments[roleKey] || "Unassigned";

        div.textContent = `${roleName}: ${person}`;
        container.appendChild(div);
    }

    // Display notes if present
    if (Array.isArray(data.notes) && data.notes.length > 0) {
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
    // Helper: safely fill a field if it exists
    function safeFill(id, value) {
        const el = document.getElementById(id);
        if (el) {
            el.value = value || "";
        }
    }

    // Roles that appear on ALL services
    safeFill("openingprayer", a.opening_prayer);
    safeFill("closingprayer", a.closing_prayer);

    // Sunday Morning + Sunday Evening only
    safeFill("scriptures", a.scriptures);
    safeFill("preaching", a.preaching);

    // Wednesday Evening only
    safeFill("invitation", a.invitation);
    safeFill("classteacher", a.bible_class);

    // Notes (optional)
    const notesBox = document.getElementById("notes");
    if (notesBox && a.notes) {
        notesBox.value = a.notes.join("\n");
    }
}
