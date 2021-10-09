// const express = require('express');
// var router = express.Router();
const {
    insert,
    findById,
    list,
    update,
    deletedata,
  } = require("../models/commonModel");
  const { loginValidationSchema } = require("../validation");
  const Joi = require("joi"); 
  const jwt = require("jsonwebtoken");
  const multer = require('multer');
  //const client = require('filestack-js').init('A4GH3jHanTBKi9vlkULPzz');
  
  let tableName = "users";
  let validationSchema;
  
  const handleActions = async (req, res, next) => {
  //  console.log('req==', req)
    let body = req.body;
    console.log('body', body)
    const { action } = req.params;
  
    try {
     
      const result = await actionResponse(action, body);
      //   console.log("result", result);
      res.send({
        data: result,
      });
    } catch (error) {
      res.send({
        error: error.message,
      });
    }
  };
  
  const actionResponse = async (action, body) => {
    await validate(action, body);
    
    let table = await actionModel(action, body);
    // console.log("table", table);
    return table;
  };
  
  const validate = async (action, body) => {
    switch (action) {
      case "login":
        validationSchema = loginValidationSchema;
        break;
    }
  
     console.log('--body', body)
   //  console.log('typeof validationSchema', validationSchema)
    if (typeof validationSchema != "undefined") {
      const validateData = validationSchema.validate(body);
  
      if (validateData.error && validateData.error !== null) {
        throw new Error(validateData.error.message);
      }
  
      return validateData;
    }
  };
  
  const actionModel = async (action, body) => {
    console.log(".......actionmodel", action);
    switch (action) {
  
      case "login":
        const loginData = await login(body);
        return loginData;
  
      default:
        throw new Error("action not proper");
    }
  };
  
  const login = async (body) => {
    const email = body.email;
    const mobile = body.mobile;
    const password = body.password;

    let checkLogin;
    if(email){
      checkLogin = await findById(tableName, {
        email: email,
        password: password,
      });
      console.log("checkEmail", checkLogin.data.length);
      if (checkLogin.data.length <= 0)
        throw new Error("check your email & password");
    }
   
    if(mobile){
      checkLogin = await findById(tableName, {
        mobile: mobile,
        password: password,
      });
      console.log("checkEmail", checkLogin.data.length);
      if (checkLogin.data.length <= 0)
        throw new Error("check your mobile & password");
    }
  
    return checkLogin.data;
  };
  
   
  module.exports = handleActions;
  