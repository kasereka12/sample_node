// controllers/courseController.js
const Course = require('../model/Course');
const Student = require('../model/students');

exports.getAll = async (req, res) => {
    try {
        const courses = await Course.find().populate('students', 'firstName lastName email'); // Affiche les étudiants inscrits au cours
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des matières", error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Le nom du cours est obligatoire" });
        }

        // Vérifier si le cours existe déjà
        const existingCourse = await Course.findOne({ name });
        if (existingCourse) {
            return res.status(400).json({ message: "Ce cours existe déjà" });
        }

        const course = new Course({ name });
        const savedCourse = await course.save();
        res.status(201).json(savedCourse);
    } catch (err) {
        res.status(400).json({ message: "Impossible de créer la matière", error: err.message });
    }
};
