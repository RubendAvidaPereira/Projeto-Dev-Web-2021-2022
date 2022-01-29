// ===========================================================================================================================
// ===========================================================================================================================
// Required Modules for the Controller
require('dotenv').config();

const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/** Models
 * > Student
 * > Professor
 * > Classes
 * > Courses
 * > Enrollements
 */
const students = require('../models/student');
const professors = require('../models/professor');
const classes = require('../models/class');
const courses = require('../models/course');
const enrollements = require('../models/enrollment');
const tests = require('../models/test');
const submissions = require('../models/submission');

// ===========================================================================================================================
// ===========================================================================================================================
// Register Student
exports.registerStudent = async (req, res) => {
   const db = require('../db');
   const newStudent = require('../models/student');

   if (!req.body) {
      return res.staus(400).send({ error: 'EmptyFormException' }); // If request is void, error 400
   }
   try {
      const auth = req.body;
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(auth.password, salt);
      const response = await db.sync();

      const check = await newStudent.findAll({
         where: {
            email: auth.email,
         },
      });
      if (check.length == 0) {
         const createStudent = await newStudent.create({
            email: auth.email,
            password: hashPassword,
            name: auth.name,
            username: auth.username,
         });
         return res.status(201).send({ message: 'StudentCreated' });
      } else {
         return res.status(403).send({
            message: 'UserAlreadyRegisted',
         });
      }
   } catch (err) {
      return res.status(400).send({ error: err });
   }
};

// Register Professor
exports.registerProfessor = async (req, res) => {
   const db = require('../db');
   const newProfessor = require('../models/professor');

   if (!req.body) {
      return res.staus(400).send({ error: 'EmptyFormException' }); // If request is void, error 400
   }
   try {
      const auth = req.body;
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(auth.password, salt);
      const response = await db.sync();

      const check = await newProfessor.findAll({
         where: {
            email: auth.email,
         },
      });
      if (check.length == 0) {
         const createProfessor = await newProfessor.create({
            email: auth.email,
            password: hashPassword,
            name: auth.name,
            username: auth.username,
         });
         return res.status(201).send({ message: 'ProfessorCreated' });
      } else {
         return res.status(403).send({
            message: 'UserAlreadyRegisted',
         });
      }
   } catch (err) {
      return res.status(400).send({ error: err });
   }
};

// ===========================================================================================================================
// ===========================================================================================================================
// Login Student
exports.loginStudent = async (req, res) => {
   const db = require('../db');
   const student = require('../models/student');

   if (!req.body) {
      return res.status(400).send({ error: 'EmptyFormException' });
   }
   try {
      const auth = req.body;
      const salt = await bcrypt.genSaltSync(10);
      const hashPassword = await bcrypt.hash(auth.password, salt);
      const checkStudent = await student.findAll({
         where: {
            email: auth.email,
         },
      });
      if (checkStudent.length == 0) {
         return res.status(404).send({ error: 'UserNotFound' });
      } else {
         bcrypt.compare(auth.password, checkStudent[0].password, (err, result) => {
            if (result) {
               const user = checkStudent[0].email;
               const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
               res.cookie('token', accessToken + '|' + user)
                  .status(200)
                  .send({
                     message: 'Successfull Login',
                  });
            } else {
               res.status(403).send({
                  error: 'WrongPassword',
               });
            }
         });
      }
   } catch (err) {
      return res.status(400).send({ error: err });
   }
};

// ===========================================================================================================================
// ===========================================================================================================================
// Login Professor
exports.loginProfessor = async (req, res) => {
   const db = require('../db');
   const professor = require('../models/professor');

   if (!req.body) {
      return res.status(400).send({ error: 'EmptyFormException' });
   }
   try {
      const auth = req.body;
      const salt = await bcrypt.genSaltSync(10);
      const hashPassword = await bcrypt.hash(auth.password, salt);
      const checkProfessor = await professor.findAll({
         where: {
            email: auth.email,
         },
      });
      if (checkProfessor.length == 0) {
         return res.status(404).send({ error: 'UserNotFound' });
      } else {
         bcrypt.compare(auth.password, checkProfessor[0].password, (err, result) => {
            if (result) {
               const user = checkProfessor[0].email;
               const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
               res.cookie('token', accessToken + '|' + user)
                  .status(200)
                  .send({
                     message: 'Successfull Login',
                  });
            } else {
               res.status(400).send({
                  error: 'WrongPassword',
               });
            }
         });
      }
   } catch (err) {
      return res.status(400).send({ error: err });
   }
};

