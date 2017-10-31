"use strict";
import axios from "axios";
import React from "react";
import {createStore} from "redux";
import {Provider} from "react-redux";
import {renderToString} from "react-dom/server";
import {match, RouterContext} from "react-router";

import reducers from "./src/reducers/index";
import routes from "./src/routes";

const handleRender = (req, res) => {
  axios.get("http://localhost:3001/books")
    .then((response) => {
      //const myHtml = JSON.stringify(response.data);
      //res.render("index", {myHtml})
  
      //STEP - 1 CREATE A REDUX STORE ON SERVER
      const store = createStore(reducers, {"books": {"books": response.data}})
      //STEP - 2 GET INITIAL STATE FROM THE STORE
      const initialState = JSON.stringify(store.getState()).replace(/<\/script/g,
      '<\\/script').replace(/<!--/g, '<\\!--')
      //STEP - 3 IMPLEMENT REACT ROUTER ON THE SERVER TO INTERCEPT CLIENT REQUEST AND DEFINE WHAT TO DO WITH THEM
      const Routes = {
        routes:routes,
	location:req.url
      }
      match(Routes, function(error, redirect, props){
       if (error){
         res.status(500).send("Error fulfilling the request");
       } else if(redirect){
         res.status(302, redirect.pathname + redirect.search)
       } else if(props){
         const reactComponent = renderToString(
	   <Provider store={store}>
             <RouterContext {...props}/>
	   </Provider>
	 )
	   res.status(200).render("index", {reactComponent, initialState})
       }else{
         res.status(404).send("Not Found")
       }
      })
    
    })
  .catch((err) => {
    console.log("#Initial Server-side rendering error", err)
  })
}

module.exports = handleRender;
