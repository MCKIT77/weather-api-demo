/*api key: 1fb6ecc7a506e4aafe86c237729982b0

apis: 
open weather
http://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}


geocoder

http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
*/

$(document).ready(function () {
    var apiKey = '1fb6ecc7a506e4aafe86c237729982b0';
    var baseUrl = 'http://api.openweathermap.org/data/2.5/forecast?';
    var endOfUrl = '&appid=' + apiKey + '&units=imperial';
    var geoBaseUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=';
    var geoEndOfUrl = '&limit=1&appid=' + apiKey;
    var mainUrl = '';
    var searchBtnEl = $('#search-btn');
    var searchBoxEl = $('#search-box');
    var contentEl = $('#content-side');
    var searchAreaEl = $('.search-area');

    function buildGeoReq(event) {
        event.preventDefault();
        event.stopPropagation();
        var cityName = searchBoxEl.val().trim();
        var cityPreview = cityName.split(',');
        var cityDisplay = cityPreview[0];
        var userInput = cityName.toLowerCase() + ',us';
        var reqUrl = geoBaseUrl + userInput + geoEndOfUrl;
        getCityName(reqUrl);
    }

    function getCityName(reqUrl) {
        fetch(reqUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (response) {
                var cityLat = response[0].lat;
                var cityLon = response[0].lon;
                mainUrl = baseUrl + 'lat=' + cityLat + '&lon=' + cityLon + endOfUrl;
                getWeather(mainUrl);
            });
    }

    function displayData(data) {
        contentEl.empty(); // Clear the content

        var cityName = searchBoxEl.val().trim();
        var cityPreview = cityName.split(',');
        var cityDisplay = cityPreview[0];

        var cityDisplayEl = $('<h2>').text(cityDisplay.toUpperCase());
        contentEl.append(cityDisplayEl);

        // Save search in local storage
        saveSearch(cityName);

        // Display previous searches
        displayPreviousSearches();

        // Display current weather
        var currentWeather = data.list[0];
        var currentTemp = currentWeather.main.temp;
        var currentWind = currentWeather.wind.speed;
        var currentHumidity = currentWeather.main.humidity;

        var currentWeatherEl = $('<div>').addClass('current-weather');
        currentWeatherEl.append($('<p>').text('Temperature: ' + currentTemp + ' °F'));
        currentWeatherEl.append($('<p>').text('Wind Speed: ' + currentWind + ' mph'));
        currentWeatherEl.append($('<p>').text('Humidity: ' + currentHumidity + '%'));
        contentEl.append(currentWeatherEl);

        // Display 5-day forecast
        var forecastWeather = data.list.slice(1, 6); // Get the next 5 days' data
        var forecastWeatherEl = $('<div>').addClass('forecast-weather');

        var currentDate = new Date(); // Get the current date

        forecastWeather.forEach(function (forecast, index) {
            var forecastDate = new Date();
            forecastDate.setDate(currentDate.getDate() + index + 1); // Increase the date by 1 day for each forecast card

            var forecastDay = forecastDate.toLocaleDateString('en-US', { weekday: 'short' });
            var forecastNumericDate = forecastDate.getDate();
            var forecastTemp = forecast.main.temp;
            var forecastWind = forecast.wind.speed;
            var forecastHumidity = forecast.main.humidity;

            var forecastCard = $('<div>').addClass('card dark-grey');
            forecastCard.append($('<h4>').text(forecastDay + ', ' + forecastNumericDate));
            forecastCard.append($('<p>').text('Temperature: ' + forecastTemp + ' °F'));
            forecastCard.append($('<p>').text('Wind Speed: ' + forecastWind + ' mph'));
            forecastCard.append($('<p>').text('Humidity: ' + forecastHumidity + '%'));

            forecastWeatherEl.append(forecastCard);
        });

        contentEl.append(forecastWeatherEl);
    }

    function displayPreviousSearches() {
        var previousSearches = getPreviousSearches();

        var previousSearchesEl = $('<div>').addClass('previous-searches');
        previousSearches.forEach(function (search) {
            var buttonEl = $('<button>').addClass('search-button').text(search.displayName);
            previousSearchesEl.append(buttonEl);
        });

        searchAreaEl.append(previousSearchesEl);
    }

    function getPreviousSearches() {
        var searches = localStorage.getItem('previousSearches');
        return searches ? JSON.parse(searches) : [];
    }

    function saveSearch(search) {
        var previousSearches = getPreviousSearches();
        var displayName = search.split(',')[0];
        var searchObject = {
            search: search,
            displayName: displayName
        };

        previousSearches.push(searchObject);
        localStorage.setItem('previousSearches', JSON.stringify(previousSearches));
    }

    function getWeather(url) {
        fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                displayData(data);
            })
            .catch(function (error) {
                console.log('Error:', error);
            });
    }

    searchBtnEl.on('click', buildGeoReq);
});








    // var apiKey = '1fb6ecc7a506e4aafe86c237729982b0';

    // var baseUrl = `http://api.openweathermap.org/data/2.5/forecast?`;



    // var endOfUrl = `&appid=${apiKey}&units=imperial`;



    // var geoBaseUrl = `http://api.openweathermap.org/geo/1.0/direct?q=`;

    // var geoEndOfUrl = `&limit=1&appid=${apiKey}`;

    // var mainUrl = '';

    // var searchBtnEl = $('#search-btn');

    // var searchBoxEl = $('#search-box');

    // var contentEl = $('#content-side');






    // function buildGeoReq(event) {
    //     event.preventDefault();
    //     event.stopPropagation();

    //     var cityName = searchBoxEl.val().trim();

    //     var cityPreview = cityName.split(',');
    //     var cityDisplay = cityPreview[0];



    //     var userInput = `${cityName.toLowerCase()},us`;

    //     console.log(cityName.toString());

    //     var reqUrl = `${geoBaseUrl}${userInput}${geoEndOfUrl}`;
    //     console.log(reqUrl);
    //     getCityName(reqUrl);









    // }









    // /*, {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${apiKey}`
    //             }
    //         }
    // */


    // function getCityName(reqUrl) {
    //     fetch(reqUrl)
    //         .then(function (response) {
    //             return response.json();
    //         })
    //         .then(function (response) {
    //             //getting lat and lon
    //             var cityLat = response[0].lat;
    //             var cityLon = response[0].lon;
    //             mainUrl = '';
    //             //building url and returning
    //             mainUrl = `${baseUrl}lat=${cityLat}&lon=${cityLon}${endOfUrl}`;
    //             console.log(mainUrl);
    //             getWeather(mainUrl);

    //         })



    // }


    // //function to display content
    // function displayData(data) {
    //     contentEl.textContent = ''

    //     //must create many variables from data


    //     var weather = list[current];
    //     var list = data.list;



    //     var cityName = searchBoxEl.val().trim();

    //     var cityPreview = cityName.split(',');
    //     var cityDisplay = cityPreview[0];

    //     var cityDisplayEl = document.createElement('h2');
    //     cityDisplayEl.textContent = cityDisplay;

    //     console.log(list);
    //     // list.forEach(function (listItem) {


    //     // })

    //     // need to display temp, wind, and humidity
    //     console.log(data);
    // }



    // function getWeather(mainUrl) {
    //     fetch(mainUrl)
    //         .then(function (response) {
    //             return response.json();
    //         })
    //         .then(function (data) {
    //             displayData(data);
    //         })

    // }




    // searchBtnEl.on('click', buildGeoReq);
// })