// ===========================================================================================================================
// ===========================================================================================================================
// Get Student Data
exports.getStudentData = async (req, res) => {
   try {
      let num_classes = 0;
      let num_enrollements = 0;

      // Get relevant student Data
      const getStudent = await students.findAll({
         where: {
            email: req.email,
         },
         attributes: {
            exclude: ['password', 'createdAt', 'updatedAt'],
         },
      });
      const JSON_student = JSON.stringify(getStudent);
      const json_student = JSON.parse(JSON_student);

      // Get student current enrollments
      const Enrollements = await enrollements.findAll({
         where: {
            id_student: json_student[0].id,
         },
         attributes: {
            exclude: ['createdAt', 'updatedAt'],
         },
      });
      num_enrollements = Enrollements.length;
      const JSON_enrollement = JSON.stringify(Enrollements);
      const json_enrollement = JSON.parse(JSON_enrollement);

      if (num_enrollements == 0) {
         return {
            json_student,
            num_enrollements,
            num_classes,
         };
      }
      if (num_enrollements != 0) {
         /**
          * > Getting professors and Courses
          *
          */
         const professors_list = [];
         const course_list = [];
         const id_course_list = [];
         for (let i = 0; i < num_enrollements; i++) {
            const course = await courses.findAll({
               where: {
                  id: json_enrollement[i].id_course,
               },
               attributes: {
                  exclude: ['createdAt', 'updatedAt'],
               },
            });
            id_course_list.push(json_enrollement[i].id_course);
            course_list.push(course);
         }
         const JSON_courses = JSON.stringify(course_list);
         const json_courses = JSON.parse(JSON_courses);

         for (let i = 0; i < num_enrollements; i++) {
            const professor = await professors.findAll({
               where: {
                  id: json_courses[i][0].id_professor,
               },
               attributes: {
                  exclude: ['createdAt', 'updatedAt', 'password'],
               },
            });
            professors_list.push(professor);
         }
         const JSON_professors = JSON.stringify(professors_list);
         const json_professors = JSON.parse(JSON_professors);

         // Get Classes
         const class_list = [];

         try {
            const student_class = await classes.findAll({
               where: {
                  course_id: {
                     [Op.or]: id_course_list,
                  },
               },
               attributes: {
                  exclude: ['createdAt', 'updatedAt'],
               },
            });
            class_list.push(student_class);

            const JSON_classes = JSON.stringify(class_list);
            const json_classes = JSON.parse(JSON_classes);
            num_classes = json_classes[0].length;

            return {
               json_student,
               json_courses,
               json_classes,
               json_professors,
               num_enrollements,
               num_classes,
            };
         } catch (err) {
            console.log(err);
         }
      }
   } catch (err) {
      return res.status(400).send({ error: err });
   }
};

// Get Student Profile Data
exports.getStudentProfile = async (req, res) => {
   try {
      const getData = await students.findAll({
         where: {
            email: req.email,
         },
         attributes: {
            exclude: ['password', 'createdAt', 'updatedAt'],
         },
      });
      const JSON_student = JSON.stringify(getData);
      const json_student = JSON.parse(JSON_student);

      return json_student;
   } catch (err) {
      return res.status(400).send({ error: err });
   }
};

// Get All Courses
exports.getAllCourses = async (req, res) => {
   try {
      const getData = await students.findAll({
         where: {
            email: req.email,
         },
         attributes: {
            exclude: ['password', 'createdAt', 'updatedAt'],
         },
      });
      const JSON_student = JSON.stringify(getData);
      const json_student = JSON.parse(JSON_student);

      const getCourses = await courses.findAll();
      const JSON_courses = JSON.stringify(getCourses);
      const json_courses = JSON.parse(JSON_courses);

      const getEnrollements = await enrollements.findAll({
         where: {
            id_student: json_student[0].id,
         },
      });
      const JSON_enrollements = JSON.stringify(getEnrollements);
      const json_enrollements = JSON.parse(JSON_enrollements);

      return {
         json_student,
         json_courses,
         json_enrollements,
      };
   } catch (err) {
      return res.status(400).send({ error: err });
   }
};

// Enroll in course
exports.enrollInCourse = async (req, res) => {
   const studentID = req.params.id_student;
   const courseID = req.params.id_course;

   try {
      const enrollment = await enrollements.create({
         id_student: studentID,
         id_course: courseID,
      });
      return res.status(201).send({ message: 'EnrollementSuccessfull' });
   } catch {
      return res.status(400).send({ error: err });
   }
};

