var APIKey = "574e421ce67448aba44fe635fe6d0cdf";
var units = "imperial";
var excludeItems = "minutely,hourly,alerts";
var city;
var latitude;
var longitude;
var currentForecastEl = document.querySelector("#current-forecast");
var weekForecastEl = document.querySelector("#week-forecast");
var weekForecastBodyEl = document.querySelector("#weekly-forecast-header");
var pastSearchesEl = document.querySelector("#past-searches");
var pastSearchItems = document.querySelector(".city-btn");

// searches for weather based on city entered
$("#search-button").on("click", function() {
  city = $(this).siblings("#city-search").val();
  findLatLong(city);

  loadCities();
});

// calling API to get latitude and longitude for the entered city
function findLatLong(city) {
  var apiURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=" +
    units +
    "&appid=" +
    APIKey;
  console.log(apiURL);
  fetch(apiURL).then(function (latLongResponse) {
    if (latLongResponse.ok) {
      latLongResponse.json().then(function (latLongResponse) {
        latitude = latLongResponse.coord.lat;
        longitude = latLongResponse.coord.lon;
        console.log(longitude);
        console.log(latitude);
        getWeather(latitude, longitude);
      });
    }
  });
}

// calling weather API to get weather for the specified city
function getWeather(lat, long) {
  var weatherApiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=" + excludeItems + "&units=" + units + "&appid=" + APIKey;


  saveCity(city);
 

  fetch(weatherApiUrl)
    .then(function (response) {
        if (!response.ok) {
            throw response.json();
        }

        return response.json();
    })
    .then(function (localResponse) {
        if (!localResponse.daily.length) {
            console.log("No results");
        } else {
            currentForecastEl.innerHTML = "";
            weekForecastEl.innerHTML = "";
            weekForecastBodyEl.innerHTML = "";
            printDailyResults(localResponse.daily[0]);
            for (var i = 1; i < 6; i++) {
                printWeeklyResults(localResponse.daily[i]);

            }
        }
    })
    .catch(function (error) {
        console.error(error);
    })
}

// add the current weather in the top section
function printDailyResults(resultObj) {
    console.log(resultObj);

    
    var dailyCard = document.createElement("div");
    dailyCard.classList.add("card-body");
    currentForecastEl.append(dailyCard);

    var dailyCardHeaderEl = document.createElement("h3");
    var date = moment.unix(resultObj.dt).format("MM/DD/YYYY");
    dailyCardHeaderEl.textContent = city + " (" + date + ")";

    var iconEl = document.createElement("img");
    var iconSrc = "https://openweathermap.org/img/w/" + resultObj.weather[0].icon + ".png";
    var iconAlt = resultObj.weather[0].description;
    iconEl.setAttribute("src", iconSrc);
    iconEl.setAttribute("alt", iconAlt);

    var weeklyCardHeader = document.createElement("h3");
    weeklyCardHeader.textContent = "5 day forecast:";
    weekForecastBodyEl.append(weeklyCardHeader);

    var uvIndex = resultObj.uvi


    

    var dailyCardContentEl = document.createElement("div");
    var tempEl = document.createElement("p");
    tempEl.textContent = "Temp: " + resultObj.temp.day +"°F";
    var windSpeedEl = document.createElement("p");
    windSpeedEl.textContent = "Wind: " + resultObj.wind_speed + " MPH";
    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + resultObj.humidity + "%";
    var uvIndexEl = document.createElement("p");
    uvIndexEl.textContent = "UV Index: " + uvIndex;

    if (uvIndex >= 7) {
        uvIndexEl.classList.add("bad");
      } else if (uvIndex >= 3) {
        uvIndexEl.classList.add("okay");
      } else {
        uvIndexEl.classList.add("good");
      }

    dailyCardHeaderEl.append(iconEl);
    dailyCardContentEl.append(tempEl, windSpeedEl, humidityEl, uvIndexEl);
    dailyCard.append(dailyCardHeaderEl, dailyCardContentEl);
    
}

// add the 5 day forecast to the cards
function printWeeklyResults(resultObj) {
    console.log(resultObj);

    var weeklyCard = document.createElement("div");
    weeklyCard.classList.add("card-body","weekly-card",  "card", "text-white", "bg-primary", "mb-3");
    weekForecastEl.append(weeklyCard);

    var weeklyCardHeaderEl = document.createElement("h5");
    var date = moment.unix(resultObj.dt).format("MM/DD/YYYY");

    weeklyCardHeaderEl.textContent = date;

    var weeklyCardContentEl = document.createElement("div");

  
    var iconEl = document.createElement("img");
    var iconSrc = "https://openweathermap.org/img/w/" + resultObj.weather[0].icon + ".png";
    var iconAlt = resultObj.weather[0].description;
    iconEl.setAttribute("src", iconSrc);
    iconEl.setAttribute("alt", iconAlt);
    

    var weeklyCardDetailsEl = document.createElement("p");
    weeklyCardDetailsEl.innerHTML = "<strong>Temp:</strong> " + resultObj.temp.day + "°F" + "<br/>";
    weeklyCardDetailsEl.innerHTML += "<strong>Wind:</strong> " + resultObj.wind_speed + " MPH" + "<br/>";
    weeklyCardDetailsEl.innerHTML += "<strong>Humidity:</strong> " + resultObj.humidity + "%" + "<br/>";

  
    weeklyCardContentEl.append(iconEl, weeklyCardDetailsEl);
    weeklyCard.append(weeklyCardHeaderEl, weeklyCardContentEl);
}

// saves city to local storage
function saveCity(city) {
    var cities = JSON.parse(localStorage.getItem("city")) || [];


    cities.push(city);

    localStorage.setItem("city", JSON.stringify(cities));

  
}

// loads saved cities on page from local storage
function loadCities() {
    var cities = JSON.parse(localStorage.getItem("city"));
    console.log("****loading cities****" + cities);
    pastSearchesEl.innerHTML = "";

    if (cities) {
        for (var j = 0; j < cities.length; j++) {
            var cityDiv = document.createElement("div");
            var cityBtn = document.createElement("btn");
            cityBtn.textContent = cities[j];
            cityBtn.classList.add("btn", "btn-secondary", "city-btn");
            cityBtn.setAttribute("data-city-name", JSON.stringify(cities[j]));
            console.log("**Past city****" + cities[j] );
            cityDiv.classList.add("btn-div");
            pastSearchesEl.append(cityDiv);
            cityDiv.append(cityBtn);
        }
    }
}

function displayIcon(iconCode) {
    var iconSrc = "https://openweathermap.org/img/w/" + iconCode + ".png";
    iconElement.setAttribute("src", iconSrc);
    iconElement.setAttribute("alt", iconAlt);
  };

  var searchPastCity = function(event) {
      if (event.target.classList.contains("city-btn")) {
          var searchedCity = event.target.getAttribute("data-city-name");
          findLatLong(searchedCity);
      }
  }

  pastSearchItems.addEventListener("click", searchPastCity);
