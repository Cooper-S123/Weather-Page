function WeatherData(time, condition, temp, precip, humidity) {
    this.time = time;
    this.condition = condition;
    this.temp = temp;
    this.precip = precip;
    this.humidity = humidity;
}

async function getWeatherData(location) {
    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=WYKE9JDDZX2M8G3QCKWW9LNEP`, { mode: 'cors' });
        const data = await response.json();
        const weather = new WeatherData(data.currentConditions.datetime,
            data.currentConditions.conditions,
            data.currentConditions.temp,
            data.currentConditions.precip,
            data.currentConditions.humidity
        )
        return weather;
    } catch (err) {
        console.log(err);
    }
}

let iterations = 0;
async function displayWeather(location, currentUnit) {
    const WeatherData = await getWeatherData(location);

    const head = document.querySelector("#dataHeader");
    const time = document.querySelector("#Time");
    const temp = document.querySelector("#Temp");
    const condition = document.querySelector("#Condition");
    const precip = document.querySelector("#Precip");
    const humidity = document.querySelector("#Humidity");
    const unitToggleBtn = document.querySelector("#unitToggle");
    const unit = document.querySelector("#unit");

    head.textContent = `Current weather in ${location}:`;
    time.textContent = WeatherData.time;
    temp.textContent = `${WeatherData.temp}°${currentUnit}`;
    condition.textContent = WeatherData.condition;
    precip.textContent = WeatherData.precip;
    humidity.textContent = WeatherData.humidity;

    if (iterations === 0) {
        unitToggleBtn.addEventListener("click", () => {
            let celsiusConversion = `${(WeatherData.temp - 32) * 0.5555555556}`;
            if (celsiusConversion.length > 4) {
                celsiusConversion = celsiusConversion.split("");
                celsiusConversion.splice(4, celsiusConversion.length);
                celsiusConversion = celsiusConversion.join("");
            }
            (unit.textContent === "Celsius")
                ? (currentUnit = "C", temp.textContent = `${celsiusConversion}°${currentUnit}`, unit.textContent = "Fahrenheit")
                : (currentUnit = "F", temp.textContent = `${WeatherData.temp}°${currentUnit}`, unit.textContent = "Celsius");
        });
    }
    iterations++;
}

function changeLocation() {
    const form = document.querySelector("form");
    const location = document.querySelector("#location");
    const unit = document.querySelector("#unit");

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        displayWeather(location.value, "F");
        unit.textContent = "Celsius";
        location.value = "";
    });
}

export function main() {
    displayWeather("Beijing", "F");
    changeLocation();
}