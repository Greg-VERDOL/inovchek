import React, { useReducer } from 'react';
import axios from 'axios';
import CategoryContext from './categoryContext';
import categoryReducer from './categoryReducer';
import {
  GET_CATEGORIES,
  ADD_CATEGORY,
  DELETE_CATEGORY,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_CATEGORY,
  FILTER_CATEGORIES,
  CLEAR_FILTER,
  CATEGORY_ERROR
} from '../types';

const CategoryState = props => {
  const initialState = {
    categories: null,
    current: null,
    filtered: null,
    error: null
  };

  const [state, dispatch] = useReducer(categoryReducer, initialState);

  //Get categories
  const getCategories = async () => {
    try {
      const res = await axios.get('/api/categories');

      dispatch({
        type: GET_CATEGORIES,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: CATEGORY_ERROR,
        payload: err.response.msg
      });
    }
  };

  // Add category
  const addCategory = async category => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.post('/api/categories', category, config);

      dispatch({
        type: ADD_CATEGORY,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: CATEGORY_ERROR,
        payload: err.response.msg
      });
    }
  };

  // Delete category
  const deleteCategory = async id => {
    try {
      await axios.delete(`/api/categories/${id}`);

      dispatch({
        type: DELETE_CATEGORY,
        payload: id
      });
    } catch (err) {
      dispatch({
        type: CATEGORY_ERROR,
        payload: err.response.msg
      });
    }
  };

  // Update category
  const updateCategory = async category => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.put(
        `/api/categories/${category._id}`,
        category,
        config
      );

      dispatch({
        type: UPDATE_CATEGORY,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: CATEGORY_ERROR,
        payload: err.response.msg
      });
    }
  };

  // Set current category
  const setCurrent = category => {
    dispatch({ type: SET_CURRENT, payload: category });
  };

  // Clear current category
  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT });
  };

  // Filter category
  const filterCategories = text => {
    dispatch({ type: FILTER_CATEGORIES, payload: text });
  };

  // Clear filter
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };

  return (
    <CategoryContext.Provider
      value={{
        categories: state.categories,
        current: state.current,
        filtered: state.filtered,
        error: state.error,
        addCategory,
        deleteCategory,
        setCurrent,
        clearCurrent,
        updateCategory,
        filterCategories,
        clearFilter,
        getCategories
      }}
    >
      {props.children}
    </CategoryContext.Provider>
  );
};

export default CategoryState;
