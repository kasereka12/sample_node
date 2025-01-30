
// controllers/gradeController.js 
const Grade = require('../model/Grades');

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
