const sequelize = require('sequelize');
const database = require('../db');

// Submissions
const submissions = database.define('submissions', {
   id: {
      type: sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   test_id: {
      type: sequelize.INTEGER,
      model: 'tests', // References the Column/Model Tests
      key: 'id', // References the row ID in Column/Model Tests
   },
   test_result: {
      type: sequelize.INTEGER,
      allowNull: true,
   },
   answer1: {
      type: sequelize.TEXT,
      allowNull: true,
   },
   answer2: {
      type: sequelize.TEXT,
      allowNull: true,
   },
   answer3: {
      type: sequelize.TEXT,
      allowNull: true,
   },
   answer4: {
      type: sequelize.TEXT,
      allowNull: true,
   },
<<<<<<< HEAD
   score1: {
      type: sequelize.INTEGER,
      allowNull: true,
   },
   score2: {
      type: sequelize.INTEGER,
      allowNull: true,
   },
   score3: {
      type: sequelize.INTEGER,
      allowNull: true,
   },
   score4: {
      type: sequelize.INTEGER,
      allowNull: true,
   },
=======
>>>>>>> fffc78e7cde51147b6139f4f748d2f9f6f9bfc1d
   student_name: {
      type: sequelize.TEXT,
   },
   student_email: {
      type: sequelize.TEXT,
   },
   course_name: {
      type: sequelize.TEXT,
   },
});

module.exports = submissions;
