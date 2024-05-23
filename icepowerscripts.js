document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('icePowerForm').addEventListener('submit', function(event) {
        event.preventDefault();
        calculateIcePower();
    });
});

function toggleCalculationType() {
    const calculationType = document.getElementById('calculationType').value;
    if (calculationType === 'wall') {
        document.getElementById('wallInputs').style.display = 'block';
        document.getElementById('aoeInputs').style.display = 'none';
        
        // Set required attributes for wall inputs
        document.getElementById('createLevel').setAttribute('required', 'required');
        document.getElementById('maintainPoints').setAttribute('required', 'required');
        document.getElementById('wallLength').setAttribute('required', 'required');
        document.getElementById('wallHeight').setAttribute('required', 'required');
        document.getElementById('wallThickness').setAttribute('required', 'required');
        
        // Remove required attributes for aoe inputs
        document.getElementById('createLevelAoe').removeAttribute('required');
        document.getElementById('maintainPointsAoe').removeAttribute('required');
        document.getElementById('radius').removeAttribute('required');
    } else if (calculationType === 'aoe') {
        document.getElementById('wallInputs').style.display = 'none';
        document.getElementById('aoeInputs').style.display = 'block';
        
        // Set required attributes for aoe inputs
        document.getElementById('createLevelAoe').setAttribute('required', 'required');
        document.getElementById('maintainPointsAoe').setAttribute('required', 'required');
        document.getElementById('radius').setAttribute('required', 'required');
        
        // Remove required attributes for wall inputs
        document.getElementById('createLevel').removeAttribute('required');
        document.getElementById('maintainPoints').removeAttribute('required');
        document.getElementById('wallLength').removeAttribute('required');
        document.getElementById('wallHeight').removeAttribute('required');
        document.getElementById('wallThickness').removeAttribute('required');
    }
}

function calculateIcePower() {
    const calculationType = document.getElementById('calculationType').value;

    if (calculationType === 'wall') {
        calculateWallIcePower();
    } else if (calculationType === 'aoe') {
        calculateAoeIcePower();
    }
}

function calculateWallIcePower() {
    const createLevel = parseFloat(document.getElementById('createLevel').value);
    const maintainPoints = parseFloat(document.getElementById('maintainPoints').value);
    const wallLength = parseFloat(document.getElementById('wallLength').value);
    const wallHeight = parseFloat(document.getElementById('wallHeight').value);
    const wallThickness = parseFloat(document.getElementById('wallThickness').value);

    // Validate inputs
    if (isNaN(createLevel) || isNaN(maintainPoints) || isNaN(wallLength) || isNaN(wallHeight) || isNaN(wallThickness)) {
        alert('Please enter valid numbers in all fields.');
        return;
    }

    const iceCreationRate = 10; // 10 cubic yards of ice per power level per minute
    const drPerYard = 10; // DR value per yard of thickness
    const hpPerCubicYard = 5; // HP per cubic yard of ice
    const stabilityDuration = 10; // Minutes for which created ice remains stable without additional points

    const icePerMinute = createLevel * iceCreationRate;
    const totalMaintainedIce = maintainPoints * icePerMinute;
    const iceVolume = wallLength * wallHeight * wallThickness;
    const minutesNeeded = Math.ceil(iceVolume / icePerMinute);

    if (iceVolume > totalMaintainedIce) {
        alert(`The desired ice wall requires more maintenance points. Maximum creatable ice with ${maintainPoints} points is ${totalMaintainedIce} cubic yards.`);
        return;
    }

    const drValue = wallThickness * drPerYard;
    const hpValue = iceVolume * hpPerCubicYard;

    document.getElementById('iceAmountPerMinute').textContent = `Ice Created Per Minute: ${icePerMinute} cubic yards`;
    document.getElementById('maintainedIce').textContent = `Total Maintained Ice: ${totalMaintainedIce} cubic yards with ${maintainPoints} points`;
    document.getElementById('iceStability').textContent = `Created Ice Stability: ${stabilityDuration} minutes without additional points`;
    document.getElementById('drValue').textContent = `Damage Resistance (DR): ${drValue}`;
    document.getElementById('hpValue').textContent = `Hit Points (HP): ${hpValue.toFixed(2)}`; // Fixing to 2 decimal points

    let results = "";
    let remainingVolume = iceVolume;
    let currentHeight = 0;
    let cumulativeHP = 0;
    for (let minute = 1; minute <= minutesNeeded; minute++) {
        let generatedVolume = Math.min(icePerMinute, remainingVolume);
        let heightIncrement = generatedVolume / (wallLength * wallThickness);
        currentHeight += heightIncrement;
        cumulativeHP += generatedVolume * hpPerCubicYard / icePerMinute;

        results += `
            <strong>Minute ${minute}:</strong><br>
            Volume: ${generatedVolume.toFixed(2)} cubic yards<br>
            Height: ${currentHeight.toFixed(2)} yards<br>
            Length: ${wallLength.toFixed(2)} yards<br>
            Thickness: ${wallThickness.toFixed(2)} yards<br>
            DR: ${(wallThickness * drPerYard).toFixed(2)}<br>
            HP: ${cumulativeHP.toFixed(2)}<br><br>
        `;

        remainingVolume -= generatedVolume;
    }
    document.getElementById('iceGenerationDetails').innerHTML = results;
}