// Active Courses
exports.activeEnrollements = async (req, res) => {
   try {
      // Get Relevant Student Data
      const getData = await students.findAll({
         where: {
            email: req.email,
         },
         attributes: {
            exclude: ['password', 'createdAt', 'updatedAt'],
         },
      });
      const JSON_student = JSON.stringify(getData);
      const json_student = JSON.parse(JSON_student);

      // Get current Enrollements
      const getEnrollements = await enrollements.findAll({
         where: {
            id_student: json_student[0].id,
         },
      });
      const JSON_enrollements = JSON.stringify(getEnrollements);
      const json_enrollements = JSON.parse(JSON_enrollements);

      // Get Courses
      const course_list = [];
      for (let i = 0; i < json_enrollements.length; i++) {
         const course = await courses.findAll({
            where: {
               id: json_enrollements[i].id_course,
            },
            attributes: {
               exclude: ['createdAt', 'updatedAt'],
            },
         });
         course_list.push(course);
      }
      const JSON_courses = JSON.stringify(course_list);
      const json_courses = JSON.parse(JSON_courses);

      return {
         json_student,
         json_enrollements,
         json_courses,
      };
   } catch (err) {
      return res.status(400).send({ error: err });
   }
};

// Student +Info Course
exports.infoCourse = async (req, res) => {
   const studentID = req.params.id_student;
   const courseID = req.params.id_course;

   const testEnrollement = await enrollements.findAll({
      where: {
         id_student: studentID,
         id_course: courseID,
      },
   });

   console.log(testEnrollement);

   if (testEnrollement.length == 0) {
      try {
         // Getting relevant student data
         const getStudent = await students.findAll({
            where: {
               id: studentID,
            },
            attributes: {
               exclude: ['createdAt', 'updatedAt', 'password'],
            },
         });
         const JSON_student = JSON.stringify(getStudent);
         const json_student = JSON.parse(JSON_student);

         // Getting Course
         const getCourse = await courses.findAll({
            where: {
               id: courseID,
            },
         });
         const JSON_course = JSON.stringify(getCourse);
         const json_course = JSON.parse(JSON_course);

         // Getting Course Professor Data
         const getProfessor = await professors.findOne({
            where: {
               id: json_course[0].id_professor,
            },
            attributes: {
               exclude: ['createdAt', 'updatedAt', 'password'],
            },
         });
         const JSON_professor = JSON.stringify(getProfessor);
         const json_professor = JSON.parse(JSON_professor);

         return {
            message: 'Not enrolled',
            json_student,
            json_professor,
            json_course,
         };
      } catch (err) {
         return res.status(400).send({ error: err });
      }
   } else {
      try {
         // Getting relevant student data
         const getStudent = await students.findAll({
            where: {
               id: studentID,
            },
            attributes: {
               exclude: ['createdAt', 'updatedAt', 'password'],
            },
         });
         const JSON_student = JSON.stringify(getStudent);
         const json_student = JSON.parse(JSON_student);

         // Getting Course
         const getCourse = await courses.findAll({
            where: {
               id: courseID,
            },
         });
         const JSON_course = JSON.stringify(getCourse);
         const json_course = JSON.parse(JSON_course);

         // Getting Course Classes
         const getClasses = await classes.findAll({
            where: {
               course_id: courseID,
            },
            attributes: {
               exclude: ['createdAt', 'updatedAt'],
            },
         });
         const JSON_classes = JSON.stringify(getClasses);
         const json_classes = JSON.parse(JSON_classes);

         // Getting Course Professor Data
         const getProfessor = await professors.findOne({
            where: {
               id: json_course[0].id_professor,
            },
            attributes: {
               exclude: ['createdAt', 'updatedAt', 'password'],
            },
         });
         const JSON_professor = JSON.stringify(getProfessor);
         const json_professor = JSON.parse(JSON_professor);

         return {
            json_student,
            json_classes,
            json_professor,
            json_course,
         };
      } catch (err) {
         return res.status(400).send({ error: err });
      }
   }
};

