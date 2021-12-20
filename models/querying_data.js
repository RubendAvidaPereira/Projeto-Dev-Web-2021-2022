async function getEnrollments(student_id){
    const enrollments = require('../models/enrollment')
    const enroll = await enrollments.findAll({
        where: {
            id_student: student_id
        }
    })
    console.log(enroll)
    return enroll
}

getEnrollments(1)

const courses = require('./course')
async function getData() {
    await courses.findAll({
        where: {
            id: 1,
        }
    }).then((response) => {
        console.log(response)
    })
}

getData()
