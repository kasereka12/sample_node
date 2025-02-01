const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        default: "",
        unique: true,
        sparse: true // Permet d'éviter les conflits sur les valeurs vides
    },
    displayName: String,
    email: { type: String, unique: true },
    picture: String,
    role: {
        type: String,
        enum: ['ADMIN', 'SCOLARITE', 'STUDENT'],
        default: 'STUDENT'
    },
    password: {
        type: String
    }
});

// Middleware pour hacher le mot de passe avant de l'enregistrer
userSchema.pre('save', async function (next) {
    try {
        if (this.isModified('password') && this.password) {  // On vérifie que le mot de passe existe et a été modifié
            this.password = await bcrypt.hash(this.password, 10); // Hachage du mot de passe avec un salt de 10 tours
        }
        next();
    } catch (error) {
        next(error); // Si erreur, on passe à l'erreur de middleware
    }
});

module.exports = mongoose.model('User', userSchema);
