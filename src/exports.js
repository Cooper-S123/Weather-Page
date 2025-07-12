function WeatherData(time, condition, temp, precip, humidity) {
    this.time = time;
    this.condition = condition;
    this.temp = temp;
    this.precip = precip;
    this.humidity = humidity;
}

async function getWeatherData(location) {
    //input API key in the fetch request
    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=`, { mode: 'cors' });
        if (response.status >= 400) {
            return "failure";
        }
        const data = await response.json();
        const weather = new WeatherData(data.currentConditions.datetime,
            data.currentConditions.conditions,
            data.currentConditions.temp,
            data.currentConditions.precip,
            data.currentConditions.humidity
        )
        return weather;
    } catch (err) {
        return "failure";
    }
}

let temperature;
let iterations = 0;
async function displayWeather(location, currentUnit) {
    const WeatherData = await getWeatherData(location);

    document.body.style.backgroundColor = changeBackground(WeatherData);

    const head = document.querySelector("#dataHeader");
    const time = document.querySelector("#Time");
    const temp = document.querySelector("#Temp");
    const condition = document.querySelector("#Condition");
    const precip = document.querySelector("#Precip");
    const humidity = document.querySelector("#Humidity");
    const unitToggleBtn = document.querySelector("#unitToggle");
    const unit = document.querySelector("#unit");

    if (WeatherData === "failure") {
        head.textContent = "Not a valid location.";
        return;
    }

    head.textContent = `Current weather in ${location}:`;
    time.textContent = WeatherData.time;
    temp.textContent = `${WeatherData.temp}°${currentUnit}`;
    condition.textContent = WeatherData.condition;
    precip.textContent = WeatherData.precip;
    humidity.textContent = WeatherData.humidity;

    temperature = WeatherData.temp;

    if (iterations === 0) {
        unitToggleBtn.addEventListener("click", () => {
            let celsiusConversion = `${(temperature - 32) * 0.5555555556}`;
            if (celsiusConversion.length > 4) {
                celsiusConversion = celsiusConversion.split("");
                celsiusConversion.splice(4, celsiusConversion.length);
                celsiusConversion = celsiusConversion.join("");
            }
            (unit.textContent === "Celsius")
                ? (currentUnit = "C", temp.textContent = `${celsiusConversion}°${currentUnit}`, unit.textContent = "Fahrenheit")
                : (currentUnit = "F", temp.textContent = `${temperature}°${currentUnit}`, unit.textContent = "Celsius");
        });
    }
    iterations++;
}

function changeBackground(data) {
    switch(data.condition) {
        case "Clear":
            return "white";
        case "Partially cloudy":
            return "lightgrey";
        case "Rain":
        case "Overcast":
            return "grey";
        default:
            return "grey";
    }
}

function changeLocation() {
    const form = document.querySelector("form");
    const location = document.querySelector("#location");
    const unit = document.querySelector("#unit");
    const head = document.querySelector("#dataHeader");

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        displayWeather(location.value, "F");
        head.textContent = "Loading...";
        unit.textContent = "Celsius";
        location.value = "";
    });
}

export function main() {
    displayWeather("New York City", "F");
    changeLocation();
}