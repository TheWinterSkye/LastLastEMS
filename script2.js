async function findProcedure() {
    const department = document.getElementById('department').value;
    const severity = document.getElementById('severity').value;
    const injuryCode = document.getElementById('injuryCode').value;

    const response = await fetch('medicalprocedures.csv');
    const data = await response.text();
    const procedures = parseCSV(data);

    const matchingProcedures = procedures.filter(procedure =>
        (department === 'Operating Room' && procedure['Operating Room'] === 'Yes') ||
        (department === 'Transportation' && procedure['Transportation'] === 'Yes') &&
        procedure.Severity === severity &&
        procedure['Injury Code'].includes(injuryCode) // Assuming 'Injury Code' may have additional text
    );

    displayProcedures(matchingProcedures);
}

function parseCSV(data) {
    const lines = data.split('\n').filter(line => line.trim() !== ''); // Skip empty lines
    const headers = lines[0].split(',').map(header => header.trim()); // Ensure headers are trimmed
    return lines.slice(1).map(line => {
        const values = line.split(',');
        const record = {};
        headers.forEach((header, index) => {
            const value = values[index];
            record[header] = value ? value.trim() : ''; // Only trim if value is not undefined
        });
        return record;
    });
}

function displayProcedures(procedures) {
    const container = document.getElementById('procedureSteps');
    container.innerHTML = ''; // Clear previous content

    if (procedures.length === 0) {
        container.innerHTML = 'No matching procedures found.';
        return;
    }

    procedures.forEach(procedure => {
        for (let i = 1; i <= 20; i++) {
            const stepKey = `Step ${i}`;
            if (procedure[stepKey]) {
                const stepPara = document.createElement('p');
                stepPara.textContent = `${stepKey}: ${procedure[stepKey]}`;
                container.appendChild(stepPara);
            }
        }
    });
}
