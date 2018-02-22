import {combineReducers} from 'redux';

import visState from './vis-state';
import mapState from './map-state';
import mapStyle from './map-style';
import buildingData from './building-data';
import uiState from './ui-state';

import composers from './composers';

const combined = combineReducers({
  buildingData,
  visState,
  mapState,
  mapStyle,
  uiState
});

const composedReducer = (state, action) => {
  if (composers[action.type]) {
    return composers[action.type](state, action);
  }
  return combined(state, action);
};

export default composedReducer;

export const mapStateLens = (reduxState) => ({mapState: reduxState.mapState});
export const mapStyleLens = (reduxState) => ({mapStyle: reduxState.mapStyle});
export const visStateLens = (reduxState) => ({visState: reduxState.visState});
export const uiStateLens = (reduxState) => ({uiState: reduxState.uiState});
