import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './reducer';

let user = {
  firstName: 'Daniel',
  lastName: 'Pencak',
  email: 'test@test.com',
  id: '6c57fb6a-3ec6-4c67-a205-8323952c8293',
  gender: 'Male',
  age: 31,
  weight: 225,
  maxHeartRate: 60,
};

export const initialState = {
  user,
};

const persistConfig = { key: 'root', storage, stateReconciler: autoMergeLevel2, whitelist: ['user'] };
console.log(initialState);
const persistedReducer = persistReducer(persistConfig, reducer);
export const store = createStore(persistedReducer, initialState, composeWithDevTools());
export const persistor = persistStore(store);
console.log(store.getState());
