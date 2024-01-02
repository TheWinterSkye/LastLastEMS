function parseCSV(csvContent) {
    const rows = csvContent.split('\n');
    const headers = rows[0].split(',');
    const data = rows.slice(1).map(row => {
        const values = row.split(',');
        let entry = {};
        headers.forEach((header, index) => {
            entry[header.trim()] = values[index] ? values[index].trim() : '';
        });
        return entry;
    });
    return data;
}

function displayData(data) {
    const container = document.querySelector('.main-content');
    container.innerHTML = ''; // Clear existing content

    data.forEach(entry => {
        if (entry['Name'] && entry['Name'] !== '') {
            const div = document.createElement('div');
            div.className = 'ems-entry';

            const callSignSpan = document.createElement('span');
            callSignSpan.className = 'ems-data';
            callSignSpan.textContent = `Call Sign: ${entry['Call Sign']}`;
            div.appendChild(callSignSpan);

            const nameSpan = document.createElement('span');
            nameSpan.className = 'ems-data';
            nameSpan.textContent = `Name: ${entry['Name']}`;
            div.appendChild(nameSpan);

            const positionSpan = document.createElement('span');
            positionSpan.className = 'ems-data';
            positionSpan.textContent = `Position: ${entry['Position']}`;
            div.appendChild(positionSpan);

            if (entry['LOA']) {
                const loaSpan = document.createElement('span');
                loaSpan.className = 'ems-data';
                loaSpan.textContent = `LOA: ${entry['LOA']}`;
                div.appendChild(loaSpan);
            }

            if (entry['Medivac']) {
                const medivacSpan = document.createElement('span');
                medivacSpan.className = 'ems-data';
                medivacSpan.textContent = `Medivac: ${entry['Medivac']}`;
                div.appendChild(medivacSpan);
            }

            if (entry['Supervisor']) {
                const supervisorSpan = document.createElement('span');
                supervisorSpan.className = 'ems-data';
                supervisorSpan.textContent = `Supervisor: ${entry['Supervisor']}`;
                div.appendChild(supervisorSpan);
            }

            if (entry['Medivac Trainer']) {
                const trainerSpan = document.createElement('span');
                trainerSpan.className = 'ems-data';
                trainerSpan.textContent = `Medivac Trainer: ${entry['Medivac Trainer']}`;
                div.appendChild(trainerSpan);
            }

            container.appendChild(div);
        }
    });
}

// Fetch the CSV content and display it
fetch('LastLifeEMSRoster.csv')
    .then(response => response.text())
    .then(csvContent => {
        const parsedData = parseCSV(csvContent);
        displayData(parsedData);
    })
    .catch(error => {
        console.error('Error fetching CSV:', error);
    });
