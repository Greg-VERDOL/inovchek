import React, { useReducer } from 'react';
import axios from 'axios';
import UserContext from './userContext';
import userReducer from './userReducer';
import {
  GET_USERS,
  ADD_USER,
  DELETE_USER,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_USER,
  FILTER_USERS,
  CLEAR_FILTER,
  USER_ERROR,
  CLEAR_USERS
} from '../types';

const UserState = props => {
  const initialState = {
    users: null,
    current: null,
    filtered: null,
    error: null
  };

  const [state, dispatch] = useReducer(userReducer, initialState);

  //Get users
  const getUsers = async () => {
    try {
      const res = await axios.get('/api/users');

      dispatch({
        type: GET_USERS,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: USER_ERROR,
        payload: err
        //payload: err.response.msg
      });
    }
  };

  // Add user
  const addUser = async user => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.post('/api/users', user, config);

      dispatch({
        type: ADD_USER,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: USER_ERROR,
        payload: err.response.msg
      });
    }
  };

  // Delete user
  const deleteUser = async id => {
    try {
      await axios.delete(`/api/users/${id}`);

      dispatch({
        type: DELETE_USER,
        payload: id
      });
    } catch (err) {
      dispatch({
        type: USER_ERROR,
        payload: err.response.msg
      });
    }
  };

  // Update user
  const updateUser = async user => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.put(`/api/users/${user._id}`, user, config);

      dispatch({
        type: UPDATE_USER,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: USER_ERROR,
        payload: err.response.msg
      });
    }
  };

  //Clear User
  const clearUsers = () => {
    try {
      dispatch({
        type: CLEAR_USERS
      });
    } catch (err) {
      dispatch({
        type: USER_ERROR,
        payload: err.response.msg
      });
    }
  };

  // Update user as Admin
  const updateUserAsAdmin = async user => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.put(`/api/users/admin/${user._id}`, user, config);

      dispatch({
        type: UPDATE_USER,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: USER_ERROR,
        payload: err.response.msg
      });
    }
  };

  // Set current user
  const setCurrent = (users, id) => {
    let res = users
      .filter(user => user._id === id)
      .reduce((acc, res) => acc + res);
    dispatch({ type: SET_CURRENT, payload: res });
  };

  // Clear current user
  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT });
  };

  // Filter user
  const filterUsers = text => {
    dispatch({ type: FILTER_USERS, payload: text });
  };

  // Clear filter
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };

  return (
    <UserContext.Provider
      value={{
        users: state.users,
        current: state.current,
        filtered: state.filtered,
        error: state.error,
        addUser,
        deleteUser,
        setCurrent,
        clearCurrent,
        updateUser,
        filterUsers,
        clearFilter,
        getUsers,
        updateUserAsAdmin,
        clearUsers
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;
