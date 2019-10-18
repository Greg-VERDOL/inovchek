import React, { useReducer } from 'react';
import axios from 'axios';
import RegionContext from './regionContext';
import regionReducer from './regionReducer';
import {
  GET_REGIONS,
  ADD_REGION,
  DELETE_REGION,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_REGION,
  FILTER_REGIONS,
  CLEAR_FILTER,
  REGION_ERROR
} from '../types';

const RegionState = props => {
  const initialState = {
    regions: null,
    current: null,
    filtered: null,
    error: null
  };

  const [state, dispatch] = useReducer(regionReducer, initialState);

  //Get regions
  const getRegions = async () => {
    try {
      const res = await axios.get('/api/regions');

      dispatch({
        type: GET_REGIONS,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: REGION_ERROR,
        payload: err.response.msg
      });
    }
  };

  // Add region
  const addRegion = async region => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.post('/api/regions', region, config);

      dispatch({
        type: ADD_REGION,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: REGION_ERROR,
        payload: err.response.msg
      });
    }
  };

  // Delete region
  const deleteRegion = async id => {
    try {
      await axios.delete(`/api/regions/${id}`);

      dispatch({
        type: DELETE_REGION,
        payload: id
      });
    } catch (err) {
      dispatch({
        type: REGION_ERROR,
        payload: err.response.msg
      });
    }
  };

  // Update region
  const updateRegion = async region => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.put(`/api/regions/${region._id}`, region, config);

      dispatch({
        type: UPDATE_REGION,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: REGION_ERROR,
        payload: err.response.msg
      });
    }
  };

  // Set current region
  const setCurrent = region => {
    dispatch({ type: SET_CURRENT, payload: region });
  };

  // Clear current region
  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT });
  };

  // Filter region
  const filterRegions = text => {
    dispatch({ type: FILTER_REGIONS, payload: text });
  };

  // Clear filter
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };

  return (
    <RegionContext.Provider
      value={{
        regions: state.regions,
        current: state.current,
        filtered: state.filtered,
        error: state.error,
        addRegion,
        deleteRegion,
        setCurrent,
        clearCurrent,
        updateRegion,
        filterRegions,
        clearFilter,
        getRegions
      }}
    >
      {props.children}
    </RegionContext.Provider>
  );
};

export default RegionState;
