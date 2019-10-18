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

export default (state, action) => {
  switch (action.type) {
    case GET_REGIONS: {
      return {
        ...state,
        regions: action.payload,
        loading: false
      };
    }
    case ADD_REGION:
      return {
        ...state,
        regions: [...state.regions, action.payload],
        loading: false
      };
    case UPDATE_REGION:
      return {
        ...state,
        regions: state.regions.map(region =>
          region._id === action.payload._id ? action.payload : region
        ),
        loading: false
      };
    case DELETE_REGION:
      return {
        ...state,
        regions: state.regions.filter(region => region._id !== action.payload),
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
    case FILTER_REGIONS:
      return {
        ...state,
        filtered: state.regions.filter(region => {
          const regex = new RegExp(`${action.payload}`, 'gi');
          return region.name.match(regex);
        })
      };
    case CLEAR_FILTER:
      return {
        ...state,
        filtered: null
      };
    case REGION_ERROR:
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
};
