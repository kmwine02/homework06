var APIKey = "574e421ce67448aba44fe635fe6d0cdf";
var units = "imperial";
var excludeItems = "minutely,hourly,alerts";
var city;
var latitude;
var longitude;
var currentForecastEl = document.querySelector("#current-forecast");
var weekForecastEl = document.querySelector("#week-forecast");

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
            for (var i = 0; i < 6; i++) {
                printResults(localResponse.daily[i]);
            }
        }
    })
    .catch(function (error) {
        console.error(error);
    })
}

// add the results from the API to the page
function printResults(resultObj) {
    console.log(resultObj);

    var dailyCard = document.createElement("div");
    dailyCard.classList.add("card-body");
    currentForecastEl.append(dailyCard);
}
