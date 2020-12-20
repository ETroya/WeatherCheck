let cities = ["Riverside", "New York", "Tampa", "Portland"];
let apiKey = "fa3f573241aa0d91a1882da9d4d9c62e";
let lat = "latitude";
let lon = "longitude";
let uvIndex = (lat + lon)

cities.forEach(function (city, index, originalArr) {
    renderButtons(city);

    if (index === originalArr.length - 1) {
        displayWeatherInfo(city);
    }
})

function displayWeatherInfo(city) {
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}&units=imperial`;

    $.get(queryURL).then(function (response) {
        // let unIndex = response.coord.lon.lat;
        let lon = response.coord.lon;
        let lat = response.coord.lat;
        let queryUV = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=` + apiKey;

        $.get(queryUV)
            .then(function (uvResponse) {
                console.log(uvResponse)
                //===== Data Calculations =======
                let temperature = response.main.temp;
                let windSpeed = response.wind.speed;
                let humidity = response.main.humidity;
                // ====== Building HTML Element =====
                let cityDiv = $("<div class='city'>");
                let header = $("<h4>").text(city);
                let p1 = $("<p>").text("Temperature: " + temperature + String.fromCharCode(176) + "F");
                let p2 = $("<p>").text("Wind Speed: " + windSpeed + "mph");
                let p3 = $("<p>").text("Humidity: " + humidity + "%");

                let color = "green";
                let UVindex = uvResponse.value;
                if(UVindex > 10){
                    color = "red";
                }
                else if(UVindex > 4){
                    color = "orange";
                };


                let uvSpan = $("<span>").text(uvResponse.value).css("color", color)
                let p4 = $("<p>").text("UV Index: ").append(uvSpan);
                cityDiv.append(header, p1, p2, p3, p4);
        
                // =======Push Element to Page =====
        
                $("#weatherView").empty();
                $("#weatherView").prepend(cityDiv);
            })


    })

}

function renderButtons(city) {
    let btn = $("<button>");
    btn.addClass("city-btn btn btn-default").css("display", "block");
    btn.attr("data-name", city);
    btn.text(city);
    $(".citiesArray").append(btn);
}

$("#searchBtn").on("click", function (event) {
    event.preventDefault();

    // ====== Declare Variables ======
    let $weather = $("#cityInput").val();
    

    // ===== Update Search History =====
    cities.push($weather);
    localStorage.setItem("weather", JSON.stringify(cities))
    

    // == Function calls ==
    renderButtons($weather);
    displayWeatherInfo($weather)
});

$(document).on("click", ".city-btn", function () {
    let city = $(this).attr("data-name");
    displayWeatherInfo(city);
});