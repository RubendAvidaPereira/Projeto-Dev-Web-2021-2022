const sequelize = require('sequelize');
const database = require('../db');

// Tests
const tests = database.define('tests', {
   id: {
      type: sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   id_course: {
      type: sequelize.INTEGER,
      model: 'courses', // References the Column/Model Courses
      key: 'id', // References the row ID in Column/Model Courses
   },
   test_date: {
      type: sequelize.DATEONLY,
   },
   question_1: {
      type: sequelize.TEXT,
   },
   question_2: {
      type: sequelize.TEXT,
   },
   question_3: {
      type: sequelize.TEXT,
   },
   question_4: {
      type: sequelize.TEXT,
   },
});

module.exports = tests;
