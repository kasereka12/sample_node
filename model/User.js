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
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('User', userSchema);
