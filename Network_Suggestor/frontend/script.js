async function searchProfiles() {
    const jobTitle = document.getElementById("jobInput").value.toLowerCase();
    const response = await fetch(`http://localhost:8000/recommendations/?job_title=${jobTitle}`);
    const data = await response.json();

    const resultsList = document.getElementById("results");
    resultsList.innerHTML = "";

    if (data.length === 0) {
        resultsList.innerHTML = "<p>No profiles found.</p>";
        return;
    }

    data.results.forEach(profile => {
        const card = document.createElement("div");
        card.className = "profile-card";

        for (let key in profile) {
            const detail = document.createElement("p");

            if (key.toLowerCase() === "url") {
                detail.innerHTML = `<strong>${key}:</strong> <a href="${profile[key]}" target="_blank">${profile[key]}</a>`;
            } else {
                detail.innerHTML = `<strong>${key}:</strong> ${profile[key]}`;
            }

            card.appendChild(detail);
        }

        resultsList.appendChild(card);
    });
}

