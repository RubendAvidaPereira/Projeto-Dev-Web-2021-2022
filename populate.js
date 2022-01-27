const path = require('path');
const sequelize = require('sequelize');
const database = require('./db');
const tests = require('./models/test');

async function populate_db() {
   await database.sync();
   /** Models
    * > Classes
    * > Courses
    * > Enrollements
    * > Tests
    */
   const classes = require('./models/class');
   const courses = require('./models/course');
   const enrollements = require('./models/enrollment');

   /**
    * Desenvolvimento Web,
    * Programacao Orientada a Objetos,
    * Algoritmos e Estruturas de Dados,
    * Gestao de Projetos,
    * Matematica 1,
    */

   const course = await courses.create({
      type: 'Desenvolvimento Web',
      id_professor: 2,
   });

   const course_2 = await courses.create({
      type: 'Programação Orientada a Objetos',
      id_professor: 2,
   });

   const course_3 = await courses.create({
      type: 'Algoritmos e Estruturas de Dados',
      id_professor: 2,
   });

   const course_4 = await courses.create({
      type: 'Gestão de Projetos',
      id_professor: 1,
   });

   const course_5 = await courses.create({
      type: 'Matemática 1',
      id_professor: 1,
   });

   // Aulas de Desenvolvimento Web
   const class_1 = await classes.create({
      title: 'Introdução a Desenvolvimento Web',
      summary: 'Primeira aula de Desenvolvimento Web, História da Web, A Internet...',
      class_date: '2021-09-01',
      course_id: 1,
   });

   const class_2 = await classes.create({
      title: 'Introdução ao Node.js',
      summary: 'Node.js, O que é Node.js, ORMs para Node.js',
      class_date: '2021-09-01',
      course_id: 1,
   });

   const class_3 = await classes.create({
      title: 'Introdução ao Express.js',
      summary: 'Express.js e a sua Utilidade, Modules necessários para a sua implementação',
      class_date: '2021-09-01',
      course_id: 1,
   });

   // Aulas de Programacao Orientada a Objetos
   const class_4 = await classes.create({
      title: 'Introdução a POO',
      summary: 'Primeira aula de  Programação Orientada a Objetos, História do JAVA, Objetos...',
      class_date: '2021-09-01',
      course_id: 2,
   });

   const class_5 = await classes.create({
      title: 'Criação de Classes',
      summary: 'Classes, Atributos e Métodos',
      class_date: '2021-09-01',
      course_id: 2,
   });

   // Aula de Algoritmos e Estruturas de Dados
   const class_6 = await classes.create({
      title: 'Conceitos Básicos de Algoritmos',
      summary: 'Sorting, Ordering e Algoritmia',
      class_date: '2021-09-01',
      course_id: 3,
   });

   // Aula de Gestao de Projetos
   const class_7 = await classes.create({
      title: 'Introdução à Gestão de Projetos',
      summary: 'O que é Gestão de Projetos?',
      class_date: '2021-09-01',
      course_id: 4,
   });

   // Aula de Matematica 1
   const class_8 = await classes.create({
      title: 'Introdução à Matemática 1',
      summary: 'O que é uma Funcção?',
      class_date: '2021-09-01',
      course_id: 5,
   });

   // Inscricoes
   const enrollement_1 = await enrollements.create({
      id_student: 1,
      id_course: 1,
   });

   const enrollement_2 = await enrollements.create({
      id_student: 1,
      id_course: 2,
   });

   // Testes
   // Desenvolvimento Web
   const test_1 = await tests.create({
      id_course: 1,
      test_date: '2021-12-22',
      question_1: 'Defina Javascript.',
      question_2: 'Defina HTML.',
      question_3: 'Defina CSS.',
      question_4: 'Explique o objetivo de Desenvolvimento Web.',
   });

   // Programação Orientada a Objetos
   const test_2 = await tests.create({
      id_course: 2,
      test_date: '2021-12-22',
      question_1: 'Defina Programação.',
      question_2: 'Defina Objeto.',
      question_3: 'Defina Classe.',
      question_4: 'Explique o que é uma instância de um objeto.',
   });

   // Algoritmos e Estruturas de Dados
   const test_3 = await tests.create({
      id_course: 3,
      test_date: '2021-12-22',
      question_1: 'Defina Algoritmo.',
      question_2: 'Defina Estrutura de Dados.',
      question_3:
         'Escreva um pseudo-código para um algoritmo capaz de imprimir os primeiros 10 números primos.',
      question_4: 'Explique o objetivo Algoritmos aplicados a Estruturas de Dados.',
   });

   // Gestao de Projetos
   const test_4 = await tests.create({
      id_course: 4,
      test_date: '2021-12-22',
      question_1: 'Defina Gestão de Projetos.',
      question_2: 'Defina as principais fases de um projeto.',
      question_3: 'Explique no que consiste a fase de desenvolvimento de um projeto.',
      question_4: 'Apresente um plano para um projeto de um website.',
   });

   // Matematica 1
   const test_5 = await tests.create({
      id_course: 5,
      test_date: '2021-12-22',
      question_1: 'Calcule f(x).',
      question_2: 'Calcule g(x).',
      question_3: 'Desenhe i(x).',
      question_4: 'Calcule o Determinante da Matriz A.',
   });
}

populate_db();
