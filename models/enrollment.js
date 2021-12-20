const sequelize = require('sequelize')
const database = require('../db')


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

module.exports = enrollments