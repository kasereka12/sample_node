// controllers/gradeController.js 
const Grade = require('../model/Grades');
const Student = require('../model/students');
const Course = require('../model/Course');

exports.getAll = async (req, res) => {
    try {
        const grades = await Grade.find()
            .populate('student', 'firstName lastName')  // Correction ici
            .populate('course', 'name'); // Ajout pour afficher le nom du cours

        res.status(200).json(grades);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération des notes', error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const { student, course, grade } = req.body;

        // Vérifier si l'étudiant et le cours existent
        const existingStudent = await Student.findById(student);
        const existingCourse = await Course.findById(course);

        if (!existingStudent) {
            return res.status(400).json({ message: 'Student ID is invalid' });
        }
        if (!existingCourse) {
            return res.status(400).json({ message: 'Course ID is invalid' });
        }

        const newGrade = new Grade({
            student,
            course,
            grade
        });

        const savedGrade = await newGrade.save();
        res.status(201).json(savedGrade);
    } catch (err) {
        res.status(400).json({ message: 'Impossible de créer la note', error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const grade = await Grade.findByIdAndDelete(req.params.id);
        if (!grade) {
            return res.status(404).json({ message: 'Note non trouvée' });
        }
        res.status(200).json({ message: 'Note supprimée avec succès' });
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur lors de la suppression', error: err.message });
    }
};

exports.edit = async (req, res) => {
    try {
        const { student, course, grade } = req.body;

        // Vérifier si l'étudiant et le cours existent avant la mise à jour
        if (student) {
            const existingStudent = await Student.findById(student);
            if (!existingStudent) {
                return res.status(400).json({ message: 'Student ID is invalid' });
            }
        }

        if (course) {
            const existingCourse = await Course.findById(course);
            if (!existingCourse) {
                return res.status(400).json({ message: 'Course ID is invalid' });
            }
        }

        const updatedGrade = await Grade.findByIdAndUpdate(
            req.params.id,
            { student, course, grade },
            { new: true }
        );

        if (!updatedGrade) {
            return res.status(404).json({ message: 'Note non trouvée' });
        }

        res.status(200).json(updatedGrade);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour', error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const grade = await Grade.findById(req.params.id)
            .populate('student', 'firstName lastName')  // Correction ici
            .populate('course', 'name'); // Ajout ici

        if (!grade) {
            return res.status(404).json({ message: 'Note non trouvée' });
        }
        res.status(200).json(grade);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération de la note', error: err.message });
    }
};
