
// controllers/courseController.js
const Course = require('../model/Course');

exports.getAll = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des matières", error: err });
    }
};

exports.create = async (req, res) => {
    try {
        const course = new Course({ name: req.body.name });
        const savedCourse = await course.save();
        res.status(201).json(savedCourse);
    } catch (err) {
        res.status(400).json({ message: "Impossible de créer la matière", error: err });
    }
};


