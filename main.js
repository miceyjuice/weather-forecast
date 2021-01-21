class HandleAPI {
  constructor() {}

  async getData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  async returnWeatherForecastFromAPI(cityName) {
    return await this.getData(
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
        cityName +
        "&appid=7d2502ee1821fc0c297b265ffbffa853&units=metric"
    );
  }

  async returnCurrentWeatherFromAPI(cityName) {
    return await this.getData(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        cityName +
        "&appid=7d2502ee1821fc0c297b265ffbffa853&units=metric"
    );
  }
}

class LS {
  constructor() {
    this.cities = [];
    this.keys = Object.keys(localStorage);
    this.i = this.keys.length;
  }

  addToLocalStorage(cityName, data) {
    localStorage.setItem(cityName, data);
  }

  getCitiesFromLS() {
    while (this.i--) {
      this.cities.push(JSON.parse(localStorage.getItem(this.keys[this.i])));
    }
    return this.cities;
  }
}

class UIContent {
  constructor() {
    this.cityNames = !localStorage.getItem("cities")
      ? []
      : JSON.parse(localStorage.getItem("cities"));

    this.api = new HandleAPI();
    this.ls = new LS();

    this.init();
  }

  init() {
    this.getDataFromInput();
    this.createWeatherBoard();
  }

  timeStampToFullTime(timezone) {
    return new Date(
      Date.now() + timezone * 1000 - 3600000
    ).toLocaleTimeString();
  }

  getDataFromInput() {
    const submitBtn = document.querySelector(".search__input__btn");

    submitBtn.addEventListener("click", async () => {
      const cityInput = document.querySelector(".search__input input").value;

      if (cityInput == "") alert("Input can't be empty!");
      else {
        let currentWeather = await this.api.returnCurrentWeatherFromAPI(
          cityInput
        );
        let weatherForecast = await this.api.returnWeatherForecastFromAPI(
          cityInput
        );
        if (weatherForecast.cod == 404) alert("There's no such city!");
        const fullWeatherForecast = weatherForecast;
        fullWeatherForecast.current = {
          temp: currentWeather.main.temp,
          time: currentWeather.dt,
          timezone: currentWeather.timezone,
          type: currentWeather.weather[0].main,
          humidity: currentWeather.main.humidity,
        };
        this.ls.addToLocalStorage(
          cityInput,
          JSON.stringify(fullWeatherForecast)
        );
        location.reload();
      }
    });
  }

  createWeatherBoard() {
    const board = document.querySelector(".cityBoard");
    const weathers = this.ls.getCitiesFromLS();

    for (let i = 0; i < weathers.length; i++) {
      board.appendChild(this.createWeatherBlock(weathers[i]));
    }
  }

  createWeatherBlock(data) {
    const divBlock = document.createElement("div");
    divBlock.classList.add("weatherBlock");

    let content = `
        <div class="weatherBlock__topInfo">
        <div class="weatherBlock__topInfo__left">
            <div class="weatherBlock__topInfo__left__temperature">
                <h3>${Math.round(
                  data.current.temp
                )}<sup class="degree">°</sup></h3>
            </div>
            <div class="weatherBlock__topInfo__left__city">
                <div class="weatherBlock__topInfo__left__city__img"></div>
                <h4>${data.city.name}</h4>
                <p>
                  ${this.timeStampToFullTime(data.current.timezone)}
                </p>
            </div>
            </div>
            <div class="weatherBlock__topInfo__right">
                <img class="weatherBlock__topInfo__right__img" src="./assets/${
                  data.current.type
                }.png"></img>
            </div>
        </div>
        <div class="weatherBlock__additionalInfo">
            <div class="weatherBlock__additionalInfo__name">
                <p class="weatherBlock__additionalInfo__name__text">
                    Humidity
                </p>
            </div>
            <div class="weatherBlock__additionalInfo__value">
                <p class="weatherBlock__additionalInfo__value__text">
                  ${data.current.humidity}%
                </p>
            </div>
        </div>
        <div class="weatherBlock__hourlyForecast">
            <div class="weatherBlock__hourlyForecast__hour">
                <p class="weatherBlock__hourlyForecast__hour__text">
                  ${data.list[0].dt_txt}
                </p>
            </div>
            <div class="weatherBlock__hourlyForecast__value">
                <p class="weatherBlock__hourlyForecast__value__text">
                    ${Math.round(data.list[0].main.temp)}°
                </p>
            </div>
            <div class="weatherBlock__hourlyForecast__hour">
                <p class="weatherBlock__hourlyForecast__hour__text">
                ${data.list[1].dt_txt}
                </p>
            </div>
            <div class="weatherBlock__hourlyForecast__value">
                <p class="weatherBlock__hourlyForecast__value__text">
                ${Math.round(data.list[1].main.temp)}°
                </p>
            </div>
            <div class="weatherBlock__hourlyForecast__hour">
                <p class="weatherBlock__hourlyForecast__hour__text">
                ${data.list[2].dt_txt}
                </p>
            </div>
            <div class="weatherBlock__hourlyForecast__value">
                <p class="weatherBlock__hourlyForecast__value__text">
                ${Math.round(data.list[2].main.temp)}°
                </p>
            </div>
            <div class="weatherBlock__hourlyForecast__hour">
                <p class="weatherBlock__hourlyForecast__hour__text">
                ${data.list[3].dt_txt}
                </p>
            </div>
            <div class="weatherBlock__hourlyForecast__value">
                <p class="weatherBlock__hourlyForecast__value__text">
                ${Math.round(data.list[3].main.temp)}°
                </p>
            </div>
            <div class="weatherBlock__hourlyForecast__hour">
                <p class="weatherBlock__hourlyForecast__hour__text">
                ${data.list[4].dt_txt}
                </p>
            </div>
            <div class="weatherBlock__hourlyForecast__value">
                <p class="weatherBlock__hourlyForecast__value__text">
                ${Math.round(data.list[4].main.temp)}°
                </p>
            </div>
        </div>
        `;
    divBlock.innerHTML = content;

    return divBlock;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new UIContent();
  setInterval(() => {
    new UIContent();
    window.location.reload();
  }, 120 * 1000);
});
