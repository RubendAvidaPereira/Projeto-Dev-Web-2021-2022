const sequelize = require('sequelize')
const database = require('../db')


//=============================================================
//========================[ Courses ]==========================
//=============================================================
const courses = database.define('courses', {
    id: { 
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    type: {
        type: sequelize.STRING,
        allowNull: false
    },
    id_professor: {
        type: sequelize.INTEGER,
        model: 'professors', // References the Column/Model Professors
        key: 'id' // References the row ID in Column/Model Professors
    }
})


//=============================================================
//=========================[ Classes ]=========================
//=============================================================
const classes = database.define('classes', {
    id: { 
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: sequelize.STRING,
        allowNull: false
    },
    summary: {
        type: sequelize.TEXT,
        allowNull: false
    },
    class_date: {
        type: sequelize.DATEONLY,
    },
    course_id: {
        type: sequelize.INTEGER,
        model: 'courses', // References the Column/Model Courses
        key: 'id' // References the row ID in Column/Model Courses
    }
})


//=============================================================
//=======================[ Students ]==========================
//=============================================================
const students = database.define('students', {
    id: { 
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: sequelize.STRING,
        allowNull: false
    },
    password: {
        type: sequelize.STRING,
        allowNull: false
    },
    name: {
        type: sequelize.STRING,
        allowNull: false
    },
    username: {
        type: sequelize.STRING,
        allowNull: false
    },
})


//=============================================================
//======================[ Enrollments ]========================
//=============================================================
const enrollments = database.define('enrollments', {
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_student: {
        type: sequelize.INTEGER,
        model: 'students', // References the Column/Model Students
        key: 'id' // References the row ID in Column/Model Students
    },
    id_course: {
        type: sequelize.INTEGER,
        model: 'courses', // References the Column/Model Courses
        key: 'id' // References the row ID in Column/Model Courses
    }
})


//=============================================================
//======================[ Professors ]=========================
//=============================================================
const professors = database.define('professors', {
    id: { 
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: sequelize.STRING,
        allowNull: false
    },
    password: {
        type: sequelize.STRING,
        allowNull: false
    },
    name: {
        type: sequelize.STRING,
        allowNull: false
    },
    username: {
        type: sequelize.STRING,
        allowNull: false
    },
})


//=============================================================
//========================[ Relations ]========================
//=============================================================

professors.hasMany(courses)
students.hasMany(enrollments)
courses.hasMany(enrollments)
classes.belongsTo(courses)

module.exports = classes, courses, students, professors, enrollments