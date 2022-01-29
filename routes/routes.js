// =================================================================================================
// =================================================================================================

require('dotenv').config(); // Needs .env for the ACCESS_TOKEN_SECRET

const controller = require('../controllers/controller.js'); // Main Controller
const jwt = require('jsonwebtoken');
const { render } = require('ejs');

var router = require('express').Router(); // Server router

// =================================================================================================
// =================================================================================================
// Middleware to authenticate User
async function authenticate(req, res, next) {
   const request_token = req.cookies.token;

   if (!request_token) {
      return res.redirect('/');
   }
   try {
      const string = request_token.split('|');
      const token = string[0];
      const user = string[1];

      const verify = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Verifica o token em comparação ao secret token
      if (verify) {
         req.email = user;
         req.token = token;
      } else {
         return res.redirect('/');
      }
   } catch (err) {
      return res.redirect('/');
   }
   next();
}

// =================================================================================================
// =================================================================================================
// GET routes
router.get('/', (req, res) => {
   console.log(`GET request - Index`);
   res.render('index');
});

// About Page
router.get('/about', (req, res) => {
   console.log(`GET request - About`);
   res.render('about');
});

// =================================================================================================
// =================================================================================================
// User needs to be authenticated to use next routes

// Student Homepage
router.get('/studentHomepage', authenticate, async (req, res) => {
   const response = await controller.getStudentData(req, res);
   const json_student = response.json_student;
   const json_courses = response.json_courses;
   const json_classes = response.json_classes;
   const json_professors = response.json_professors;
   const num_enrollements = response.num_enrollements;
   const num_classes = response.num_classes;

   console.log(`GET request - Student Homepage`);

   if (num_enrollements == 0) {
      res.render('student/student_homepage', {
         json_student,
         num_enrollements,
         num_classes,
      });
   }
   if (num_enrollements != 0) {
      res.render('student/student_homepage', {
         json_student,
         json_courses,
         json_classes,
         json_professors,
         num_enrollements,
         num_classes,
      });
   }
});

// Student Profile
router.get('/studentProfile', authenticate, async (req, res) => {
   const json_student = await controller.getStudentProfile(req, res);

   console.log(`GET request - Student Profile`);
   res.render('student/student_profile', {
      json_student,
   });
});

// Get all Courses
router.get('/allCourses', authenticate, async (req, res) => {
   const response = await controller.getAllCourses(req, res);
   const json_student = response.json_student;
   const json_courses = response.json_courses;
   const json_enrollements = response.json_enrollements;

   console.log(`GET request - Student Courses`);

   res.render('student/all_courses', {
      json_student,
      json_courses,
      json_enrollements,
   });
});

// Get Active Enrollements
router.get('/activeEnrollements', authenticate, async (req, res) => {
   const response = await controller.activeEnrollements(req, res);
   const json_student = response.json_student;
   const json_courses = response.json_courses;
   const json_enrollements = response.json_enrollements;

   console.log(`GET request - Student Enrollements`);

   res.render('student/active_enrollements', {
      json_student,
      json_courses,
      json_enrollements,
   });
});

// Enrolled Course
router.get('/activeEnrollements/:id_course/:id_student', authenticate, async (req, res) => {
   const response = await controller.infoCourse(req, res);
   const json_student = response.json_student;
   const json_professor = response.json_professor;
   const json_classes = response.json_classes;
   const json_course = response.json_course;

   console.log(`GET request - Student Enrolled Course`);
   res.render('student/info_course', {
      json_student,
      json_professor,
      json_classes,
      json_course,
   });
});

router.get('/activeEnrollements/:id_course/:id_student/test', authenticate, async (req, res) => {
   const response = await controller.getTest(req, res);
   const json_student = response.json_student;
   const json_test = response.json_test;

   console.log(`GET request - Student Test`);

   res.render('student/test', {
      json_student,
      json_test,
   });
});

router.get('/grades', authenticate, async (req, res) => {
   const response = await controller.getGrades(req, res);
   const json_student = response.json_student;
   const json_submission = response.json_submission;

   console.log(`GET request - Student Grades`);
   res.render('student/grades', {
      json_student,
      json_submission,
   });
});

