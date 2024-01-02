import React, { useState, useEffect } from "react";
import Clock from "react-live-clock";
import loader from "../images/WeatherIcons.gif";
import ReactAnimatedWeather from "react-animated-weather";
import apiKeys from "../API/apiKeys";
import Forcast from "./forcast";
import { dateBuilder,defaults } from "../weatherUtils";

const Weather = () => {
  const [weatherData, setWeatherData] = useState({
    lat: undefined,
    lon: undefined,
    errorMessage: undefined,
    temperatureC: undefined,
    temperatureF: undefined,
    city: undefined,
    country: undefined,
    humidity: undefined,
    description: undefined,
    icon: "CLEAR_DAY",
    sunrise: undefined,
    sunset: undefined,
    errorMsg: undefined,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      getPosition()
        .then((position) => {
          getWeather(position.coords.latitude, position.coords.longitude);
        })
        .catch((err) => {
          getWeather(28.67, 77.22);
          alert(
            "You have disabled location service. Allow 'This APP' to access your location. Your current location will be used for calculating Real time weather."
          );
        });
    } else {
      alert("Geolocation not available");
    }

    const timerID = setInterval(() => {
      getWeather(weatherData.lat, weatherData.lon);
    }, 600000);

    return () => clearInterval(timerID);
  }, [weatherData.lat, weatherData.lon]);

  const getPosition = (options) => {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  const getWeather = async (lat, lon) => {
    const api_call = await fetch(
      `${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`
    );
    const data = await api_call.json();

    const newWeatherData = {
      lat: lat,
      lon: lon,
      city: data.name,
      temperatureC: Math.round(data.main.temp),
      temperatureF: Math.round(data.main.temp * 1.8 + 32),
      humidity: data.main.humidity,
      main: data.weather[0].main,
      country: data.sys.country,
    };

    switch (newWeatherData.main) {
      case "Haze":
        newWeatherData.icon = "CLEAR_DAY";
        break;
      case "Clouds":
        newWeatherData.icon = "CLOUDY";
        break;
      case "Rain":
        newWeatherData.icon = "RAIN";
        break;
      case "Snow":
        newWeatherData.icon = "SNOW";
        break;
      case "Dust":
        newWeatherData.icon = "WIND";
        break;
      case "Drizzle":
        newWeatherData.icon = "SLEET";
        break;
      case "Fog":
      case "Smoke":
        newWeatherData.icon = "FOG";
        break;
      case "Tornado":
        newWeatherData.icon = "WIND";
        break;
      default:
        newWeatherData.icon = "CLEAR_DAY";
    }

    setWeatherData(newWeatherData);
  };

  if (weatherData.temperatureC) {
    return (
      <React.Fragment>
        <div className="city">
          <div className="title">
            <h2>{weatherData.city}</h2>
            <h3>{weatherData.country}</h3>
          </div>
          <div className="mb-icon">
            {" "}
            <ReactAnimatedWeather
              icon={weatherData.icon}
              color={defaults.color}
              size={defaults.size}
              animate={defaults.animate}
            />
            <p>{weatherData.main}</p>
          </div>
          <div className="date-time">
            <div className="dmy">
              <div id="txt"></div>
              <div className="current-time">
                <Clock format="HH:mm:ss" interval={1000} ticking={true} />
              </div>
              <div className="current-date">{dateBuilder(new Date())}</div>
            </div>
            <div className="temperature">
              <p>
                {weatherData.temperatureC}°<span>C</span>
              </p>
            </div>
          </div>
        </div>
        <Forcast icon={weatherData.icon} weather={weatherData.main} />
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <img src={loader} style={{ width: "50%", WebkitUserDrag: "none" }} />
        <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
          Detecting your location
        </h3>
        <h3 style={{ color: "white", marginTop: "10px" }}>
          Your current location wil be displayed on the App <br></br> & used
          for calculating Real time weather.
        </h3>
      </React.Fragment>
    );
  }
};

export default Weather;
