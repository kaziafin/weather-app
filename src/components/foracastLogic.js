// useForecastLogic.js
import { useState, useEffect } from "react";
import axios from "axios";
import apiKeys from "../API/apiKeys";

const useForecastLogic = () => {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [weather, setWeather] = useState({});

  const search = (city) => {
    axios
      .get(
        `${apiKeys.base}weather?q=${
          city != "[object Object]" ? city : query
        }&units=metric&APPID=${apiKeys.key}`
      )
      .then((response) => {
        setWeather(response.data);
        setQuery("");
      })
      .catch(function (error) {
        console.log(error);
        setWeather("");
        setQuery("");
        setError({ message: "Not Found", query: query });
      });
  };
  function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    } // add zero in front of numbers < 10
    return i;
  }

  
  useEffect(() => {
    search("Mumbai");
  }, []);
  return {
    query,
    setQuery,
    error,
    weather,
    search,
  };
};

export default useForecastLogic;
