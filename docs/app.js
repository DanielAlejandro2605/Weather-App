/*I set as default Bogota */
window.addEventListener('load', () => {
    displayClimaticInfo('Bogota');
});

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
                    currentTemperature = kelvinToCelsius(data.main.temp);
                    injectDataInDOM(city, data, currentTemperature);
                })
        })
}

function kelvinToCelsius(kelvinDegrees){
    return Math.ceil(kelvinDegrees - 273.15);
}

function injectDataInDOM(city, data, currentTemperature){
    console.log(city);
    console.log(data);
    console.log(currentTemperature);
    injectCityInformation(city, data);
    injectWeatherInfo(data, currentTemperature);
}

function injectWeatherInfo(data, currentTemperature){
    let degree = document.querySelector('.degree-temperature');
    degree.textContent = currentTemperature;
    injectIcon(data);
}

function injectIcon(data){
    let iconImg = document.querySelector('.icon-weather');
    let icon = data.weather[0].icon;
    iconImg.setAttribute('src', `http://openweathermap.org/img/wn/${icon}@2x.png`)
    console.log(icon);
}
function injectCityInformation(city, data){
    let cityTitle = document.querySelector('.city-title');
    cityTitle.textContent = city;
    let cityCountry = document.querySelector('.city-country');
    cityCountry.textContent = data.sys.country;
    let cityDate = document.querySelector('.city-date');
    let cityHour = document.querySelector('.city-time');
    setCityDateAndTime(cityDate, cityHour, data.timezone);
    let cityWeatherDescription = document.querySelector('.city-weather-description');
    cityWeatherDescription.textContent = data.weather[0].main;
}

function setCityDateAndTime(containerDate, containerHour, offset) {
    /*Here we make the convertion of offset from seconds to hours */
    let offsetHours = (offset / 3600).toLocaleString();
    /*We create a new Date Object*/
    let d = new Date();
    /*Convert to miliseconds
      Subtract local time zone offset
      Get UTC time in miliseconds*/
    let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    console.log(utc);
    /*Create new Date object for different city and Using supplied offset in hours*/
    let nd = new Date(utc + (3600000*offsetHours));
    setCityDate(containerDate, nd);
    /*Get the hour in text*/
    let cityHourText = `${nd.getHours().toString().padStart(2, "0")} : ${nd.getMinutes().toString().padStart(2, "0")}`;
    /*Inject*/
    containerHour.textContent = cityHourText;
}

function setCityDate(container, date){
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let cityDateText = `${days[date.getDay()]},  ${date.getDate()} ${months[date.getMonth()]}`
    container.textContent = cityDateText;
}