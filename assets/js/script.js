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
//entire futre forecast container
var futureContainerEl = document.querySelector(".forecast");
// future card container
var futureCardsEl = document.querySelector("#forecast");
// forecast title 
var forecastTitleEl = document.querySelector(".forecast-title");
// search history
var searchHistoryEl = document.querySelector("#search-history");
// previously searched city buttons
var searchHistoryBtn = document.querySelector(".search-history-btn");
var cities = ["New York", "London", "San Diego", "Boston", "Los Angeles"];

var formSearchWeather = function(event) {
    // stops page from refreshing 
    event.preventDefault();
  
    // get value from input element
    var location = formInputEl.value.trim();
    if (location) {
      getWeather(location);
      formInputEl.value = "";
      saveSearch(location);
      searchHistory(location);
    } else {
      alert("Enter a location");
    }
};

var getWeather = function(location) {
    // open weather api
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&units=imperial&appid=2ea6c593bf0230a2e5e91e4e3927cc96";

    fetch(apiURL).then(function(response) {
        response.json().then(function(data){
            // console.log(data);
            displayWeather(data, location);
        });
    })
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
    var apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&appid=2ea6c593bf0230a2e5e91e4e3927cc96";
    fetch(apiURL).then(function(response) {
        response.json().then(function(data){
            showUVIndex(data);
        });
    });
    getFutureWeather(latitude, longitude);
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

var getFutureWeather = function(latitude, longitude) {
    var apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=2ea6c593bf0230a2e5e91e4e3927cc96";
    fetch(apiURL).then(function(response) {
        response.json().then(function(data){
            console.log(data);
            displayFutureWeather(data);
        });
    });
};

var displayFutureWeather = function(weather) {
    futureCardsEl.textContent = "";
    forecastTitleEl.textContent = "5 Day Forecast:";

    // sets dailyWeather equal to the array inside weather that holds the forecast for week
    let i = 1;
    var dailyWeather = weather.daily[i];
    // loops through the dailyWeather array
    while (i <= 5) {
        // creates html element, adds class, and appends to main container
        var forecastCard = document.createElement("div");
        forecastCard.classList = "col-2 card future";
        futureCardsEl.appendChild(forecastCard);

        // date
        var dateEl = document.createElement("h2");
        dateEl.textContent = moment.unix(weather.daily[i].dt).format("MMM DD, YYYY");
        forecastCard.append(dateEl);

        // icon
        var iconEl = document.createElement("img");
        var iconKey = weather.daily[i].weather[0].icon;
        iconURL = "https://openweathermap.org/img/w/" + iconKey + ".png";
        iconEl.setAttribute("src", iconURL);
        forecastCard.append(iconEl);

        // temperature
        var tempEl = document.createElement("span");
        tempEl.textContent = "Temp: " + weather.daily[i].feels_like.day + " °F";
        forecastCard.appendChild(tempEl);
        // wind speed
        var windEl = document.createElement("span");
        windEl.textContent = "Wind: " + weather.daily[i].wind_speed + " mph";
        forecastCard.appendChild(windEl);
        // humidity
        var humidityEl = document.createElement("span");
        humidityEl.textContent = "Humidity: " + weather.daily[i].humidity + " %";
        forecastCard.appendChild(humidityEl);

        i++
    };
};

var exampleButtons = function() {
    localStorage.setItem("City Names", JSON.stringify(cities));
    
    for (i=0; i<cities.length; i++) {
        var cityNames = JSON.parse(localStorage.getItem("City Names"));
        var individCity = cityNames[i]

        searchHistory(individCity);
    };
}

var searchHistory = function(searched) {
    searchHistoryTxt = document.createElement("button");
    searchHistoryTxt.textContent = searched;
    searchHistoryEl.prepend(searchHistoryTxt);
    searchHistoryTxt.classList = "btn city-name search-history-btn";
    searchHistoryTxt.setAttribute("cityBtn", searched);
    searchHistoryTxt.setAttribute("type", "button");

    searchHistoryTxt.addEventListener("click", function(){
        formSearchHistory(searched);
    });
};

var saveSearch = function(city) {
    var newCity = city;
    
    // pushes example cities value
    cities.push(newCity);
    localStorage.setItem("City Names", JSON.stringify(cities));
};

var formSearchHistory = function(searched) {
    if (searched) {
      getWeather(searched);
    } 
};

searchBtn.addEventListener("click", formSearchWeather);

exampleButtons();
