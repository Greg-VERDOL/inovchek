import React, { useReducer } from 'react';
import axios from 'axios';
import AuthContext from './authContext';
import authReducer from './authReducer';
// import UserContext from './userContext';
// import userReducer from './userReducer';

import setAuthToken from '../../utils/setAuthToken';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  SETUP_SUCCESS,
  SETUP_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS
} from '../types';

const pwdToken = window.location.pathname.split('/').pop();

const AuthState = props => {
  const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  //LOAD USER
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    try {
      const res = await axios.get('/api/auth');

      dispatch({
        type: USER_LOADED,
        payload: res.data
      });
    } catch (err) {
      dispatch({ type: AUTH_ERROR });
    }
  };

  //REGISTER USER
  const register = async formData => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.post('/api/users', formData, config);

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response.data
      });
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response.data.msg
      });
    }
  };

  //SETUP USER
  const setup = async formData => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.post(
        `/api/users/setup/${pwdToken}`,
        formData,
        config
      );

      dispatch({
        type: SETUP_SUCCESS,
        payload: res.data
      });
      loadUser();
    } catch (err) {
      dispatch({
        type: SETUP_FAIL,
        payload: err.response.data
      });
      dispatch({
        type: SETUP_FAIL,
        payload: err.response.data.msg
      });
    }
  };
  //LOGIN USER
  const login = async formData => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.post('/api/auth', formData, config);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });
      loadUser();
    } catch (err) {
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response.data.msg
      });
    }
  };

  //LOGOUT
  const logout = async () => {
    await axios.get('/api/auth/logout');
    dispatch({
      type: LOGOUT
    });
  };

  // //LOGOUT
  // const logout = async () => {
  //   const res = await axios.get('/api/auth/logout');
  //   console.log('logout', res);
  //   try {
  //     dispatch({
  //       type: LOGOUT,
  //       payload: res.data
  //     });
  //   } catch (err) {
  //     dispatch({
  //       type: LOGOUT_FAIL,
  //       payload: err.response.data.msg
  //     });
  //   }
  // };

  //CLEAR ERRORS
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        loadUser,
        register,
        login,
        logout,
        clearErrors,
        setup
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
