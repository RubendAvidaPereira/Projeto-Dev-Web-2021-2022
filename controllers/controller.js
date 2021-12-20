// ===========================================================================================================================
// ===========================================================================================================================
// Required Modules for the Controller
require("dotenv").config()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


// ===========================================================================================================================
// ===========================================================================================================================
// Register Student
exports.registerStudent = async (req, res) => {
    const db = require('../db')
    const newStudent = require('../models/student')

    if (!req.body) {
        return res.staus(400).send({ error: 'EmptyFormException' }) // If request is void, error 400
    }
    try {
        const auth = req.body
        const salt = await bcrypt.genSalt()
        const hashPassword = await bcrypt.hash(auth.password, salt)
        const response = await db.sync()

        const check = await newStudent.findAll({
            where: {
                email: auth.email
            }
        })
        if (check.length == 0) {
            const createStudent = await newStudent.create({
                email: auth.email,
                password: hashPassword,
                name: auth.name,
                username: auth.username
            })
            return res.status(201).send({ message: 'StudentCreated' })
        }
        else {
            return res.status(403).send({ message: 'UserAlreadyRegisted' })
        }
    } catch (err) {
        return res.status(400).send({ error: err })
    }
}

// Register Professor
exports.registerProfessor = async (req, res) => {
    const db = require('../db')
    const newProfessor = require('../models/professor')

    if (!req.body) {
        return res.staus(400).send({ error: 'EmptyFormException' }) // If request is void, error 400
    }
    try {
        const auth = req.body
        const salt = await bcrypt.genSalt()
        const hashPassword = await bcrypt.hash(auth.password, salt)
        const response = await db.sync()

        const check = await newProfessor.findAll({
            where: {
                email: auth.email
            }
        })
        if (check.length == 0) {
            const createProfessor = await newProfessor.create({
                email: auth.email,
                password: hashPassword,
                name: auth.name,
                username: auth.username
            })
            return res.status(201).send({ message: 'ProfessorCreated' })
        }
        else {
            return res.status(403).send({ message: "UserAlreadyRegisted" })
        }
    } catch (err) {
        return res.status(400).send({ error: err })
    }
}


// ===========================================================================================================================
// ===========================================================================================================================
// Login Student
exports.loginStudent = async (req, res) => {
    const db = require('../db')
    const student = require('../models/student')

    if (!req.body) {
        return res.status(400).send({ error: 'EmptyFormException' })
    }
    try {
        const auth = req.body
        const salt = await bcrypt.genSaltSync(10)
        const hashPassword = await bcrypt.hash(auth.password, salt)
        const checkStudent = await student.findAll({
            where: {
                email: auth.email
            }
        })
        if (checkStudent.length == 0) {
            return res.status(404).send({ error: 'UserNotFound' })
        }
        else {
            bcrypt.compare(auth.password, checkStudent[0].password, (err, result) => {
                if (result) {
                    const user = checkStudent[0].email
                    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
                    res.cookie(
                        "token", (accessToken + "|" + user),
                    ).status(200).send({ message: "Successfull Login" })
                }
                else {
                    res.status(400).send({ error: 'WrongPassword' })
                }
            })
        }
    } catch (err) {
        return res.status(400).send({ error: err })
    }
}


// ===========================================================================================================================
// ===========================================================================================================================
// Login Professor
exports.loginProfessor = async (req, res) => {
    const db = require('../db')
    const professor = require('../models/professor')

    if (!req.body) {
        return res.status(400).send({ error: 'EmptyFormException' })
    }
    try {
        const auth = req.body
        const salt = await bcrypt.genSaltSync(10)
        const hashPassword = await bcrypt.hash(auth.password, salt)
        const checkProfessor = await professor.findAll({
            where: {
                email: auth.email
            }
        })
        if (checkProfessor.length == 0) {
            return res.status(404).send({ error: 'UserNotFound' })
        }
        else {
            bcrypt.compare(auth.password, checkProfessor[0].password, (err, result) => {
                if (result) {
                    const user = checkProfessor[0].email
                    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
                    res.cookie(
                        "token", (accessToken + "|" + user),
                    ).status(200).send({ message: "Successfull Login" })
                }
                else {
                    res.status(400).send({ error: 'WrongPassword' })
                }
            })
        }
    } catch (err) {
        return res.status(400).send({ error: err })
    }
}


// ===========================================================================================================================
// ===========================================================================================================================
// Get Student Data
exports.getStudentData = async (req, res) => {
    const student = require('../models/student')
    const courses = require('../models/course')
    const enrollement = require('../models/enrollment')

    try {
        // Get relevant student Data
        const getStudent = await student.findAll({
            where: {
                email: req.email
            },
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt']
            }
        })
        const JSON_student = JSON.stringify(getStudent)
        const json_student = JSON.parse(JSON_student)

        // Get student current enrollments
        const Enrollements = await enrollement.findAll({
            where: {
                id_student: json_student[0].id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })
        console.log(Enrollements.length)
        const num_enrollements = Enrollements.length
        const JSON_enrollement = JSON.stringify(Enrollements)
        const json_enrollement = JSON.parse(JSON_enrollement)

        // Get courses
        const course_list = []
        for (let i = 0; i < num_enrollements; i++){
            const course = await courses.findAll({
                where: {
                    id: json_enrollement[i].id_course
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            })
            course_list.push(course)
        }
        const JSON_courses = JSON.stringify(course_list)
        const json_courses = JSON.parse(JSON_courses)

        // Get Classes
        res.json({
            json_student,
            json_courses,
            num_enrollements,
        })

    } catch (err) {
        return res.status(400).send({ error: err })
    }
}
