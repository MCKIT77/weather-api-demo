/*api key: 1fb6ecc7a506e4aafe86c237729982b0

apis: 
open weather
http://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}


geocoder

http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
*/
$(document).ready(function () {
    var apiKey = '1fb6ecc7a506e4aafe86c237729982b0';
    var baseUrl = 'https://api.openweathermap.org/data/2.5/forecast?';
    var endOfUrl = `&appid=${apiKey}&units=imperial`;
    var geoBaseUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=';
    var geoEndOfUrl = `&limit=1&appid=${apiKey}`;
    var mainUrl = '';
    var searchBtnEl = $('#search-btn');
    var searchBoxEl = $('#search-box');
    var contentEl = $('#content-side');
    var searchAreaEl = $('.search-area');
    var prevCityName = '';
    var cityName;

    displayPreviousSearches();




    function buildGeoReq(event) {
        event.preventDefault();
        event.stopPropagation();
        mainUrl = '';
        $('#content-side').empty();
        var cityName = searchBoxEl.val().trim();
        var cityPreview = cityName.split(',');
        var cityDisplay = cityPreview[0];
        var userInput = `${cityName.toLowerCase()},us`;
        var reqUrl = `${geoBaseUrl}${userInput}${geoEndOfUrl}`;
        getCityName(reqUrl);
        // clearUserInput();


    }


    function getCityName(reqUrl) {
        fetch(reqUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (response) {
                var cityLat = response[0].lat;
                var cityLon = response[0].lon;
                mainUrl = `${baseUrl}lat=${cityLat}&lon=${cityLon}${endOfUrl}`;
                getWeather(mainUrl);
            });
    }

    function displayData(data) {
        contentEl.empty(); // Clear the content

        var cityName = searchBoxEl.val().trim();
        var cityPreview = cityName.split(',');
        var cityDisplay = cityPreview[0];

        var cityDisplayEl = $('<h2>').text(cityDisplay.toUpperCase());
        var currentDate = new Date().toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
        var currentDateEl = $('<h2>').text(currentDate);
        contentEl.append(cityDisplayEl, currentDateEl);


        // Save search in local storage
        saveSearch(cityName);

        // Display previous searches
        displayPreviousSearches();

        // Display current weather
        var currentWeather = data.list[0];
        var currentTemp = currentWeather.main.temp;
        var currentWind = currentWeather.wind.speed;
        var currentHumidity = currentWeather.main.humidity;
        var currentIcon = $('<img>').attr('src', `https://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`);
        console.log(currentWeather);

        var currentWeatherEl = $('<div>').addClass('current-weather');
        currentWeatherEl.append(currentIcon);
        currentWeatherEl.append($('<p>').text(`Temperature: ${currentTemp} °F`));
        currentWeatherEl.append($('<p>').text(`Wind Speed: ${currentWind} mph`));
        currentWeatherEl.append($('<p>').text(`Humidity: ${currentHumidity}%`));
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
            var weatherIcon = $('<img>').attr('src', `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`)

            var forecastCard = $('<div>').addClass('card dark-grey');

            forecastCard.append($('<h4>').text(`${forecastDay}, ${forecastNumericDate}`));
            forecastCard.append(weatherIcon);
            forecastCard.append($('<p>').text(`Temperature: ${forecastTemp} °F`));
            forecastCard.append($('<p>').text(`Wind Speed: ${forecastWind} mph`));
            forecastCard.append($('<p>').text(`Humidity: ${forecastHumidity}%`));

            forecastWeatherEl.append(forecastCard);
        });

        contentEl.append(forecastWeatherEl);
        var clearBtnEl = $('<button>').text('Clear Content').addClass('btn btn-danger').on('click', function () {
            $('#content-side').empty();
        })
        contentEl.append(clearBtnEl);
        $('#search-box').val('');
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

    function buildPrevGeoReq(event) {
        event.preventDefault();
        event.stopPropagation();
        $('#content-side').empty();
        prevCityName = '';
        cityName = event.target.textContent;
        prevCityName = cityName;
        var cityPreview = cityName.split(',');
        var cityDisplay = cityPreview[0];
        var userInput = `${cityName.toLowerCase()},us`;
        var reqUrl = `${geoBaseUrl}${userInput}${geoEndOfUrl}`;

        getPrevCityName(reqUrl);

        // clearUserInput();
    }


    function getPrevCityName(reqUrl) {
        fetch(reqUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (response) {
                var cityLat = response[0].lat;
                var cityLon = response[0].lon;
                mainUrl = `${baseUrl}lat=${cityLat}&lon=${cityLon}${endOfUrl}`;
                getPrevWeather(mainUrl);
            });
    }
    // function clearUserInput() {
    //     $('#search-box').val('');
    // }
    function displayPrevData(data) {
        contentEl.empty(); // Clear the content

        var cityName = prevCityName;
        var cityPreview = cityName.split(',');
        var cityDisplay = cityPreview[0];

        var cityDisplayEl = $('<h2>').text(cityDisplay.toUpperCase());
        var currentDate = new Date().toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
        var currentDateEl = $('<h2>').text(currentDate);
        contentEl.append(cityDisplayEl, currentDateEl);







        // Display current weather
        var currentWeather = data.list[0];
        var currentTemp = currentWeather.main.temp;
        var currentWind = currentWeather.wind.speed;
        var currentHumidity = currentWeather.main.humidity;
        var currentIcon = $('<img>').attr('src', `https://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`);
        console.log(currentWeather);

        var currentWeatherEl = $('<div>').addClass('current-weather');
        currentWeatherEl.append(currentIcon);
        currentWeatherEl.append($('<p>').text(`Temperature: ${currentTemp} °F`));
        currentWeatherEl.append($('<p>').text(`Wind Speed: ${currentWind} mph`));
        currentWeatherEl.append($('<p>').text(`Humidity: ${currentHumidity}%`));
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
            var weatherIcon = $('<img>').attr('src', `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`)

            var forecastCard = $('<div>').addClass('card dark-grey');

            forecastCard.append($('<h4>').text(`${forecastDay}, ${forecastNumericDate}`));
            forecastCard.append(weatherIcon);
            forecastCard.append($('<p>').text(`Temperature: ${forecastTemp} °F`));
            forecastCard.append($('<p>').text(`Wind Speed: ${forecastWind} mph`));
            forecastCard.append($('<p>').text(`Humidity: ${forecastHumidity}%`));

            forecastWeatherEl.append(forecastCard);
        });

        contentEl.append(forecastWeatherEl);


    }

    function getPrevWeather(url) {
        fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                displayPrevData(data);
            })
            .catch(function (error) {
                console.log('Error:', error);
            });
    }

    function displayPreviousSearches() {
        var previousSearches = getPreviousSearches();

        var previousSearchesEl = $('<div>').addClass('previous-searches');
        previousSearches.forEach(function (search) {
            var buttonEl = $('<button>').addClass('search-button').text(search.displayName);
            buttonEl.addClass('prev-search-btn');
            previousSearchesEl.append(buttonEl);

            // Attach event listener to the newly created button
            buttonEl.on('click', buildPrevGeoReq);
        });

        $('.previous-searches').empty();
        searchAreaEl.append(previousSearchesEl);
    }



    function getPreviousSearches() {
        var searches = localStorage.getItem('previousSearches');
        return searches ? JSON.parse(searches) : [];
    }

    function saveSearch(search) {
        var displayName = search.split(',')[0];
        var searchObject = {
            search: search,
            displayName: displayName
        };

        var previousSearches = getPreviousSearches();
        var existingSearchIndex = previousSearches.findIndex(function (prevSearch) {
            return prevSearch.search === search;
        });

        if (existingSearchIndex !== -1) {
            previousSearches.splice(existingSearchIndex, 1);
        }

        previousSearches.unshift(searchObject);
        if (previousSearches.length > 5) {
            previousSearches.pop();
        }

        localStorage.setItem('previousSearches', JSON.stringify(previousSearches));
    }

    $('#clear-prev-searches').on('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        $(".previous-searches").empty()
        clearSearchHistory();
        displayPreviousSearches();
    });

    function clearSearchHistory() {
        localStorage.removeItem('previousSearches');
        $('.previous-searches').empty(); // Clear the previous search buttons
        displayPreviousSearches();

    }


    $('#search-btn').on('click', buildGeoReq);

});