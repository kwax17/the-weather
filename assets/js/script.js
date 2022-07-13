// search bar term
var formInputEl = document.querySelector(".form-input");
// city displayed in detail
var currentCityEl = document.querySelector("#current-city");
// main city name/title
var cityNameEl = document.querySelector(".city-name");
// seach button
var searchBtn = document.querySelector(".search-here");
// temp in box
var currentWeatherEl = document.querySelector("#current-weather");
var cities = [];

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
      alert("Enter a location");
    }
    saveSearch();
};

var getWeather = function(location) {
    // open weather api
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&units=imperial&appid=2ea6c593bf0230a2e5e91e4e3927cc96";

    fetch(apiURL).then(function(response) {
        if (response.ok) {
            response.json().then(function(data){
                // console.log(data);
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

var saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};

var displayWeather = function(weather, searchTerm) {
    // clear out the old 
    currentWeatherEl.textContent = "";
    // defines header as the term searched for
    cityNameEl.textContent = searchTerm;
    // console.log(weather);
    
    // date
    var dateEl = document.createElement("span");
    var dateEl = moment().format("  MM/D/YY");
    cityNameEl.append(dateEl);
    // icon
    var iconEl = document.createElement("img");
    var iconKey = weather.weather[0].icon;
    iconURL = "https://openweathermap.org/img/w/" + iconKey + ".png";
    iconEl.setAttribute("src", iconURL);
    cityNameEl.append(iconEl);
    // temperature
    var tempEl = document.createElement("span");
    tempEl.textContent = "Temperature: " + weather.main.temp + " °F";
    currentWeatherEl.appendChild(tempEl);
    // wind speed
    var windEl = document.createElement("span");
    windEl.textContent = "Wind: " + weather.wind.speed + " mph";
    currentWeatherEl.appendChild(windEl);
    // humidity
    var humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
    currentWeatherEl.appendChild(humidityEl);

    // get coords from info given to set up UV index function
    var latitude = weather.coord.lat;
    var longitude = weather.coord.lon;
    getUVIndex(latitude, longitude);
};

var getUVIndex = function(latitude, longitude) {
    var newApiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&appid=2ea6c593bf0230a2e5e91e4e3927cc96";
    fetch(newApiURL).then(function(response) {
        response.json().then(function(data){
            showUVIndex(data);
            // console.log(data);
        });
    });
};

var showUVIndex = function (uvi) {
    // uv  label
    var uvIndexTitle = document.createElement("span")
    uvIndexTitle.textContent =  "UV Index: " 
    uvIndexTitle.classList = "flex-row align-center";

    // uv value and added to container
    var uvIndex = document.createElement("span");
    uvIndex.textContent = uvi.current.uvi;

    // if else statment for colorful uvi container
    if (uvi.current.uvi <= 3) {
        uvIndex.classList = "safe border-box"
    } else if (uvi.current.uvi > 3 && uvi.current.uvi <= 8) {
        uvIndex.classList = "borderline border-box"
    } else if (uvi.current.uvi > 8) {
        uvIndex.classList = "danger border-box"
    };

    uvIndexTitle.append(uvIndex);
    currentWeatherEl.appendChild(uvIndexTitle);
};

var getFutureWeather = function(location) {};

searchBtn.addEventListener("click", formSearchWeather);