var APIKey = "574e421ce67448aba44fe635fe6d0cdf";
var units = "imperial";
var city = "";

$("#search-button").on("click", function () {
  city = $(this).siblings("#city-search").val();
  searchAPI(city);
});

function searchAPI(city) {
  var apiURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + units + "&appid=" + APIKey;
  console.log(apiURL);
  fetch(apiURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
      });
    }
  });
}
