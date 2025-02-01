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
exports.edit = async (req, res) => {
    try {
        const { name } = req.body;
        const courseId = req.params.id;

        // Vérifier si le nom du cours est fourni
        if (!name) {
            return res.status(400).json({ message: "Le nom du cours est obligatoire" });
        }

        // Vérifier si un cours avec le même nom existe déjà, à l'exception de celui à modifier
        const existingCourse = await Course.findOne({ name });
        if (existingCourse && existingCourse._id.toString() !== courseId) {
            return res.status(400).json({ message: "Ce cours existe déjà" });
        }

        // Mettre à jour le cours
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { name },
            { new: true } // Renvoie le document mis à jour
        );

        if (!updatedCourse) {
            return res.status(404).json({ message: "Cours non trouvé" });
        }

        res.status(200).json(updatedCourse);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du cours", error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const courseId = req.params.id;

        // Supprimer le cours
        const deletedCourse = await Course.findByIdAndDelete(courseId);

        if (!deletedCourse) {
            return res.status(404).json({ message: "Cours non trouvé" });
        }

        res.status(200).json({ message: "Cours supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la suppression du cours", error: err.message });
    }
};
