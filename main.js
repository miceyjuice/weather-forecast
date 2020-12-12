const cityNames = !localStorage.getItem("cities")
  ? []
  : JSON.parse(localStorage.getItem("cities"));

const timeStampToFullTime = (timeStamp) => {
  const fullDate = new Date(timeStamp * 1000);
  const hour = fullDate.getHours();
  const minute = fullDate.getMinutes();
  const second = fullDate.getSeconds();

  return `${hour}:${minute}:${second}`;
};

const convertKelvinToCelsius = (temp) => Math.round(temp - 273.15);

const getData = (url) => {
  return new Promise((resolve) => {
    const myRequest = new XMLHttpRequest();
    myRequest.open("GET", url, false);
    myRequest.send(null);
    resolve(myRequest.responseText);
  });
};

const addToLocalStorage = (cityName) => {
  localStorage.setItem("cities", cityName);
};

// api.openweathermap.org/data/2.5/forecast?q=
// &appid=7d2502ee1821fc0c297b265ffbffa853

const createWeatherBlock = (data) => {
  const divBlock = document.createElement("div");
  divBlock.classList.add("weatherBlock");

  let content = `
    <div class="weatherBlock__topInfo">
    <div class="weatherBlock__topInfo__left">
        <div class="weatherBlock__topInfo__left__temperature">
            <h3></h3>
        </div>
        <div class="weatherBlock__topInfo__left__city">
            <div class="weatherBlock__topInfo__left__city__img"></div>
            <h4></h4>
        </div>
        </div>
        <div class="weatherBlock__topInfo__right">
            <div class="weatherBlock__topInfo__right__img"></div>
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

            </p>
        </div>
    </div>
    <div class="weatherBlock__hourlyForecast">
        <div class="weatherBlock__hourlyForecast__hour">
            <p class="weatherBlock__hourlyForecast__hour__text">

            </p>
        </div>
        <div class="weatherBlock__hourlyForecast__value">
            <p class="weatherBlock__hourlyForecast__value__text">
                
            </p>
        </div>
        <div class="weatherBlock__hourlyForecast__hour">
            <p class="weatherBlock__hourlyForecast__hour__text">

            </p>
        </div>
        <div class="weatherBlock__hourlyForecast__value">
            <p class="weatherBlock__hourlyForecast__value__text">
                
            </p>
        </div>
        <div class="weatherBlock__hourlyForecast__hour">
            <p class="weatherBlock__hourlyForecast__hour__text">

            </p>
        </div>
        <div class="weatherBlock__hourlyForecast__value">
            <p class="weatherBlock__hourlyForecast__value__text">
                
            </p>
        </div>
        <div class="weatherBlock__hourlyForecast__hour">
            <p class="weatherBlock__hourlyForecast__hour__text">

            </p>
        </div>
        <div class="weatherBlock__hourlyForecast__value">
            <p class="weatherBlock__hourlyForecast__value__text">
                
            </p>
        </div>
        <div class="weatherBlock__hourlyForecast__hour">
            <p class="weatherBlock__hourlyForecast__hour__text">

            </p>
        </div>
        <div class="weatherBlock__hourlyForecast__value">
            <p class="weatherBlock__hourlyForecast__value__text">
                
            </p>
        </div>
    </div>
    `;
  divBlock.innerHTML = content;

  return divBlock;
};

const createWeatherBoard = () => {
  const board = document.querySelector(".cityBoard");

  for (let i = 0; i < cityNames.length; i++) {
    board.appendChild(createWeatherBlock(cityNames[i]));
  }
};

const getCurrentWeather = () => {
  const submitBtn = document.querySelector(".search__input__btn");

  submitBtn.addEventListener("click", () => {
    const cityInput = document.querySelector(".search__input input").value;

    if (cityInput == "") alert("Input can't be empty!");
    else {
      getData(
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
          cityInput +
          "&appid=7d2502ee1821fc0c297b265ffbffa853&units=metric"
      ).then((data) => {
        const jsonObj = JSON.parse(data);
        if (jsonObj.cod == 404) alert("There's no such city!");
        else {
          cityNames.push(cityInput);
          addToLocalStorage(JSON.stringify(cityNames));
          console.log(jsonObj);
        }
      });

      //console.log(timeStampToFullTime(jsonObj.dt));
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  getCurrentWeather();
});