function calculateAoeIcePower() {
    const createLevel = parseFloat(document.getElementById('createLevelAoe').value);
    const maintainPoints = parseFloat(document.getElementById('maintainPointsAoe').value);
    const radius = parseFloat(document.getElementById('radius').value);

    // Validate inputs
    if (isNaN(createLevel) || isNaN(maintainPoints) || isNaN(radius)) {
        alert('Please enter valid numbers in all fields.');
        return;
    }

    const iceCreationRate = 10; // 10 cubic yards of ice per power level per minute
    const drPerYard = 10; // DR value per yard of thickness
    const hpPerCubicYard = 5; // HP per cubic yard of ice
    const stabilityDuration = 10; // Minutes for which created ice remains stable without additional points

    const icePerMinute = createLevel * iceCreationRate;
    const totalMaintainedIce = maintainPoints * icePerMinute;
    const areaVolume = Math.PI * Math.pow(radius, 2) * 1; // Assuming 1 yard thick for simplicity
    const minutesNeeded = Math.ceil(areaVolume / icePerMinute);

    if (areaVolume > totalMaintainedIce) {
        alert(`The desired AOE ice requires more maintenance points. Maximum creatable ice with ${maintainPoints} points is ${totalMaintainedIce} cubic yards.`);
        return;
    }

    const drValue = 1 * drPerYard; // Assuming 1 yard thick for simplicity
    const hpValue = areaVolume * hpPerCubicYard;

    document.getElementById('iceAmountPerMinute').textContent = `Ice Created Per Minute: ${icePerMinute} cubic yards`;
    document.getElementById('maintainedIce').textContent = `Total Maintained Ice: ${totalMaintainedIce} cubic yards with ${maintainPoints} points`;
    document.getElementById('iceStability').textContent = `Created Ice Stability: ${stabilityDuration} minutes without additional points`;
    document.getElementById('drValue').textContent = `Damage Resistance (DR): ${drValue}`;
    document.getElementById('hpValue').textContent = `Hit Points (HP): ${hpValue.toFixed(2)}`; // Fixing to 2 decimal points

    let results = "";
    let remainingVolume = areaVolume;
    let cumulativeHP = 0;
    for (let minute = 1; minute <= minutesNeeded; minute++) {
        let generatedVolume = Math.min(icePerMinute, remainingVolume);
        let generatedRadius = (Math.sqrt(generatedVolume / Math.PI)).toFixed(2);
        cumulativeHP += generatedVolume * hpPerCubicYard / icePerMinute;

        results += `
            <strong>Minute ${minute}:</strong><br>
            Volume: ${generatedVolume.toFixed(2)} cubic yards<br>
            Radius: ${generatedRadius} yards<br>
            Thickness: 1 yard<br>
            DR: ${drValue.toFixed(2)}<br>
            HP: ${cumulativeHP.toFixed(2)}<br><br>
        `;

        remainingVolume -= generatedVolume;
    }
    document.getElementById('iceGenerationDetails').innerHTML = results;
}
