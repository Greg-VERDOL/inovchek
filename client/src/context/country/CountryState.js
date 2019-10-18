import React, { useReducer } from 'react';
import axios from 'axios';
import CountryContext from './countryContext';
import countryReducer from './countryReducer';
import {
  GET_COUNTRIES,
  ADD_COUNTRY,
  DELETE_COUNTRY,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_COUNTRY,
  FILTER_COUNTRIES,
  CLEAR_FILTER,
  COUNTRY_ERROR
} from '../types';

const CountryState = props => {
  const initialState = {
    countries: null,
    current: null,
    filtered: null,
    error: null
  };

  const [state, dispatch] = useReducer(countryReducer, initialState);

  //Get countries
  const getCountries = async () => {
    try {
      const res = await axios.get('/api/countries');

      dispatch({
        type: GET_COUNTRIES,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: COUNTRY_ERROR,
        payload: err.response.msg
      });
    }
  };

  // Add country
  const addCountry = async country => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.post('/api/countries', country, config);

      dispatch({
        type: ADD_COUNTRY,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: COUNTRY_ERROR,
        payload: err.response.msg
      });
    }
  };

  // Delete country
  const deleteCountry = async id => {
    try {
      await axios.delete(`/api/countries/${id}`);

      dispatch({
        type: DELETE_COUNTRY,
        payload: id
      });
    } catch (err) {
      dispatch({
        type: COUNTRY_ERROR,
        payload: err.response.msg
      });
    }
  };

  // Update country
  const updateCountry = async country => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.put(
        `/api/countries/${country._id}`,
        country,
        config
      );

      dispatch({
        type: UPDATE_COUNTRY,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: COUNTRY_ERROR,
        payload: err.response.msg
      });
    }
  };

  // Set current country
  const setCurrent = country => {
    dispatch({ type: SET_CURRENT, payload: country });
  };

  // Clear current country
  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT });
  };

  // Filter country
  const filterCountries = text => {
    dispatch({ type: FILTER_COUNTRIES, payload: text });
  };

  // Clear filter
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };

  return (
    <CountryContext.Provider
      value={{
        countries: state.countries,
        current: state.current,
        filtered: state.filtered,
        error: state.error,
        addCountry,
        deleteCountry,
        setCurrent,
        clearCurrent,
        updateCountry,
        filterCountries,
        clearFilter,
        getCountries
      }}
    >
      {props.children}
    </CountryContext.Provider>
  );
};

export default CountryState;
