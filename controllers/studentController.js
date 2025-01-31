const Student = require('../model/students');

exports.getAll = async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des étudiants", error: err });
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