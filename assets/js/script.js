var APIKey = "574e421ce67448aba44fe635fe6d0cdf";
var units = "imperial";
var excludeItems = "minutely,hourly,alerts";
var city;
var latitude;
var longitude;
var currentForecastEl = document.querySelector("#current-forecast");
var weekForecastEl = document.querySelector("#week-forecast");
var weekForecastBodyEl = document.querySelector("#weekly-forecast-header");

$("#search-button").on("click", function () {
  city = $(this).siblings("#city-search").val();
  findLatLong(city);
});

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

function getWeather(lat, long) {
  var weatherApiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=" + excludeItems + "&units=" + units + "&appid=" + APIKey;

  console.log(weatherApiUrl);

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

// add the results from the API to the page
function printDailyResults(resultObj) {
    console.log(resultObj);

    
    var dailyCard = document.createElement("div");
    dailyCard.classList.add("card-body");
    currentForecastEl.append(dailyCard);

    var dailyCardHeaderEl = document.createElement("h3");
    var date = moment.unix(resultObj.dt).format("MM/DD/YYYY");
    dailyCardHeaderEl.textContent = city + " (" + date + ")"; 

    var weeklyCardHeader = document.createElement("h3");
    weeklyCardHeader.textContent = "5 day forecast:";
    weekForecastBodyEl.append(weeklyCardHeader);


    var dailyCardContentEl = document.createElement("p");
    dailyCardContentEl.innerHTML = "<strong>Temp:</strong> " + resultObj.temp.day +"°F"+ "<br/>";

    dailyCardContentEl.innerHTML += "<strong>Wind:</strong> " + resultObj.wind_speed + " MPH" + "<br/>";

    dailyCardContentEl.innerHTML += "<strong>Humidity:</strong> " + resultObj.humidity + "%" + "<br/>";

    dailyCardContentEl.innerHTML += "<strong>UV Index:</strong> " + resultObj.uvi + "<br/>";

    dailyCard.append(dailyCardHeaderEl, dailyCardContentEl);



}

function printWeeklyResults(resultObj) {
    console.log(resultObj);

    var weeklyCard = document.createElement("div");
    weeklyCard.classList.add("card-body","weekly-card",  "card", "text-white", "bg-primary", "mb-3");
    weekForecastEl.append(weeklyCard);

    var weeklyCardHeaderEl = document.createElement("h5");
    var date = moment.unix(resultObj.dt).format("MM/DD/YYYY");
    weeklyCardHeaderEl.textContent = date;

    var weeklyCardContentEl = document.createElement("p");
    weeklyCardContentEl.innerHTML = "<strong>Temp:</strong> " + resultObj.temp.day + "°F" + "<br/>";

    weeklyCardContentEl.innerHTML += "<strong>Wind:</strong> " + resultObj.wind_speed + " MPH" + "<br/>";

    weeklyCardContentEl.innerHTML += "<strong>Humidity:</strong> " + resultObj.humidity + "%" + "<br/>";

    weeklyCard.append(weeklyCardHeaderEl, weeklyCardContentEl);
}
