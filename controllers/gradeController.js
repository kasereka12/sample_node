
// controllers/gradeController.js 
const Grade = require('../model/Grades');
const mongoose = require('mongoose');
const StudentController = require('./studentController');  // Importe studentController

exports.getAll = async (req, res) => {
    try {
        const grades = await Grade.find().populate('student.id', 'firstName lastName');
        res.status(200).json(grades);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération des notes', error: err });
    }
};

exports.create = async (req, res) => {
    try {
        const { student, course, grade } = req.body;

        // Ensure student ID exists
        if (!student || !student.id) {
            return res.status(400).json({ message: 'Student ID is required' });
        }

        const newGrade = new Grade({
            student: {
                id: student.id
            },
            course,
            grade
        });

        const savedGrade = await newGrade.save();
        res.status(201).json(savedGrade);
    } catch (err) {
        res.status(400).json({ message: 'Impossible de créer la note', error: err });
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
        res.status(500).json({ message: 'Erreur serveur lors de la suppression', error: err });
    }
};

exports.edit = async (req, res) => {
    try {
        const { student, course, grade } = req.body;

        const updatedGrade = await Grade.findByIdAndUpdate(
            req.params.id,
            {
                student: {
                    id: student.id
                },
                course,
                grade
            },
            { new: true }
        );

        if (!updatedGrade) {
            return res.status(404).json({ message: 'Note non trouvée' });
        }

        res.status(200).json(updatedGrade);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour', error: err });
    }
};

exports.getById = async (req, res) => {
    try {
        const userId = req.params.id;

        // Récupérer l'étudiant en utilisant userId
        const student = await StudentController.getStudentById(userId);
        console.log('Étudiant trouvé :', student);

        // Vérifier si l'étudiant existe avant de rechercher les notes
        if (!student) {
            return res.status(404).json({ message: 'Étudiant non trouvé' });
        }

        // Recherche de la note de l'étudiant par son ID
        const grade = await Grade.findOne({ student: student._id }).populate('student', 'firstName lastName');

        // Si aucune note n'est trouvée, renvoyer un tableau vide au lieu de 404
        if (!grade) {
            console.log('Aucune note trouvée pour l\'étudiant');
            return res.status(200).json({ message: 'Aucune note disponible pour cet étudiant' }); // Utilise un message plus descriptif
        }

        // Retourner la note si trouvée
        res.status(200).json(grade);
    } catch (err) {
        console.error('Erreur lors de la récupération de la note:', err);
        res.status(500).json({ message: 'Erreur lors de la récupération de la note', error: err.message });
    }
};

