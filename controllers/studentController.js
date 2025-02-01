const Student = require('../model/students');
const User = require('../model/User');
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
        const nb = Math.round(Math.random() * 1000000);

        // Step 1: Create the user first
        const user = new User({
            // Assuming you have fields like username, email, password, etc.
            email: req.body.email, // Assuming the email is coming from the request body
            password: req.body.password, // Handle password hashing here if necessary
            // Any other necessary user fields
            googleId: nb,
            role: 'STUDENT'
        });

        const savedUser = await user.save(); // Save the user to the database

        // Step 2: Create the student and assign the user's ID
        const student = new Student({
            ...req.body,   // Spread the request body (it may already have student fields)
            userId: savedUser._id // Assign the newly created user ID to the student
        });

        const savedStudent = await student.save(); // Save the student to the database

        // Step 3: Respond with the saved student object (you can return this if needed)
        return res.status(201).json(savedStudent);

    } catch (err) {
        // Handle any errors
        return res.status(400).json({
            message: "Impossible de créer l'étudiant",
            error: err.message
        });
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
        const { firstName, lastName, age, email, phone, isActive } = req.body;

        // Ensure all required fields are present
        if (!firstName || !lastName || !email || !phone || age === undefined) {
            return res.status(400).json({ message: "Tous les champs sont obligatoires." });
        }

        // Update the student with the provided data
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { firstName, lastName, age, email, phone, isActive },
            { new: true }
        );

        if (!student) {
            return res.status(404).json({ message: "Étudiant non trouvé" });
        }

        res.status(200).json(student);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la mise à jour", error: err.message });
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