// Search
exports.search = async (req, res) => {
   try {
      const search = req.body.searchText;
      console.log(search);
      if (search == '') {
         const course = await courses.findAll({
            attributes: {
               exclude: ['createdAt', 'updateAt'],
            },
         });
         const JSON_course = JSON.stringify(course);
         const json_course = JSON.parse(JSON_course);
         res.json(json_course);
      } else {
         const course = await courses.findAll({
            where: {
               type: {
                  [Op.like]: '%' + search + '%',
               },
            },
            attributes: {
               exclude: ['createdAt', 'updateAt'],
            },
         });
         const JSON_course = JSON.stringify(course);
         const json_course = JSON.parse(JSON_course);

         res.json(json_course);
      }
   } catch (err) {
      return res.status(404).send({ error: err });
   }
};

// Get Test
exports.getTest = async (req, res) => {
   try {
      // Get relevant Student Data
      const getStudent = await students.findAll({
         where: {
            email: req.email,
         },
         attributes: {
            exclude: ['createdAt', 'updatedAt', 'password'],
         },
      });
      const JSON_student = JSON.stringify(getStudent);
      const json_student = JSON.parse(JSON_student);

      // Get Test
      const getTest = await tests.findOne({
         where: {
            id_course: req.params.id_course,
         },
      });
      const JSON_test = JSON.stringify(getTest);
      const json_test = JSON.parse(JSON_test);

      return {
         json_student,
         json_test,
      };
   } catch (err) {
      return res.status(400).send({ error: err });
   }
};

// Submit Test
exports.submitTest = async (req, res) => {
   try {
      const testForm = req.body;

      // Get relevant Student Data
      const getStudent = await students.findAll({
         where: {
            email: req.email,
         },
         attributes: {
            exclude: ['createdAt', 'updatedAt', 'password'],
         },
      });
      const JSON_student = JSON.stringify(getStudent);
      const json_student = JSON.parse(JSON_student);

      const getSubmission = await submissions.findAll({
         where: {
            student_email: json_student[0].email,
            test_id: req.params.id_test,
         },
      });

      // Getting Course
      const getCourse = await courses.findAll({
         where: {
            id: req.params.id_course,
         },
      });
      const JSON_course = JSON.stringify(getCourse);
      const json_course = JSON.parse(JSON_course);

      if (getSubmission.length == 0) {
         // Create Submission
         const makeSubmission = await submissions.create({
            test_id: req.params.id_test,
            answer1: testForm.question_1,
            answer2: testForm.question_2,
            answer3: testForm.question_3,
            answer4: testForm.question_4,
            student_name: json_student[0].name,
            student_email: json_student[0].email,
            course_name: json_course[0].type,
            test_result: -1,
         });
         return res.status(201).send({ message: 'Test Submited!' });
      } else {
         return res.status(403).send({
            error: 'Test already Submited',
         });
      }
   } catch (err) {
      return res.status(400).send({ error: err });
   }
};

// Get Student Grades
exports.getGrades = async (req, res) => {
   try {
      // Get relevant Student Data
      const getStudent = await students.findAll({
         where: {
            email: req.email,
         },
         attributes: {
            exclude: ['createdAt', 'updatedAt', 'password'],
         },
      });
      const JSON_student = JSON.stringify(getStudent);
      const json_student = JSON.parse(JSON_student);

      const getSubmission = await submissions.findAll({
         where: {
            student_email: json_student[0].email,
         },
         attributes: {
            exclude: ['answer1', 'answer2', 'answer3', 'answer4', 'createdAt', 'updatedAt'],
         },
      });
      const JSON_submission = JSON.stringify(getSubmission);
      const json_submission = JSON.parse(JSON_submission);
      return {
         json_student,
         json_submission,
      };
   } catch (err) {
      return res.status(400).send({ error: err });
   }
};

