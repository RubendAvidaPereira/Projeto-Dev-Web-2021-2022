const sequelize = require('sequelize');
const database = require('../db');

//=============================================================
//========================[ Courses ]==========================
//=============================================================
const courses = database.define('courses', {
   id: {
      type: sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   type: {
      type: sequelize.STRING,
      allowNull: false,
   },
   id_professor: {
      type: sequelize.INTEGER,
      model: 'professors', // References the Column/Model Professors
      key: 'id', // References the row ID in Column/Model Professors
   },
});

//=============================================================
//=========================[ Classes ]=========================
//=============================================================
const classes = database.define('classes', {
   id: {
      type: sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   title: {
      type: sequelize.STRING,
      allowNull: false,
   },
   summary: {
      type: sequelize.TEXT,
      allowNull: false,
   },
   class_date: {
      type: sequelize.DATEONLY,
   },
   course_id: {
      type: sequelize.INTEGER,
      model: 'courses', // References the Column/Model Courses
      key: 'id', // References the row ID in Column/Model Courses
   },
});

//=============================================================
//=======================[ Students ]==========================
//=============================================================
const students = database.define('students', {
   id: {
      type: sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   email: {
      type: sequelize.STRING,
      allowNull: false,
   },
   password: {
      type: sequelize.STRING,
      allowNull: false,
   },
   name: {
      type: sequelize.STRING,
      allowNull: false,
   },
   username: {
      type: sequelize.STRING,
      allowNull: false,
   },
});

//=============================================================
//======================[ Enrollments ]========================
//=============================================================
const enrollments = database.define('enrollments', {
   id: {
      type: sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   id_student: {
      type: sequelize.INTEGER,
      model: 'students', // References the Column/Model Students
      key: 'id', // References the row ID in Column/Model Students
   },
   id_course: {
      type: sequelize.INTEGER,
      model: 'courses', // References the Column/Model Courses
      key: 'id', // References the row ID in Column/Model Courses
   },
});

//=============================================================
//==========================[ Tests ]==========================
//=============================================================
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

//=============================================================
//======================[ Submissions ]=========================
//=============================================================
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

//=============================================================
//======================[ Professors ]=========================
//=============================================================
const professors = database.define('professors', {
   id: {
      type: sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   email: {
      type: sequelize.STRING,
      allowNull: false,
   },
   password: {
      type: sequelize.STRING,
      allowNull: false,
   },
   name: {
      type: sequelize.STRING,
      allowNull: false,
   },
   username: {
      type: sequelize.STRING,
      allowNull: false,
   },
});

//=============================================================
//========================[ Relations ]========================
//=============================================================

professors.hasMany(courses);
enrollments.hasOne(tests);
students.hasMany(enrollments);
courses.hasMany(enrollments);
classes.belongsTo(courses);

(module.exports = classes), courses, students, professors, enrollments, tests;
