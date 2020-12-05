import React, {useState, useEffect} from 'react';
import './App.css';
import axios from 'axios';

const Weather = ({city}) => {
  const [weatherData, setWeatherData] = useState(-1);
  const accessKey = '66fc4921f8cfa66fdbdbb69478498de0';
  const url = `http://api.weatherstack.com/current?access_key=${accessKey}&query=${city}`;

  useEffect(() => {
    axios.get(url).then(response => {
      setWeatherData(response.data.current);
    });
    // https://stackoverflow.com/questions/55840294/how-to-fix-missing-dependency-warning-when-using-useeffect-react-hook
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (weatherData === -1) {
    return <p>Loading weather data</p>;
  }

  return (
    <div>
      <h2>Weather in {city}</h2>
      <p>Temperature: {weatherData.temperature} Celsius</p>
      <img alt="icon" src={weatherData.weather_icons[0]} />
      <p>
        Wind: {weatherData.wind_speed} kph direction {weatherData.wind_dir}{' '}
      </p>
    </div>
  );
};

const Country = props => {
  const {name} = props.country;
  const {setCountryFilter} = props;
  return (
    <li>
      {name} <button onClick={() => setCountryFilter(name)}>show</button>
    </li>
  );
};

const CountryDetail = props => {
  const {name, capital, population, languages, flag} = props.country;

  const languageRows = () => {
    return languages.map(language => {
      return <li key={language.iso639_1}>{language.name}</li>;
    });
  };

  return (
    <div>
      <h1>{name}</h1>
      <p>Capital: {capital}</p>
      <p>Population: {population}</p>
      <h2>Languages</h2>
      <ul>{languageRows()}</ul>
      <img alt="flag" src={flag} width="150px" />
      <Weather city={capital} />
    </div>
  );
};

const Countries = props => {
  const {countries, countryFilter, setCountryFilter} = props;

  if (countries.length === 0) {
    return <p>Loading ...</p>;
  }

  let filteredCountries = countries;
  if (countryFilter !== '') {
    filteredCountries = countries.filter(country =>
      country.name.toLowerCase().includes(countryFilter.toLowerCase()),
    );
  }

  if (filteredCountries.length > 10) {
    return <p>Over 10 matches not shown</p>;
  }

  if (filteredCountries.length > 1) {
    return filteredCountries.map(country => (
      <Country
        key={country.name}
        country={country}
        setCountryFilter={setCountryFilter}
      />
    ));
  }

  if (filteredCountries.length === 0) {
    return <p>No matches!</p>;
  }

  // Have exactly 1 country now
  // assert(filteredCountries.length === 1);

  return <CountryDetail country={filteredCountries[0]} />;
};

const App = props => {
  const [countries, setCountries] = useState([]);
  const [countryFilter, setCountryFilter] = useState('sw');

  const onCountryFilterChange = event => {
    setCountryFilter(event.target.value);
  };

  useEffect(() => {
    axios.get('https://restcountries.eu/rest/v2/all').then(response => {
      setCountries(response.data);
    });
  }, []);

  return (
    <div>
      <p>
        find countries:
        <input onChange={onCountryFilterChange} value={countryFilter} />
      </p>
      <Countries
        countries={countries}
        countryFilter={countryFilter}
        setCountryFilter={setCountryFilter}
      />
    </div>
  );
};

export default App;
