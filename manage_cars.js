document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const carSelect = document.getElementById('carSelect');
    const carForm = document.getElementById('carForm');
    let cars = [];


    fetch('http://localhost:3001/api/cars')
        .then(response => response.json())
        .then(data => {
            cars = data;
            populateCarSelect(cars);
        });


    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredCars = cars.filter(car => 
            car.name.toLowerCase().includes(searchTerm) || 
            car.id.toString().includes(searchTerm)
        );
        populateCarSelect(filteredCars);
    });


    carSelect.addEventListener('change', function() {
        const selectedCarId = this.value;
        if (selectedCarId) {
            fetch(`http://localhost:3001/api/cars/${selectedCarId}`)
                .then(response => response.json())
                .then(car => {
                    populateForm(car);
                    carForm.style.display = 'block';
                });
        } else {
            carForm.style.display = 'none';
        }
    });


    carForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const carData = getFormData();
        const method = carData.id ? 'PUT' : 'POST';
        const url = carData.id ? `http://localhost:3001/api/cars/${carData.id}` : 'http://localhost:3001/api/cars';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(carData),
        })
        .then(response => response.json())
        .then(data => {
            alert(carData.id ? 'Car updated successfully' : 'Car added successfully');
            location.reload();
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    });

    function populateCarSelect(carsArray) {
        carSelect.innerHTML = '<option value="">Select a car</option>';
        carsArray.forEach(car => {
            const option = document.createElement('option');
            option.value = car.id;
            option.textContent = `${car.name} (ID: ${car.id})`;
            carSelect.appendChild(option);
        });
    }

    function populateForm(car) {
        for (const key in car) {
            const input = document.getElementById(key);
            if (input) {
                input.value = car[key];
            }
        }
    }

    function getFormData() {
        const formData = {};
        const inputs = carForm.querySelectorAll('input');
        inputs.forEach(input => {
            formData[input.id] = input.value;
        });
        return formData;
    }
});
