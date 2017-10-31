"use strict"
//IMPORT REACT
import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";

//REACT ROUTER
import {Router, Route, IndexRoute, browserHistory} from "react-router";

import {applyMiddleware, createStore} from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";

import reducers from "./reducers/index";
import {postBooks, updateBooks, deleteBooks} from "./actions/booksActions";
import {addToCart} from "./actions/cartActions";

const middleware = applyMiddleware(thunk, logger);

//WE WILL PASS INITIAL STATE FROM STORE
const initialState = window.INITIAL_STATE;

//CREATE STORE
const store = createStore(reducers, initialState, middleware);


import routes from "./routes";
//RENDER THE COMPONENT
const Routes = (
  <Provider store = {store}>
    {routes}
  </Provider> 		
)

render(
  Routes, document.getElementById("app")		
);

