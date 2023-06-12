/*api key: 1fb6ecc7a506e4aafe86c237729982b0

apis: 
open weather
http://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}


geocoder

http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
*/

$(document).ready(function () {

    var apiKey = '1fb6ecc7a506e4aafe86c237729982b0'

    var baseUrl = `http://api.openweathermap.org/data/2.5/forecast?`



    var endOfUrl = `&appid=${apiKey}&units=imperial`



    var geoBaseUrl = `http://api.openweathermap.org/geo/1.0/direct?q=`

    var geoEndOfUrl = `&limit=1&appid=${apiKey}`

    var searchBtnEl = $('#search-btn');

    var searchBoxEl = $('#search-box');





    function buildGeoReq(event) {
        event.preventDefault();
        event.stopPropagation();

        var cityName = searchBoxEl.val().trim();

        var userInput = `${cityName.toLowerCase()},us`;

        console.log(cityName.toString());

        var reqUrl = `${geoBaseUrl}${userInput}${geoEndOfUrl}`;
        console.log(reqUrl);
        getCityName(reqUrl);





    }

    /*, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }
            }
    */


    function getCityName(reqUrl) {
        fetch(reqUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (response) {
                //getting lat and lon
                var cityLat = response[0].lat;
                var cityLon = response[0].lon;
                var mainUrl = '';
                //building url and returning
                var mainUrl = `${baseUrl}lat=${cityLat}&lon=${cityLon}${endOfUrl}`;
                console.log(mainUrl);
                return mainUrl;

            })



    }

    searchBtnEl.on('click', buildGeoReq);
})