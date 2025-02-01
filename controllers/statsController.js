// controllers/statsController.js
const User = require('../model/User');
const Student = require('../model/students');
const Course = require('../model/Course');
const Grade = require('../model/Grades');
const studentController = require('./studentController');

// 📊 Statistiques pour l'administrateur
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await Student.countDocuments();
    const totalCourses = await Course.countDocuments();

    // Moyenne générale des notes
    const averageGrades = await Grade.aggregate([
      { $group: { _id: null, avg: { $avg: "$grade" } } }
    ]);

    // Top 3 des étudiants avec la meilleure moyenne
    const topStudents = await Grade.aggregate([
      { $group: { _id: "$student", avgGrade: { $avg: "$grade" } } },
      { $sort: { avgGrade: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: "students", // Nom de la collection MongoDB des étudiants
          localField: "_id",
          foreignField: "_id",
          as: "studentInfo"
        }
      },
      { $unwind: "$studentInfo" }
    ]);

    // Flop 3 des étudiants avec la plus mauvaise moyenne
    const flopStudents = await Grade.aggregate([
      { $group: { _id: "$student", avgGrade: { $avg: "$grade" } } },
      { $sort: { avgGrade: 1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: "students",
          localField: "_id",
          foreignField: "_id",
          as: "studentInfo"
        }
      },
      { $unwind: "$studentInfo" }
    ]);



    res.json({
      totalUsers,
      totalStudents,
      totalCourses,
      averageGrades: averageGrades[0]?.avg || 0,
      topStudents: topStudents.map(student => ({
        id: student._id,
        firstName: student.studentInfo.firstName,
        lastName: student.studentInfo.lastName,
        avgGrade: student.avgGrade
      })),
      flopStudents: flopStudents.map(student => ({
        id: student._id,
        firstName: student.studentInfo.firstName,
        lastName: student.studentInfo.lastName,
        avgGrade: student.avgGrade
      }))
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};


// 📊 Statistiques pour le service scolarité
exports.getScolariteStats = async (req, res) => {
  try {
    const students = await Student.find().populate('userId', 'displayName email');
    const courses = await Course.find();

    // Statistiques par matière avec moyenne, nombre total de notes, meilleure et pire note
    const gradesByCourse = await Grade.aggregate([
      {
        $group: {
          _id: "$course",
          avgGrade: { $avg: "$grade" },
          totalGrades: { $sum: 1 },
          maxGrade: { $max: "$grade" },
          minGrade: { $min: "$grade" }
        }
      },
      {
        $lookup: {
          from: "courses", // Collection MongoDB des cours
          localField: "_id",
          foreignField: "_id",
          as: "courseInfo"
        }
      },
      { $unwind: "$courseInfo" }
    ]);

    console.log(gradesByCourse);

    res.json({
      totalStudents: students.length,
      totalCourses: courses.length,
      gradesByCourse: gradesByCourse.map(course => ({
        courseId: course._id,
        courseName: course.courseInfo.name,
        avgGrade: course.avgGrade.toFixed(2),
        totalGrades: course.totalGrades,
        maxGrade: course.maxGrade,
        minGrade: course.minGrade
      }))
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


// 📊 Statistiques pour un étudiant spécifique
exports.getStudentStats = async (req, res) => {
  try {
    const userId = req.query.userId;

    // Récupérer l'étudiant correspondant au userId
    //const student = await Student.findOne({ userId }).populate('userId', 'displayName email');

    const student = await studentController.findEtudiant(userId);

    console.log("Etudiant trouvé :", student);

    if (!student) {
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    }

    // Récupérer les notes de l'étudiant
    const grades = await Grade.find({ student: student._id })
      .populate('course', 'name');


    console.log("Notes de l'étudiant :", grades);
    // Récupérer les cours associés à l'étudiant
    const courses = await Course.find({ students: student._id });

    //console.log("Cours associés à l'étudiant :", courses);

    // Calcul de la moyenne générale de l'étudiant
    const averageGrade = await Grade.aggregate([
      { $match: { student: student._id } },
      { $group: { _id: null, avgGrade: { $avg: "$grade" } } }
    ]);

    res.json({
      student,
      courses,
      totalCourses: courses.length, // ✅ Ajout du nombre total de cours
      grades,
      averageGrade: averageGrade[0]?.avgGrade || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

