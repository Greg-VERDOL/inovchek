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

export default (state, action) => {
  switch (action.type) {
    case GET_STORES: {
      return {
        ...state,
        stores: action.payload,
        loading: false
      };
    }
    case ADD_STORE:
      return {
        ...state,
        stores: [...state.stores, action.payload],
        loading: false
      };
    case UPDATE_STORE:
      return {
        ...state,
        stores: state.stores.map(store =>
          store._id === action.payload._id ? action.payload : store
        ),
        loading: false
      };
    case DELETE_STORE:
      return {
        ...state,
        stores: state.stores.filter(store => store._id !== action.payload),
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
    case FILTER_STORES:
      return {
        ...state,
        filtered: state.stores.filter(store => {
          const regex = new RegExp(`${action.payload}`, 'gi');
          return store.name.match(regex) || store.address.match(regex);
        })
      };
    case CLEAR_FILTER:
      return {
        ...state,
        filtered: null
      };
    case STORE_ERROR:
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
};
