// const express = require('express');
// var router = express.Router();
const {
    insert,
    findById,
    list,
    update,
    deletedata,
  } = require("../models/commonModel");
  const { postsValidationSchema } = require("../validation");
  const Joi = require("joi");
  const jwt = require("jsonwebtoken");
  
  let tableName = "users";
  let validationSchema;
  
  const handleActions = async (req, res, next) => {
    let body = req.body;
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
      case "register":
        validationSchema = postsValidationSchema;
        break;
    }
  
    // console.log('--body', body)
    // console.log('typeof validationSchema', typeof validationSchema)
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
      case "create":
        const createPost = await postsCreate(body);
        return createPost;
  
      case "userlist":
        const listUsers = await usersList(body);
        return listUsers;
  
      case "update":
        const updateUser = await UserUpdate(body);
        return updateUser;
  
      case "flagdelete":
        const updateUserData = await UserUpdateflag(body);
        return updateUserData;
  
      case "delete":
        const deleteUser = await UserDelete(body);
        return deleteUser;
  
      default:
        throw new Error("action not proper");
    }
  };
  
  const postsCreate = async (body) => {
    //  const body = req.body;
    console.log("........11..");
    const usersObj = {
      firstname: body.firstname,
      lastname: body.lastname,
      email: body.email,
      mobile: body.mobile,
      password: body.password,
      gender: body.gender,
      country: body.country,
      state: body.state,
      profileImage: body.profileImage,
    };
  
    console.log("tableName", tableName);
    const insertedData = await insert(tableName, usersObj);
    if (!insertedData.data) throw new Error("data is not inserted");
  
    const record = await findById(tableName, { id: insertedData.data[0] });
    return record.data;
  };
  
  const usersList = async (body) => {
    const listData = await list(tableName);
    if (!listData.data) throw new Error("data is not found");
    return listData;
  };
  
  const UserUpdate = async (body) => {
    console.log("body", body);
    const usersObj = {
      firstname: body.firstname,
      lastname: body.lastname,
      email: body.email,
      mobile: body.mobile,
      password: body.password,
      gender: body.gender,
      country: body.country,
      state: body.state,
      profileImage: body.profileImage,
    };
    const finddata = await findById(tableName, { id: body.id });
    console.log("finddata", finddata.data);
    if (!finddata.data) throw new Error("data is not find");
  
    const updateData = await update(tableName, { id: body.id }, usersObj);
    console.log("updateData", updateData);
    if (!updateData.data) throw new Error("data is not updated");
  
    //  const record = await findById(tableName, { 'id': updateData.data })
    const record = await findById(tableName, { id: body.id });
    return record.data;
  };
  
  const UserUpdateflag = async (body) => {
    console.log("body", body);
    const usersObj = {
      isVisible: 1
    };
    const finddata = await findById(tableName, { id: body.id });
    console.log("finddata", finddata.data);
    if (!finddata.data) throw new Error("data is not find");
  
    const updateData = await update(tableName, { id: body.id }, usersObj);
    console.log("updateData", updateData);
    if (!updateData.data) throw new Error("data is not updated");
  
    //  const record = await findById(tableName, { 'id': updateData.data })
    const record = await findById(tableName, { id: body.id });
    return record.data;
  };
  
  const UserDelete = async (body) => {
    const finddata = await findById(tableName, { id: body.id });
    if (!finddata.data) throw new Error("data is not find");
  
    const deleteData = await deletedata(tableName, { id: body.id });
    if (!deleteData.data) throw new Error("data is not deleted");
  
    return deleteData;
  };
  
  module.exports = handleActions;
  