// =================================================================================================
// =================================================================================================
// Professor Homepage
router.get('/professorHomepage', authenticate, async (req, res) => {
   const response = await controller.getProfessorData(req, res);
   const json_professor = response.json_professor;
   const json_courses = response.json_courses;
   const num_courses = response.num_courses;
   const json_submissions = response.json_submissions;
   const num_submissions = response.num_submissions;
   const num_students = response.num_students;

   console.log(`GET request - Professor Homepage`);

   res.render('professor/professor_homepage', {
      json_professor,
      json_courses,
      num_courses,
      json_submissions,
      num_submissions,
      num_students,
   });
});

// Professor Classes
router.get('/professorClasses', authenticate, async (req, res) => {
   const response = await controller.getProfessorClasses(req, res);
   const json_professor = response.json_professor;
   const json_courses = response.json_courses;
   const num_courses = response.num_courses;

   console.log(`GET request - Professor Classes`);

   res.render('professor/professor_classes', {
      json_professor,
      json_courses,
      num_courses,
   });
});

// Professor +Info on a Class
router.get('/professorClasses/:id_course', authenticate, async (req, res) => {
   const response = await controller.getProfessorClassInfo(req, res);
   const json_professor = response.json_professor;
   const json_courses = response.json_courses;
   const num_courses = response.num_courses;
   const json_course = response.json_course;
   const json_classes = response.json_classes;
   const json_test = response.json_test;

   console.log('GET request - + Info');

   res.render('professor/professor_info_class', {
      json_professor,
      json_course,
      json_courses,
      num_courses,
      json_classes,
      json_test,
   });
});

// Professor Students
router.get('/professorStudents', authenticate, async (req, res) => {
   const response = await controller.getStudents(req, res);
   const json_professor = response.json_professor;
   const json_courses = response.json_courses;
   const num_courses = response.num_courses;
   const json_students = response.json_students;
   const json_enrollements = response.json_enrollements;

   console.log('GET request - Student List');

   res.render('professor/student_list', {
      json_professor,
      json_courses,
      num_courses,
      json_students,
      json_enrollements,
   });
});

// Add Test Page
router.get('/professorTest/addTest/:id_course', authenticate, async (req, res) => {
   const response = await controller.getProfessorTest(req, res);
   const json_course = response.json_course;

   console.log('GET request - Add Test');

   res.render('professor/add_test', {
      json_course,
   });
});

// Get All Tests
router.get('/professorTestArquive', authenticate, async (req, res) => {
   const response = await controller.getAllTests(req, res);

   console.log('GET request - Get All Tests');
});

router.get('/professorTest/editTest/:id_test', authenticate, async (req, res) => {
   const response = await controller.getTestToEdit(req, res);
   const json_test = response.json_test;
   const json_course = response.json_course;

   console.log('GET request - Edit Test');

   res.render('professor/edit_test', {
      json_test,
      json_course,
   });
});

// =================================================================================================
// =================================================================================================
// POST routes

// Register Student
router.post('/registerStudent', controller.registerStudent);

// Register Professor
router.post('/registerProfessor', controller.registerProfessor);

// Login Student
router.post('/studentLogin', controller.loginStudent);

// Login Professor
router.post('/professorLogin', controller.loginProfessor);

// Enroll in Course
router.post('/enrollCourse/:id_course/:id_student', authenticate, controller.enrollInCourse);

// Search Course
router.post('/search', authenticate, controller.search);

// Submit Test
router.post('/submitTest/:id_test/:id_course', authenticate, controller.submitTest);

// Edit Class
router.post('/editClass/:id_class', authenticate, controller.editClass);

// Add Class
router.post('/addClass/:id_course', authenticate, controller.addClass);

// Add Course
router.post('/addCourse', authenticate, controller.addCourse);

// Add Test
router.post('/addTest/:id_course', authenticate, controller.addTest);

// Edit Test
router.post('/editTest/:id_test', authenticate, controller.editTest);

// Evaluate Test
router.post('/evaluateTest/:id_test', authenticate, controller.evaluateTest);

module.exports = router;
