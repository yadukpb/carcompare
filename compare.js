document.addEventListener('DOMContentLoaded', function() {
    fetchCarOptions();
});

async function fetchCarOptions() {
    try {
        const response = await fetch('http://localhost:3001/api/cars');
        const cars = await response.json();
        populateDropdowns(cars);
    } catch (error) {
        console.error('Error fetching car options:', error);
    }
}

function populateDropdowns(cars) {
    const car1Select = document.getElementById('car1');
    const car2Select = document.getElementById('car2');

    cars.forEach(car => {
        const option = document.createElement('option');
        option.value = car.id;
        option.textContent = `${car.company} ${car.name}`;
        car1Select.appendChild(option.cloneNode(true));
        car2Select.appendChild(option);
    });
}

async function compareCars() {
    const car1Id = document.getElementById('car1').value;
    const car2Id = document.getElementById('car2').value;

    if (!car1Id || !car2Id) {
        alert('Please select two cars to compare');
        return;
    }

    await fetchCarComparison([car1Id, car2Id]);
}

function displayComparison(car1, car2) {
    const comparisonTable = document.getElementById('comparisonTable');
    comparisonTable.style.display = 'block';
    comparisonTable.innerHTML = '';

    const fields = [
        { key: 'name', label: 'Name' },
        { key: 'price', label: 'Price' },
        { key: 'onRoadPrice', label: 'On Road Price' },
        { key: 'engine', label: 'Engine' },
        { key: 'engineType', label: 'Engine Type' },
        { key: 'displacement', label: 'Displacement' },
        { key: 'power', label: 'Power' },
        { key: 'fuelType', label: 'Fuel Type' },
        { key: 'mileage', label: 'Mileage' },
        { key: 'topSpeed', label: 'Top Speed' },
        { key: 'fuelTankCapacity', label: 'Fuel Tank Capacity' },
        { key: 'emissionNorm', label: 'Emission Norm' },
        { key: 'frontSuspension', label: 'Front Suspension' },
        { key: 'rearSuspension', label: 'Rear Suspension' },
        { key: 'steeringType', label: 'Steering Type' },
        { key: 'frontBrakeType', label: 'Front Brake Type' },
        { key: 'rearBrakeType', label: 'Rear Brake Type' },
        { key: 'tyreSize', label: 'Tyre Size' },
        { key: 'tyreType', label: 'Tyre Type' },
        { key: 'wheelSize', label: 'Wheel Size' },
        { key: 'alloyWheelSizeFront', label: 'Alloy Wheel Size (Front)' },
        { key: 'alloyWheelSizeRear', label: 'Alloy Wheel Size (Rear)' }
    ];

    // Add car names and images
    const headerRow = document.createElement('div');
    headerRow.className = 'table-row';
    headerRow.innerHTML = `
        <div class="car-name">${car1.company} ${car1.name}</div>
        <img class="car-image" src="${car1.image}" alt="${car1.name}">
        <div class="car-name">${car2.company} ${car2.name}</div>
        <img class="car-image" src="${car2.image}" alt="${car2.name}">
    `;
    comparisonTable.appendChild(headerRow);

    // Add comparison rows
    fields.forEach(field => {
        const row = document.createElement('div');
        row.className = 'table-row';
        row.innerHTML = `
            <span>${field.label}</span>
            <span>${car1[field.key] || '-'}</span>
            <span>${car2[field.key] || '-'}</span>
        `;
        comparisonTable.appendChild(row);
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Add event listeners to the dropdowns
document.getElementById('car1').addEventListener('change', updateCompareButton);
document.getElementById('car2').addEventListener('change', updateCompareButton);

function updateCompareButton() {
    const car1Selected = document.getElementById('car1').value !== '';
    const car2Selected = document.getElementById('car2').value !== '';
    document.querySelector('.compare-button').disabled = !(car1Selected && car2Selected);
}

// Initialize the compare button state
updateCompareButton();

async function fetchCarComparison(ids) {
    try {
        const response = await fetch(`http://localhost:3001/api/compare?ids=${ids.join(',')}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const cars = await response.json();
        displayComparison(cars[0], cars[1]);
    } catch (error) {
        console.error('Error fetching car comparison:', error);
    }
}
