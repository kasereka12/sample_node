"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Student = require('../model/students');

var User = require('../model/User');

exports.getAll = function _callee(req, res) {
  var students;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Student.find());

        case 3:
          students = _context.sent;
          res.status(200).json(students);
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: "Erreur lors de la récupération des étudiants",
            error: _context.t0
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.findEtudiant = function _callee2(userId) {
  var student;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Student.findOne({
            userId: userId
          }));

        case 3:
          student = _context2.sent;
          return _context2.abrupt("return", student);

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          throw new Error('Erreur lors de la recherche de l\'étudiant');

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // Dans studentController.js


exports.creategoogle = function _callee3(studentData) {
  var student, savedStudent;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          student = new Student(studentData);
          _context3.next = 4;
          return regeneratorRuntime.awrap(student.save());

        case 4:
          savedStudent = _context3.sent;
          return _context3.abrupt("return", savedStudent);

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          throw new Error('Impossible de créer l\'étudiant', _context3.t0);

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.create = function _callee4(req, res) {
  var nb, user, savedUser, student, savedStudent;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          nb = Math.round(Math.random() * 1000000); // Step 1: Create the user first

          user = new User({
            // Assuming you have fields like username, email, password, etc.
            email: req.body.email,
            // Assuming the email is coming from the request body
            password: req.body.password,
            // Handle password hashing here if necessary
            // Any other necessary user fields
            googleId: nb,
            role: 'STUDENT'
          });
          _context4.next = 5;
          return regeneratorRuntime.awrap(user.save());

        case 5:
          savedUser = _context4.sent;
          // Save the user to the database
          // Step 2: Create the student and assign the user's ID
          student = new Student(_objectSpread({}, req.body, {
            // Spread the request body (it may already have student fields)
            userId: savedUser._id // Assign the newly created user ID to the student

          }));
          _context4.next = 9;
          return regeneratorRuntime.awrap(student.save());

        case 9:
          savedStudent = _context4.sent;
          return _context4.abrupt("return", res.status(201).json(savedStudent));

        case 13:
          _context4.prev = 13;
          _context4.t0 = _context4["catch"](0);
          return _context4.abrupt("return", res.status(400).json({
            message: "Impossible de créer l'étudiant",
            error: _context4.t0.message
          }));

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

exports["delete"] = function _callee5(req, res) {
  var student;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Student.findByIdAndDelete(req.params.id));

        case 3:
          student = _context5.sent;

          if (student) {
            _context5.next = 6;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: 'Étudiant non trouvé'
          }));

        case 6:
          res.status(200).json({
            message: 'Étudiant supprimé avec succès'
          });
          _context5.next = 12;
          break;

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          res.status(500).json({
            message: 'Erreur serveur lors de la suppression',
            error: _context5.t0
          });

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.edit = function _callee6(req, res) {
  var _req$body, firstName, lastName, age, email, telephone, isActive, student;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _req$body = req.body, firstName = _req$body.firstName, lastName = _req$body.lastName, age = _req$body.age, email = _req$body.email, telephone = _req$body.telephone, isActive = _req$body.isActive;

          if (!(!firstName || !lastName || !email || !telephone || age === undefined)) {
            _context6.next = 4;
            break;
          }

          return _context6.abrupt("return", res.status(400).json({
            message: "Tous les champs sont obligatoires."
          }));

        case 4:
          _context6.next = 6;
          return regeneratorRuntime.awrap(Student.findByIdAndUpdate(req.params.id, {
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            telephone: telephone,
            isActive: isActive
          }, {
            "new": true
          }));

        case 6:
          student = _context6.sent;

          if (student) {
            _context6.next = 9;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            message: "Étudiant non trouvé"
          }));

        case 9:
          res.status(200).json(student);
          _context6.next = 15;
          break;

        case 12:
          _context6.prev = 12;
          _context6.t0 = _context6["catch"](0);
          res.status(500).json({
            message: "Erreur lors de la mise à jour",
            error: _context6.t0.message
          });

        case 15:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

exports.getStudentById = function _callee7(userId) {
  var student;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(Student.findOne({
            userId: userId
          }).populate('userId', 'displayName email'));

        case 3:
          student = _context7.sent;
          return _context7.abrupt("return", student);

        case 7:
          _context7.prev = 7;
          _context7.t0 = _context7["catch"](0);
          throw new Error('Erreur lors de la récupération de l\'étudiant : ' + _context7.t0.message);

        case 10:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 7]]);
};