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
    const userId = req.query.userId;


    // Récupérer l'étudiant en utilisant userId
    const student = await Student.findOne({ userId: userId }).populate('userId', 'displayName email');
    // Vérifier si l'étudiant existe
    if (!student) {
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    }

    // Récupérer les grades de l'étudiant en utilisant student._id
    const grades = await Grade.find({ student: student._id }).populate('courseId', 'grade');

    // Récupérer les cours associés à l'étudiant
    const courses = await Course.find({ students: student._id });

    res.json({
      student,
      grades,
      courses,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
