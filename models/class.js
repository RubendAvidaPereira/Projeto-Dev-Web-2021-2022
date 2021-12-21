const sequelize = require('sequelize')
const database = require('../db')


// Classes
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

module.exports = classes
