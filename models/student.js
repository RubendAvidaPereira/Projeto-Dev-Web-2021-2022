const sequelize = require('sequelize')
const database = require('../db')


// Students
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

module.exports = students