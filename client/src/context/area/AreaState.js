import React, { useReducer } from 'react';
import axios from 'axios';
import AreaContext from './areaContext';
import areaReducer from './areaReducer';
import {
  GET_AREAS,
  ADD_AREA,
  DELETE_AREA,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_AREA,
  FILTER_AREAS,
  CLEAR_FILTER,
  AREA_ERROR
} from '../types';

const AreaState = props => {
  const initialState = {
    areas: null,
    current: null,
    filtered: null,
    error: null
  };

  const [state, dispatch] = useReducer(areaReducer, initialState);

  //Get areas
  const getAreas = async () => {
    try {
      const res = await axios.get('/api/areas');

      dispatch({
        type: GET_AREAS,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: AREA_ERROR,
        payload: err.response.msg
      });
    }
  };

  // Add area
  const addArea = async area => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.post('/api/areas', area, config);

      dispatch({
        type: ADD_AREA,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: AREA_ERROR,
        payload: err.response.msg
      });
    }
  };

  // Delete area
  const deleteArea = async id => {
    try {
      await axios.delete(`/api/areas/${id}`);

      dispatch({
        type: DELETE_AREA,
        payload: id
      });
    } catch (err) {
      dispatch({
        type: AREA_ERROR,
        payload: err.response.msg
      });
    }
  };

  // Update area
  const updateArea = async area => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.put(`/api/areas/${area._id}`, area, config);

      dispatch({
        type: UPDATE_AREA,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: AREA_ERROR,
        payload: err.response.msg
      });
    }
  };

  // Set current area
  const setCurrent = area => {
    dispatch({ type: SET_CURRENT, payload: area });
  };

  // Clear current area
  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT });
  };

  // Filter area
  const filterAreas = text => {
    dispatch({ type: FILTER_AREAS, payload: text });
  };

  // Clear filter
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };

  return (
    <AreaContext.Provider
      value={{
        areas: state.areas,
        current: state.current,
        filtered: state.filtered,
        error: state.error,
        addArea,
        deleteArea,
        setCurrent,
        clearCurrent,
        updateArea,
        filterAreas,
        clearFilter,
        getAreas
      }}
    >
      {props.children}
    </AreaContext.Provider>
  );
};

export default AreaState;
