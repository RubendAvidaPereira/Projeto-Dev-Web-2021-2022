
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
        return res.redirect('/')
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
            return res.redirect('/')
        }
    } catch (err) {
        return res.redirect('/')
    }
    next()
}


// =================================================================================================
// =================================================================================================
// GET routes
router.get('/', (req, res) => {
    console.log(`GET request - Index`)
    res.render('index')
})

// About Page
router.get('/about', (req, res) => {
    console.log(`GET request - About`)
    res.render('about')
})


// =================================================================================================
// =================================================================================================
// User needs to be authenticated to use next routes

// Student Homepage
router.get('/studentHomepage', authenticate, async (req, res) => {
    const response = await controller.getStudentData(req, res)
    const json_student = response.json_student
    const json_courses = response.json_courses
    const json_classes = response.json_classes
    const json_professors = response.json_professors
    const num_enrollements = response.num_enrollements
    const num_classes = response.num_classes

    if (num_enrollements == 0){
        res.render('student_homepage', {
            json_student,
            num_enrollements,
            num_classes
        })
    }
    if (num_enrollements != 0) {
        res.render('student/student_homepage', {
            json_student,
            json_courses,
            json_classes,
            json_professors,
            num_enrollements,
            num_classes
        })
    }
})

// Student Profile
router.get('/studentProfile', authenticate, async (req, res) => {
    const json_student = await controller.getStudentProfile(req, res)
        
    res.render('student/student_profile', {
        json_student
    })
})

// Get all Courses
router.get('/allCourses', authenticate, async (req, res) => {
    const response = await controller.getAllCourses(req, res)
    const json_student = response.json_student
    const json_courses = response.json_courses
    const json_enrollements = response.json_enrollements

    res.render('student/all_courses', {
        json_student,
        json_courses,
        json_enrollements
    })
})

// Get Active Enrollements
router.get('/activeEnrollements', authenticate, async (req, res) => {
    const response = await controller.activeEnrollements(req, res)
    const json_student = response.json_student
    const json_courses = response.json_courses
    const json_enrollements = response.json_enrollements
    res.render('student/active_enrollements', {
        json_student,
        json_courses,
        json_enrollements
    })
})

// Enrolled Course
router.get('/activeEnrollements/:id_course/:id_student', authenticate, async (req, res) => {
    const response = await controller.infoCourse(req, res)
    const json_student = response.json_student
    const json_professor = response.json_professor
    const json_classes = response.json_classes
    const json_course = response.json_course
    res.render('student/info_course', {
        json_student,
        json_professor,
        json_classes,
        json_course
    })
})

router.get('/activeEnrollements/:id_course/:id_student/test', authenticate, async (req, res) => {
    const response = await controller.getTest(req, res)
    const json_student = response.json_student
    const json_test = response.json_test
    
    res.render('student/test', {
        json_student,
        json_test
    })
})


// =================================================================================================
// =================================================================================================
// Professor Homepage
router.get('/professorHomepage', authenticate, async (req, res) => {
    const response = await controller.getProfessorData(req, res)
    const json_professor = response.json_professor

    res.render('professor/professor_homepage', {
        json_professor,
        
    })
})

// =================================================================================================
// =================================================================================================
// POST routes

// Register Student
router.post('/registerStudent', controller.registerStudent)

// Register Professor
router.post('/registerProfessor', controller.registerProfessor)

// Login Student
router.post('/studentLogin', controller.loginStudent)

// Login Professor
router.post('/professorLogin', controller.loginProfessor)

// Enroll in Course
router.post('/enrollCourse/:id_course/:id_student', authenticate, controller.enrollInCourse)

// Search Course
router.post('/search', authenticate, controller.search)

// Submit Test
router.post('/submitTest/:id_test', authenticate, controller.submitTest)


module.exports = router