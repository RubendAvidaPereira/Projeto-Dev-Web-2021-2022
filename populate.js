
const path = require('path')
const sequelize = require('sequelize')
const database = require('./db')

async function populate_db() {

    await database.sync()
    /** Models
    * > Classes
    * > Courses
    * > Enrollements
    */
    const classes = require('./models/class')
    const courses = require('./models/course')
    const enrollements = require('./models/enrollment')
    
    /**
     * Desenvolvimento Web,
     * Programacao Orientada a Objetos,
     * Algoritmos e Estruturas de Dados,
     * Gestao de Projetos,
     * Matematica 1,
     * Matematica 2,
     */
    
    const course = await courses.create ({
        type: 'Desenvolvimento Web',
        id_professor: 2,
    })

    const course_2 = await courses.create({
        type: 'Programação Orientada a Objetos',
        id_professor: 2,
    })

    const course_3 = await courses.create({
        type: 'Algoritmos e Estruturas de Dados',
        id_professor: 2,
    })

    const course_4 = await courses.create({
        type: 'Gestão de Projetos',
        id_professor: 1,
    })

    const course_5 = await courses.create({
        type: 'Matemática 1',
        id_professor: 1,
    })

    const course_6 = await courses.create({
        type: 'Matemática 2',
        id_professor: 1
    })

    
    // Aulas de Desenvolvimento Web
    const class_1 = await classes.create ({
        title: 'Introdução a Desenvolvimento Web',
        summary: 'Primeira aula de Desenvolvimento Web, História da Web, A Internet...',
        class_date: '2021-09-01',
        course_id: 1,
    })

    const class_2 = await classes.create ({
        title: 'Introdução ao Node.js',
        summary: 'Node.js, O que é Node.js, ORMs para Node.js',
        class_date: '2021-09-01',
        course_id: 1,
    })

    const class_3 = await classes.create ({
        title: 'Introdução ao Express.js',
        summary: 'Express.js e a sua Utilidade, Modules necessários para a sua implementação',
        class_date: '2021-09-01',
        course_id: 1,
    })

    // Aulas de Programacao Orientada a Objetos
    const class_4 = await classes.create ({
        title: 'Introdução a POO',
        summary: 'Primeira aula de  Programação Orientada a Objetos, História do JAVA, Objetos...',
        class_date: '2021-09-01',
        course_id: 2,
    })

    const class_5 = await classes.create ({
        title: 'Criação de Classes',
        summary: 'Classes, Atributos e Métodos',
        class_date: '2021-09-01',
        course_id: 2,
    })

    // Aula de Algoritmos e Estruturas de Dados
    const class_6 = await classes.create ({
        title: 'Conceitos Básicos de Algoritmos',
        summary: 'Sorting, Ordering e Algoritmia',
        class_date: '2021-09-01',
        course_id: 3,
    })

    // Aula de Gestão de Projetos
    const class_7 = await classes.create ({
        title: 'Introdução à Gestão de Projetos',
        summary: 'O que é Gestão de Projetos?',
        class_date: '2021-09-01',
        course_id: 4,
    })

    
}

populate_db()