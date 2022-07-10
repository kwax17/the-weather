// search bar term
var formInputEl = document.querySelector("#form-input");
// city displayed in detail
var currentCityEl = document.querySelector("#current-city");
// main city name/title
var cityNameEl = document.querySelector(".city-name");
// seach button
var searchBtn = document.querySelector(".search");
// temp in box
var currentWeatherEL = document.querySelector(".current-weather");

var getWeather = function(location) {
    // open weather api
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=${location}&exclude=hourly,minutely&appid=2ea6c593bf0230a2e5e91e4e3927cc96";

    fetch(apiURL).then(function(response) {
        if (response.ok) {
            response.json().then(function(data){
                console.log(data);
                displayWeather(data, location);
            });
        } else {
            alert("Error");
        }
    })
    .catch(function(error){
        alert("Not connected");
    });
};

var formSearchWeather = function(event) {
    // stops page from refreshing 
    event.preventDefault();
  
    // get value from input element
    var location = formInputEl.value.trim();
  
    if (location) {
      getWeather(location);
      getFutureWeather(location);
      cities.unshift({location});
      formInputEl.value = "";
    } else {
      alert("Please enter a location")
    }
    saveSearch();
};

var saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};

var displayWeather = function(weather, searchTerm) {
    // clear out the old
    currentWeatherEl.textContent = "";
    cityNameEl.textContent = searchTerm;

    // make a new element and add to html
    // var cityName = searchTerm
    // var titleEl = document.createElement("span");
    // cityNameEl.textContent = cityName;

    // temperature
    var tempEl = document.createElement("span");
    tempEl.textContent = "Temperature: " + weather.main.temp + " °F";
    currentWeatherEL.appendChild(tempEl);

    var windEl = document.createElement("span");
    windEl.textContent = "Wind: " + weather.main.wind.speed + " mph";
    currentWeatherEL.appendChild(windEl);

    var humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
    currentWeatherEL.appendChild(humidityEl);

};

var getFutureWeather = function(location) {};

searchBtn.addEventListener("submit", formSearchWeather);