// ===========================================================================================================================
// ===========================================================================================================================
// Get Professor Data
exports.getProfessorData = async (req, res) => {
   try {
      // Get relevant professor data
      const getProfessor = await professors.findAll({
         where: {
            email: req.email,
         },
         attributes: {
            exclude: ['password', 'createdAt', 'updatedAt'],
         },
      });
      const JSON_professor = JSON.stringify(getProfessor);
      const json_professor = JSON.parse(JSON_professor);

      const getCourses = await courses.findAll({
         where: {
            id_professor: json_professor[0].id,
         },
      });
      const JSON_courses = JSON.stringify(getCourses);
      const json_courses = JSON.parse(JSON_courses);
      let num_courses = json_courses.length;

      const courseListID = [];
      for (let i = 0; i < num_courses; i++) {
         courseListID.push(json_courses[i].id);
      }

      const getTests = await tests.findAll({
         where: {
            id_course: {
               [Op.or]: courseListID,
            },
         },
      });
      const JSON_tests = JSON.stringify(getTests);
      const json_tests = JSON.parse(JSON_tests);

      const testListID = [];
      for (let i = 0; i < json_tests.length; i++) {
         testListID.push(json_tests[i].id);
      }

      const getSubmissions = await submissions.findAll({
         where: {
            test_id: {
               [Op.or]: testListID,
            },
         },
      });
      const JSON_submissions = JSON.stringify(getSubmissions);
      const json_submissions = JSON.parse(JSON_submissions);
      let num_submissions = json_submissions.length;

      const getEnrollements = await enrollements.findAll({
         where: {
            id_course: {
               [Op.or]: courseListID,
            },
         },
      });
      const JSON_enrollements = JSON.stringify(getEnrollements);
      const json_enrollements = JSON.parse(JSON_enrollements);

      const studentListID = [];
      for (let i = 0; i < json_enrollements.length; i++) {
         studentListID.push(json_enrollements[i].id_student);
      }

      const getStudents = await students.findAll({
         where: {
            id: {
               [Op.or]: studentListID,
            },
         },
         attributes: {
            exclude: ['createdAt', 'updateAt', 'password'],
         },
      });
      const JSON_student = JSON.stringify(getStudents);
      const json_student = JSON.parse(JSON_student);
      const num_students = json_student.length;

      return {
         json_professor,
         json_courses,
         num_courses,
         json_submissions,
         num_submissions,
         num_students,
      };
   } catch (err) {
      return res.status(400).send({ error: err });
   }
};

// Get Courses Lectured
exports.getProfessorClasses = async (req, res) => {
   try {
      // Get relevant professor data
      const getProfessor = await professors.findAll({
         where: {
            email: req.email,
         },
         attributes: {
            exclude: ['password', 'createdAt', 'updatedAt'],
         },
      });
      const JSON_professor = JSON.stringify(getProfessor);
      const json_professor = JSON.parse(JSON_professor);

      const getCourses = await courses.findAll({
         where: {
            id_professor: json_professor[0].id,
         },
      });
      const JSON_courses = JSON.stringify(getCourses);
      const json_courses = JSON.parse(JSON_courses);
      const num_courses = json_courses.length;

      return {
         json_professor,
         json_courses,
         num_courses,
      };
   } catch (err) {
      return res.status(400).send({ error: err });
   }
};

// Get Course Info
exports.getProfessorClassInfo = async (req, res) => {
   try {
      // Get relevant professor data
      const getProfessor = await professors.findAll({
         where: {
            email: req.email,
         },
         attributes: {
            exclude: ['password', 'createdAt', 'updatedAt'],
         },
      });
      const JSON_professor = JSON.stringify(getProfessor);
      const json_professor = JSON.parse(JSON_professor);

      // Get Classes and Course
      const getCourse = await courses.findOne({
         where: {
            id: req.params.id_course,
         },
      });
      const JSON_course = JSON.stringify(getCourse);
      const json_course = JSON.parse(JSON_course);

      const getCourses = await courses.findAll({
         where: {
            id_professor: json_professor[0].id,
         },
      });
      const JSON_courses = JSON.stringify(getCourses);
      const json_courses = JSON.parse(JSON_courses);
      const num_courses = json_courses.length;

      const getClasses = await classes.findAll({
         where: {
            course_id: json_course.id,
         },
      });
      const JSON_classes = JSON.stringify(getClasses);
      const json_classes = JSON.parse(JSON_classes);

      const getTest = await tests.findOne({
         where: {
            id_course: json_course.id,
         },
      });
      const JSON_test = JSON.stringify(getTest);
      const json_test = JSON.parse(JSON_test);

      return {
         json_professor,
         json_course,
         json_courses,
         num_courses,
         json_classes,
         json_test,
      };
   } catch (err) {
      return res.status(400).send({ error: err });
   }
};

// Edit Class in Course
exports.editClass = async (req, res) => {
   try {
      let editedSummary = req.body.postData;

      const editSummary = await classes.findOne({
         where: {
            id: req.params.id_class,
         },
      });

      editSummary.summary = editedSummary;
      await editSummary.save();
      return res.status(201).send('Aula Alterada com Sucesso');
   } catch (err) {
      return res.status(400).send({ error: err });
   }
};

// Add Class to Course
exports.addClass = async (req, res) => {
   try {
      console.log('Been here');
      const addClassData = req.body;

      const addClass = await classes.create({
         title: addClassData.addTitle,
         summary: addClassData.addSummary,
         class_date: addClassData.addDate,
         course_id: req.params.id_course,
      });

      return res.status(201).send('Aula foi Criada com Sucesso');
   } catch (err) {
      console.log(err);
      return res.status(400).send({ error: err });
   }
};

