import createSecureStore from "redux-persist-expo-securestore";
import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import reducers from "./reducers";
import { createLogger } from 'redux-logger';

// Secure storage
const storage = createSecureStore();

const config = {
    key: "root",
    storage
};

const persistedReducer = persistReducer(config, reducers);

const store = createStore(
    persistedReducer,
    applyMiddleware(createLogger())
);
const persistor = persistStore(store);

export { store, persistor }
