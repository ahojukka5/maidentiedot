import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {
  Button,
  Container,
  Divider,
  Grid,
  Input,
  Label,
  Header,
  Message,
  Table,
} from 'semantic-ui-react';

const Weather = ({ city }) => {
  const [weatherData, setWeatherData] = useState(-1);
  const accessKey = '66fc4921f8cfa66fdbdbb69478498de0';
  const url = `http://api.weatherstack.com/current?access_key=${accessKey}&query=${city}`;

  useEffect(() => {
    axios.get(url).then((response) => {
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

const Country = (props) => {
  const { name } = props.country;
  const { setCountryFilter } = props;
  return (
    <Table.Row>
      <Table.Cell>{name}</Table.Cell>
      <Table.Cell>
        <Button onClick={() => setCountryFilter(name)}>show</Button>
      </Table.Cell>
    </Table.Row>
  );
};

const CountryDetail = (props) => {
  const { name, capital, population, languages, flag } = props.country;

  const languageRows = () => {
    return languages.map((language) => {
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

const Countries = (props) => {
  const { countries, countryFilter, setCountryFilter } = props;

  if (countries.length === 0) {
    return <p>Loading ...</p>;
  }

  let filteredCountries = countries;
  if (countryFilter === '') {
    return null;
  } else {
    filteredCountries = countries.filter((country) =>
      country.name.toLowerCase().includes(countryFilter.toLowerCase())
    );
  }

  if (filteredCountries.length > 10) {
    return <Message>Over 10 matches not shown</Message>;
  }

  if (filteredCountries.length > 1) {
    const countries = filteredCountries.map((country) => (
      <Country
        key={country.name}
        country={country}
        setCountryFilter={setCountryFilter}
      />
    ));
    return (
      <Table basic="very" cell unstackable compact>
        <Table.Body>{countries}</Table.Body>
      </Table>
    );
  }

  if (filteredCountries.length === 0) {
    return <p>No matches!</p>;
  }

  // Have exactly 1 country now
  // assert(filteredCountries.length === 1);

  return <CountryDetail country={filteredCountries[0]} />;
};

const App = (props) => {
  const [countries, setCountries] = useState([]);
  const [countryFilter, setCountryFilter] = useState('sw');

  const onCountryFilterChange = (event) => {
    setCountryFilter(event.target.value);
  };

  useEffect(() => {
    axios.get('https://restcountries.eu/rest/v2/all').then((response) => {
      setCountries(response.data);
    });
  }, []);

  return (
    <Container text style={{ paddingTop: '1em', paddingBottom: '1em' }}>
      <Grid columns={1}>
        <Grid.Column>
          <Header as="h1" textAlign="center">
            <Header.Content>Maiden tiedot</Header.Content>
          </Header>
          <Divider />
          <Input
            style={{ width: '100%' }}
            label="Country name:"
            focus
            placeholder="Search..."
            onChange={onCountryFilterChange}
            value={countryFilter}
          />
          <Divider />
          <Countries
            countries={countries}
            countryFilter={countryFilter}
            setCountryFilter={setCountryFilter}
          />
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default App;
