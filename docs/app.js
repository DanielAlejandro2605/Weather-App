let btnTopCities = document.querySelectorAll('.btn-top-city');
btnTopCities.forEach(button => button.addEventListener('click', selectCity));

function selectCity(){
    let citySelected = this.textContent;
    displayClimaticInfo(citySelected);
}

function displayClimaticInfo(city){
    let currentLongitude;
    let currentLatitude;
    let currentTemperature;

    let api = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=26a4058ef695f3fe7f4c19963b1d3560`;
    fetch(api)
        .then(response => {
            return response.json();
        })
        .then(data => {
            currentLongitude = data[0].lon;
            currentLatitude = data[0].lat;
        })
        .then(() => {
            let apiCurrentCity = `https://api.openweathermap.org/data/2.5/weather?lat=${currentLatitude}&lon=${currentLongitude}&appid=${"26a4058ef695f3fe7f4c19963b1d3560"}`;
            fetch(apiCurrentCity)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    injectDataInDOM(data);
                    currentTemperature = kelvinToCelsius(data.main.temp);
                    console.log(currentTemperature);
                })
        })
}

function kelvinToCelsius(kelvinDegrees){
    return Math.ceil(kelvinDegrees - 273.15);
}

function injectDataInDOM(data){
    console.log(data);
}
