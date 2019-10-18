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

export default (state, action) => {
  switch (action.type) {
    case GET_AREAS: {
      return {
        ...state,
        areas: action.payload,
        loading: false
      };
    }
    case ADD_AREA:
      return {
        ...state,
        areas: [...state.areas, action.payload],
        loading: false
      };
    case UPDATE_AREA:
      return {
        ...state,
        areas: state.areas.map(area =>
          area._id === action.payload._id ? action.payload : area
        ),
        loading: false
      };
    case DELETE_AREA:
      return {
        ...state,
        areas: state.areas.filter(area => area._id !== action.payload),
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
    case FILTER_AREAS:
      return {
        ...state,
        filtered: state.areas.filter(area => {
          const regex = new RegExp(`${action.payload}`, 'gi');
          return area.name.match(regex);
        })
      };
    case CLEAR_FILTER:
      return {
        ...state,
        filtered: null
      };
    case AREA_ERROR:
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
};
