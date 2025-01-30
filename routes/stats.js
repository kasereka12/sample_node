// routes/stats.js
const express = require('express');
const statsController = require('../controllers/statsController');
// const checkRole = require('../middleware/checkRole'); // Commenté ou supprimé

const router = express.Router();

// Statistiques pour l'administrateur
router.get('/admin/stats', statsController.getAdminStats); // checkRole('ADMIN') supprimé

// Statistiques pour le membre de la scolarité
router.get('/scolarite/stats', statsController.getScolariteStats); // checkRole('SCOLARITE') supprimé

// Statistiques pour l'étudiant
router.get('/student/stats', statsController.getStudentStats); // checkRole('STUDENT') supprimé

module.exports = router;