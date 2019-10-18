import React, { useReducer } from 'react';
import axios from 'axios';
import StoreContext from './storeContext';
import storeReducer from './storeReducer';
import {
  GET_STORES,
  ADD_STORE,
  DELETE_STORE,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_STORE,
  FILTER_STORES,
  CLEAR_FILTER,
  STORE_ERROR
} from '../types';

const StoreState = props => {
  const initialState = {
    stores: null,
    current: null,
    filtered: null,
    error: null
  };

  const [state, dispatch] = useReducer(storeReducer, initialState);

  //Get stores
  const getStores = async () => {
    try {
      const res = await axios.get('/api/stores');

      dispatch({
        type: GET_STORES,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: STORE_ERROR,
        payload: err.response.msg
      });
    }
  };

  // Add store
  const addStore = async store => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.post('/api/stores', store, config);

      dispatch({
        type: ADD_STORE,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: STORE_ERROR,
        payload: err.response.msg
      });
    }
  };

  // Delete store
  const deleteStore = async id => {
    try {
      await axios.delete(`/api/stores/${id}`);

      dispatch({
        type: DELETE_STORE,
        payload: id
      });
    } catch (err) {
      dispatch({
        type: STORE_ERROR,
        payload: err.response.msg
      });
    }
  };

  // Update store
  const updateStore = async store => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.put(`/api/stores/${store._id}`, store, config);

      dispatch({
        type: UPDATE_STORE,
        payload: res.data
      });
      //getStores()
    } catch (err) {
      dispatch({
        type: STORE_ERROR,
        payload: err.response.msg
      });
    }
  };

  // Set current store
  const setCurrent = store => {
    dispatch({ type: SET_CURRENT, payload: store });
  };

  // Clear current store
  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT });
  };

  // Filter store
  const filterStores = text => {
    dispatch({ type: FILTER_STORES, payload: text });
  };

  // Clear filter
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };

  return (
    <StoreContext.Provider
      value={{
        stores: state.stores,
        current: state.current,
        filtered: state.filtered,
        error: state.error,
        addStore,
        deleteStore,
        setCurrent,
        clearCurrent,
        updateStore,
        filterStores,
        clearFilter,
        getStores
      }}
    >
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreState;
