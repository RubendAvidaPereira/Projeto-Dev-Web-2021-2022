
const Course = require('./models/course')
const Enrollment = require('./models/enrollment')
const Class = require('./models/class')

async function populateDB(){
    try {
        const as = await Course.create({
            type: 'Arquitetura de Sistemas',
            id_professor: 1   
        });
        
        const aula_2 = await Class.create({
            title: 'Introdução à Arquitetura de Sistemas',
            summary: 'Primeira aula de Arquitetura de Sistemas',
            class_date: '2021-09-01'
        })
        
        const enrollment = await Enrollment.create({
            id_student: 1,
            id_course: 3
        })
        
    } catch (err) {
        console.log(err)
    }
}
populateDB()