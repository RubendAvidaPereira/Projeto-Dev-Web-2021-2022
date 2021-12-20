
// =================================================================================================
// =================================================================================================
require("dotenv").config() // Needs .env for the ACCESS_TOKEN_SECRET


const controller = require("../controllers/controller.js") // Main Controller
const jwt = require('jsonwebtoken')

/** Models
 * > Student
 * > Professor
 * > Classes
 * > Courses
 * > Enrollements
 */
const students = require('../models/student')
const professors = require('../models/professor')
const classes = require('../models/class')
const courses = require('../models/course')
const enrollements = require('../models/enrollment')

var router = require("express").Router() // Server router


// =================================================================================================
// =================================================================================================
// Middleware to authenticate User
async function authenticate(req, res, next) {
    const request_token = req.cookies.token

    if (!request_token) {
        return res.status(403).redirect('/')
    }
    try {
        const string = request_token.split('|')
        const token = string[0]
        const user = string[1]

        const verify = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) // Verifica o token em comparação ao secret token
        if (verify) {
            req.email = user
            req.token = token
        }
        else {
            return res.status(403)
        }
    } catch (err) {
        return res.status(403).send({ error: err }).redirect('/')
    }
    next()
}


// =================================================================================================
// =================================================================================================
// Login and Register Page
router.get('/', (req, res) => {
    console.log(`GET request - Index`)
    res.render('index')
})

// About Page
router.get('/about', (req, res) => {
    console.log(`GET request - About`)
    res.render('about')
})

// Register Student
router.post('/registerStudent', controller.registerStudent)

// Register Professor
router.post('/registerProfessor', controller.registerProfessor)

// Login Student
router.post('/studentLogin', controller.loginStudent)

// Login Professor
router.post('/professorLogin', controller.loginProfessor)


// =================================================================================================
// =================================================================================================
// User needs to be authenticated to use this routes

// Student Homepage
router.get('/studentHomepage', authenticate, async (req, res) => {

    try {
        // Get relevant student Data
        const getStudent = await students.findAll({
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
        const Enrollements = await enrollements.findAll({
            where: {
                id_student: json_student[0].id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })
        const num_enrollements = Enrollements.length
        const JSON_enrollement = JSON.stringify(Enrollements)
        const json_enrollement = JSON.parse(JSON_enrollement)

        /**
        * > Getting professors and Courses
        *  
        */
        const professors_list = []
        const course_list = []
        for (let i = 0; i < num_enrollements; i++) {
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


        for (let i = 0; i < num_enrollements; i++) {
            const professor = await professors.findAll({
                where: {
                    id: json_courses[i][0].id_professor
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'password']
                }
            })
            professors_list.push(professor)
        }
        const JSON_professors = JSON.stringify(professors_list)
        const json_professors = JSON.parse(JSON_professors)
        // Get Classes
        const class_list = []
        for (let i = 0; i < course_list.length; i++) {
            if (!json_courses[0][i]) {
                break
            }
            else {
                const student_class = await classes.findAll({
                    where: {
                        course_id: json_courses[0][i].id
                    }
                })
                class_list.push(student_class)
            }
        }
        const JSON_classes = JSON.stringify(class_list)
        const json_classes = JSON.parse(JSON_classes)
        const num_classes = json_classes[0].length

        res.render('student_homepage', {
            json_student,
            json_courses,
            json_classes,
            json_professors,
            num_enrollements,
            num_classes
        })
    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: err })
    }
})

// Student Profile
router.get('/studentProfile', authenticate, async (req, res) => {
    try {
        const getData = await students.findAll({
            where: {
                email: req.email,
            },
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt']
            }
        })
        const JSON_student = JSON.stringify(getData)
        const json_student = JSON.parse(JSON_student)

        res.render('student_profile', {
            json_student,
        })

    } catch (err) {
        return res.status(400).send({ error: err })
    }
})


module.exports = router