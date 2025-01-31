"use strict";

// controllers/gradeController.js 
var Grade = require('../model/Grades');

var Student = require('../model/students');

var Course = require('../model/Course');

exports.getAll = function _callee(req, res) {
  var grades;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Grade.find().populate('student', 'firstName lastName') // Correction ici
          .populate('course', 'name'));

        case 3:
          grades = _context.sent;
          // Ajout pour afficher le nom du cours
          res.status(200).json(grades);
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: 'Erreur lors de la récupération des notes',
            error: _context.t0.message
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.create = function _callee2(req, res) {
  var _req$body, student, course, grade, existingStudent, existingCourse, newGrade, savedGrade;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body = req.body, student = _req$body.student, course = _req$body.course, grade = _req$body.grade; // Vérifier si l'étudiant et le cours existent

          _context2.next = 4;
          return regeneratorRuntime.awrap(Student.findById(student));

        case 4:
          existingStudent = _context2.sent;
          _context2.next = 7;
          return regeneratorRuntime.awrap(Course.findById(course));

        case 7:
          existingCourse = _context2.sent;

          if (existingStudent) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: 'Student ID is invalid'
          }));

        case 10:
          if (existingCourse) {
            _context2.next = 12;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: 'Course ID is invalid'
          }));

        case 12:
          newGrade = new Grade({
            student: student,
            course: course,
            grade: grade
          });
          _context2.next = 15;
          return regeneratorRuntime.awrap(newGrade.save());

        case 15:
          savedGrade = _context2.sent;
          res.status(201).json(savedGrade);
          _context2.next = 22;
          break;

        case 19:
          _context2.prev = 19;
          _context2.t0 = _context2["catch"](0);
          res.status(400).json({
            message: 'Impossible de créer la note',
            error: _context2.t0.message
          });

        case 22:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

exports["delete"] = function _callee3(req, res) {
  var grade;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Grade.findByIdAndDelete(req.params.id));

        case 3:
          grade = _context3.sent;

          if (grade) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: 'Note non trouvée'
          }));

        case 6:
          res.status(200).json({
            message: 'Note supprimée avec succès'
          });
          _context3.next = 12;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            message: 'Erreur serveur lors de la suppression',
            error: _context3.t0.message
          });

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.edit = function _callee4(req, res) {
  var _req$body2, student, course, grade, existingStudent, existingCourse, updatedGrade;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _req$body2 = req.body, student = _req$body2.student, course = _req$body2.course, grade = _req$body2.grade; // Vérifier si l'étudiant et le cours existent avant la mise à jour

          if (!student) {
            _context4.next = 8;
            break;
          }

          _context4.next = 5;
          return regeneratorRuntime.awrap(Student.findById(student));

        case 5:
          existingStudent = _context4.sent;

          if (existingStudent) {
            _context4.next = 8;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            message: 'Student ID is invalid'
          }));

        case 8:
          if (!course) {
            _context4.next = 14;
            break;
          }

          _context4.next = 11;
          return regeneratorRuntime.awrap(Course.findById(course));

        case 11:
          existingCourse = _context4.sent;

          if (existingCourse) {
            _context4.next = 14;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            message: 'Course ID is invalid'
          }));

        case 14:
          _context4.next = 16;
          return regeneratorRuntime.awrap(Grade.findByIdAndUpdate(req.params.id, {
            student: student,
            course: course,
            grade: grade
          }, {
            "new": true
          }));

        case 16:
          updatedGrade = _context4.sent;

          if (updatedGrade) {
            _context4.next = 19;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: 'Note non trouvée'
          }));

        case 19:
          res.status(200).json(updatedGrade);
          _context4.next = 25;
          break;

        case 22:
          _context4.prev = 22;
          _context4.t0 = _context4["catch"](0);
          res.status(500).json({
            message: 'Erreur lors de la mise à jour',
            error: _context4.t0.message
          });

        case 25:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 22]]);
};

exports.getById = function _callee5(req, res) {
  var grade;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Grade.findById(req.params.id).populate('student', 'firstName lastName') // Correction ici
          .populate('course', 'name'));

        case 3:
          grade = _context5.sent;

          if (grade) {
            _context5.next = 6;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: 'Note non trouvée'
          }));

        case 6:
          res.status(200).json(grade);
          _context5.next = 12;
          break;

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          res.status(500).json({
            message: 'Erreur lors de la récupération de la note',
            error: _context5.t0.message
          });

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 9]]);
};