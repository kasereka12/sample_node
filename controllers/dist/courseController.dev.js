"use strict";

// controllers/courseController.js
var Course = require('../model/Course');

var Student = require('../model/students');

exports.getAll = function _callee(req, res) {
  var courses;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Course.find().populate('students', 'firstName lastName email'));

        case 3:
          courses = _context.sent;
          // Affiche les étudiants inscrits au cours
          res.status(200).json(courses);
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: "Erreur lors de la récupération des matières",
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
  var name, existingCourse, course, savedCourse;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          name = req.body.name;

          if (name) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "Le nom du cours est obligatoire"
          }));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(Course.findOne({
            name: name
          }));

        case 6:
          existingCourse = _context2.sent;

          if (!existingCourse) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "Ce cours existe déjà"
          }));

        case 9:
          course = new Course({
            name: name
          });
          _context2.next = 12;
          return regeneratorRuntime.awrap(course.save());

        case 12:
          savedCourse = _context2.sent;
          res.status(201).json(savedCourse);
          _context2.next = 19;
          break;

        case 16:
          _context2.prev = 16;
          _context2.t0 = _context2["catch"](0);
          res.status(400).json({
            message: "Impossible de créer la matière",
            error: _context2.t0.message
          });

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 16]]);
};