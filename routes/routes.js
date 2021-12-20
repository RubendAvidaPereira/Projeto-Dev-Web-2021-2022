
// =================================================================================================
// =================================================================================================

require("dotenv").config() // Needs .env for the ACCESS_TOKEN_SECRET


const controller = require("../controllers/controller.js") // Main Controller
const jwt = require('jsonwebtoken')

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
    const response = await controller.getStudentData(req, res)
    const json_student = response.json_student
    const json_courses = response.json_courses
    const json_classes = response.json_classes
    const json_professors = response.json_professors
    const num_enrollements = response.num_enrollements
    const num_classes = response.num_classes
    res.render('student_homepage', {
        json_student,
        json_courses,
        json_classes,
        json_professors,
        num_enrollements,
        num_classes
    })
})

// Student Profile
router.get('/studentProfile', authenticate, async (req, res) => {
    const json_student = await controller.getStudentProfile(req, res)
    console.log(json_student)
        
    res.render('student_profile', {
        json_student
    })
})

// Get all Courses
router.get('/allCourses', authenticate, async (req, res) => {
    const response = await controller.getAllCourses(req, res)
    const json_student = response.json_student
    const json_courses = response.json_courses
    const json_enrollements = response.json_enrollements
    res.render('all_courses', {
        json_student,
        json_courses,
        json_enrollements
    })
})

// Enroll in Course
router.post('/enrollCourse/:id_course/:id_student', authenticate, controller.enrollInCourse)

module.exports = router