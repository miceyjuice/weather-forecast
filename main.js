const cityNames = !localStorage.getItem("cities")
  ? []
  : JSON.parse(localStorage.getItem("cities"));

const timeStampToFullTime = (timeStamp, timezone) => {
  const fullDate = new Date((timeStamp + timezone) * 1000);
  const hour = fullDate.getHours();
  const minute = fullDate.getMinutes();
  const second = fullDate.getSeconds();

  return `${hour}:${minute}:${second}`;
};

const getData = (url) =>
  fetch(url)
    .then((response) => response.json())
    .then((data) => data);

const returnWeatherForecastFromAPI = async (cityName) =>
  await getData(
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
      cityName +
      "&appid=7d2502ee1821fc0c297b265ffbffa853&units=metric"
  );

const returnCurrentWeatherFromAPI = async (cityName) =>
  await getData(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&appid=7d2502ee1821fc0c297b265ffbffa853&units=metric"
  );

const addToLocalStorage = (cityName, data) =>
  localStorage.setItem(cityName, data);

// api.openweathermap.org/data/2.5/forecast?q=
// &appid=7d2502ee1821fc0c297b265ffbffa853

const createWeatherBlock = (data) => {
  console.log(data);
  const divBlock = document.createElement("div");
  divBlock.classList.add("weatherBlock");

  let content = `
    <div class="weatherBlock__topInfo">
    <div class="weatherBlock__topInfo__left">
        <div class="weatherBlock__topInfo__left__temperature">
            <h3>${Math.round(data.current.temp)}°</h3>
        </div>
        <div class="weatherBlock__topInfo__left__city">
            <div class="weatherBlock__topInfo__left__city__img"></div>
            <h4>${data.city.name}</h4>
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
};

const getCitiesFromLS = () => {
  let cities = [],
    keys = Object.keys(localStorage),
    i = keys.length;

  while (i--) {
    cities.push(JSON.parse(localStorage.getItem(keys[i])));
  }
  return cities;
};

const createWeatherBoard = () => {
  const board = document.querySelector(".cityBoard");
  const weathers = getCitiesFromLS();

  for (let i = 0; i < weathers.length; i++) {
    board.appendChild(createWeatherBlock(weathers[i]));
  }
};

const getDataFromInput = () => {
  const submitBtn = document.querySelector(".search__input__btn");

  submitBtn.addEventListener("click", async () => {
    const cityInput = document.querySelector(".search__input input").value;

    if (cityInput == "") alert("Input can't be empty!");
    else {
      let currentWeather = await returnCurrentWeatherFromAPI(cityInput);
      let weatherForecast = await returnWeatherForecastFromAPI(cityInput);
      if (weatherForecast.cod == 404) alert("There's no such city!");
      const fullWeatherForecast = weatherForecast;
      fullWeatherForecast.current = {
        temp: currentWeather.main.temp,
        time: currentWeather.dt,
        timezone: currentWeather.timezone,
        type: currentWeather.weather[0].main,
        humidity: currentWeather.main.humidity,
      };
      console.log(fullWeatherForecast);
      addToLocalStorage(cityInput, JSON.stringify(fullWeatherForecast));
      location.reload();
    }
  });
};
const init = () => {
  getDataFromInput();
  createWeatherBoard();
};

document.addEventListener("DOMContentLoaded", () => {
  init();
});