exports.getStudents = async (req, res) => {
   try {
      // Get relevant professor data
      const getProfessor = await professors.findAll({
         where: {
            email: req.email,
         },
         attributes: {
            exclude: ['password', 'createdAt', 'updatedAt'],
         },
      });
      const JSON_professor = JSON.stringify(getProfessor);
      const json_professor = JSON.parse(JSON_professor);

      const getCourses = await courses.findAll({
         where: {
            id_professor: json_professor[0].id,
         },
      });
      const JSON_courses = JSON.stringify(getCourses);
      const json_courses = JSON.parse(JSON_courses);
      const num_courses = json_courses.length;

      const myDict = {};
      const course_id_list = [];
      for (let i = 0; i < num_courses; i++) {
         course_id_list.push(json_courses[i].id);
      }

      const getEnrollements = await enrollements.findAll({
         where: {
            id_course: {
               [Op.or]: course_id_list,
            },
         },
      });
      const JSON_enrollements = JSON.stringify(getEnrollements);
      const json_enrollements = JSON.parse(JSON_enrollements);

      const student_id_list = [];
      for (let j = 0; j < getEnrollements.length; j++) {
         student_id_list.push(json_enrollements[j].id_student);
      }
      let new_student_list = [...new Set(student_id_list)];

      const getStudents = await students.findAll({
         where: {
            id: {
               [Op.or]: new_student_list,
            },
         },
         attributes: {
            exclude: ['password', 'createdAt', 'updatedAt'],
         },
      });
      const JSON_students = JSON.stringify(getStudents);
      const json_students = JSON.parse(JSON_students);

      return {
         json_professor,
         json_courses,
         num_courses,
         json_students,
         json_enrollements,
      };
   } catch (err) {
      return res.status(400).send({ error: err });
   }
};

// Add Course
exports.addCourse = async (req, res) => {
   try {
      let postData = req.body;

      const newCourse = await courses.create({
         type: postData.addName,
         id_professor: postData.professorId,
      });
      return res.status(201).send('Disciplina Adicionada');
   } catch (err) {
      return res.status(400).send({ error: err });
   }
};

// Get Test Professor
exports.getProfessorTest = async (req, res) => {
   try {
      // Get Test
      const getCourse = await courses.findOne({
         where: {
            id: req.params.id_course,
         },
      });
      const JSON_course = JSON.stringify(getCourse);
      const json_course = JSON.parse(JSON_course);

      return {
         json_course,
      };
   } catch (err) {
      return res.status(400).send({ error: err });
   }
};

// Add Test
exports.addTest = async (req, res) => {
   try {
      const post = req.body;
      let today = new Date();
      let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

      // Create Test
      const addTest = await tests.create({
         id_course: req.params.id_course,
         question_1: post.question1,
         question_2: post.question2,
         question_3: post.question3,
         question_4: post.question4,
         test_date: date,
      });
      return res.status(201);
   } catch (err) {
      return res.status(400).send({ error: err });
   }
};

// Get Test to Edit
exports.getTestToEdit = async (req, res) => {
   try {
      const getTest = await tests.findOne({
         where: {
            id: req.params.id_test,
         },
      });
      const JSON_test = JSON.stringify(getTest);
      const json_test = JSON.parse(JSON_test);

      const getCourse = await courses.findOne({
         where: {
            id: json_test.id_course,
         },
      });
      const JSON_course = JSON.stringify(getCourse);
      const json_course = JSON.parse(JSON_course);

      return {
         json_test,
         json_course,
      };
   } catch (err) {
      return res.status(400).send({ error: err });
   }
};

// Edit Test
exports.editTest = async (req, res) => {
   try {
      let editedTest = req.body.post;

      const editTest = await tests.findOne({
         where: {
            id: req.params.id_test,
         },
      });

      editTest.question_1 = editTest.question1;
      editTest.question_2 = editTest.question2;
      editTest.question_3 = editTest.question3;
      editTest.question_4 = editTest.question4;

      await editTest.save();
      return res.status(201).send('Teste Alterado com Sucesso');
   } catch (err) {
      return res.status(400).send({ error: err });
   }
};

// Get All Tests
exports.getAllTests = async (req, res) => {};

// Evaluate Tests
exports.evaluateTest = async (req, res) => {};
