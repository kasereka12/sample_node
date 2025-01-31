const Student = require('../model/students');

exports.getAll = async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des étudiants", error: err });
    }
};
exports.findEtudiant = async (userId) => {
    try {
        // Recherche un étudiant avec un userId spécifique
        const student = await Student.findOne({ userId });
        return student; // Retourne l'étudiant trouvé ou null si aucun étudiant n'est trouvé
    } catch (error) {
        throw new Error('Erreur lors de la recherche de l\'étudiant');
    }
};

// Dans studentController.js

exports.creategoogle = async (studentData) => {
    try {
        const student = new Student(studentData);
        const savedStudent = await student.save();
        return savedStudent;
    } catch (err) {
        throw new Error('Impossible de créer l\'étudiant', err);
    }
};


exports.create = async (req, res) => {
    try {
        const student = new Student(req.body);
        const savedStudent = await student.save();
        //res.status(201).json(savedStudent);
        return savedStudent;
    } catch (err) {
        res.status(400).json({ message: "Impossible de créer l'étudiant", error: err });
    }
};

exports.delete = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Étudiant non trouvé' });
        }
        res.status(200).json({ message: 'Étudiant supprimé avec succès' });
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur lors de la suppression', error: err });
    }
};

exports.edit = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!student) {
            return res.status(404).json({ message: 'Étudiant non trouvé' });
        }
        res.status(200).json(student);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la mise à jour", error: err });
    }
};
exports.getStudentById = async (userId) => {
    try {
        const student = await Student.findOne({ userId }).populate('userId', 'displayName email');
        return student;
    } catch (error) {
        throw new Error('Erreur lors de la récupération de l\'étudiant : ' + error.message);
    }
};