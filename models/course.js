const sequelize = require('sequelize')
const database = require('../db')


// Courses
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

module.exports = courses