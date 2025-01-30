// controllers/statsController.js
const User = require('../model/User');
const Student = require('../model/students');
const Course = require('../model/Course');
const Grade = require('../model/Grades');

// Statistiques pour l'administrateur
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await Student.countDocuments();
    const totalCourses = await Course.countDocuments();
    const averageGrades = await Grade.aggregate([
      { $group: { _id: null, avg: { $avg: "$score" } } },
    ]);

    res.json({
      totalUsers,
      totalStudents,
      totalCourses,
      averageGrades: averageGrades[0]?.avg || 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Statistiques pour le membre de la scolarité
exports.getScolariteStats = async (req, res) => {
  try {
    const students = await Student.find().populate('userId', 'displayName email');
    const courses = await Course.find();
    const gradesByCourse = await Grade.aggregate([
      {
        $group: {
          _id: "$courseId",
          avg: { $avg: "$score" },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      students,
      courses,
      gradesByCourse,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Statistiques pour l'étudiant
exports.getStudentStats = async (req, res) => {
  try {
    const studentId = req.user.id; // Récupérer l'ID de l'étudiant à partir du token JWT
    const grades = await Grade.find({ studentId }).populate('courseId', 'name');
    const courses = await Course.find({ students: studentId });

    res.json({
      grades,
      courses,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};