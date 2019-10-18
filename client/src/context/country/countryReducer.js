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

export default (state, action) => {
  switch (action.type) {
    case GET_COUNTRIES: {
      return {
        ...state,
        countries: action.payload,
        loading: false
      };
    }
    case ADD_COUNTRY:
      return {
        ...state,
        countries: [...state.countries, action.payload],
        loading: false
      };
    case UPDATE_COUNTRY:
      return {
        ...state,
        countries: state.countries.map(country =>
          country._id === action.payload._id ? action.payload : country
        ),
        loading: false
      };
    case DELETE_COUNTRY:
      return {
        ...state,
        countries: state.countries.filter(
          country => country._id !== action.payload
        ),
        loading: false
      };
    case SET_CURRENT:
      return {
        ...state,
        current: action.payload
      };
    case CLEAR_CURRENT:
      return {
        ...state,
        current: null
      };
    case FILTER_COUNTRIES:
      return {
        ...state,
        filtered: state.countries.filter(country => {
          const regex = new RegExp(`${action.payload}`, 'gi');
          return country.name.match(regex);
          //return country.name.match(regex) || store.address.match(regex); a reflechir
        })
      };
    case CLEAR_FILTER:
      return {
        ...state,
        filtered: null
      };
    case COUNTRY_ERROR:
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
};
