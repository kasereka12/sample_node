require('dotenv').config();
const User = require('./model/User');
//const Student = require('./model/Student');
const jwt = require('jsonwebtoken');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Ajout explicite des méthodes
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Clé secrète pour JWT - visible ici, à déplacer dans .env une fois que ça marche
const JWT_SECRET = "d6d547ac2280a7170d46d15b5255281edf65325d12c30665f2c27f93b1b13faedbe4e7d1bc66ea00b1f85e2308aa6c1c38d713c665fc861df6e299b25cf82da1";  // À mettre dans .env en production

// Fonction pour créer un JWT
const createToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            name: user.displayName
        },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

// Middleware pour les sessions
app.use(session({
    secret: "secretcode",  // À déplacer dans .env
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,  // Désactive le "Secure" pour le développement local HTTP
        httpOnly: true,
        sameSite: 'None'  // Nécessaire pour les cookies cross-origin
    },
}));


app.use(passport.initialize());
app.use(passport.session());

// Stratégie Google OAuth avec Passport
passport.use(new GoogleStrategy({
    clientID: "437766875771-ocsr5v4rhtfkevql5q66u8if7r71jq5m.apps.googleusercontent.com", // À déplacer dans .env
    clientSecret: "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",  // À déplacer dans .env
    callbackURL: "http://localhost:8010/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            user = await User.create({
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value,
                picture: profile.photos[0].value,
                role: 'STUDENT'  // Par défaut, tous les utilisateurs auront le rôle "STUDENT"
            });
        }

        done(null, user);
    } catch (error) {
        done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

// Middleware CORS


// Routes
app.get("/", (req, res) => {
    res.send("<a href='/auth/google'>Login with Google</a>");
});

app.get("/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    async (req, res) => {
        try {
            // Créer le token JWT
            const token = createToken(req.user);

            // Rediriger vers React avec le token et les infos utilisateur
            const userInfo = {
                id: req.user._id,
                name: req.user.displayName,
                email: req.user.email,
                picture: req.user.picture
            };

            // Encoder les données en base64 pour une transmission sécurisée
            const encodedToken = Buffer.from(token).toString('base64');
            const encodedUser = Buffer.from(JSON.stringify(userInfo)).toString('base64');

            res.redirect(`http://localhost:5173/admin/?token=${encodedToken}&user=${encodedUser}`);
        } catch (error) {
            // Afficher l'erreur dans la console pour le débogage
            console.error("Error during authentication callback:", error);

            // Ajouter l'erreur dans la redirection pour plus d'informations
            const errorMessage = encodeURIComponent(error.message || "Unknown error");
            res.redirect(`http://localhost:5173/login?error=${errorMessage}`);
        }
    }
);

// Endpoint pour vérifier le token
app.get("/api/verify-token", async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            user: {
                id: user._id,
                name: user.displayName,
                email: user.email,
                picture: user.picture
            }
        });
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
});

// Route de déconnexion
app.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: "Erreur lors de la déconnexion." });
        }
        res.clearCookie('connect.sid');  // Si tu utilises des cookies pour la session
        res.redirect("/");  // Redirige vers la page d'accueil après la déconnexion
    });
});
app.use(express.json());
const bcrypt = require('bcrypt'); // Assurez-vous d'importer bcrypt
app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validation des entrées
        if (!email || !password) {
            return res.status(400).json({ message: "Email et mot de passe requis" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }

        // Simplification de la création du token
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
                name: user.displayName
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Réponse avec les données utilisateur
        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.displayName,
                picture: user.picture
            }
        });

    } catch (error) {
        console.error("Erreur de connexion:", error);
        res.status(500).json({
            message: "Erreur serveur interne",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
// Routes
const studentController = require('./controllers/studentController');
const courseController = require('./controllers/courseController');
const gradeController = require('./controllers/gradeController');
app.post("/auth/register", async (req, res) => {
    const { email, password, username, role, firstName, lastName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "L'email est déjà utilisé" });
    }

    try {
        const nb = Math.round(Math.random() * 1000000);

        // Créer un nouvel utilisateur
        const newUser = new User({
            username,
            email,
            googleId: nb,
            password: password,
            role: role || 'STUDENT',
        });

        // Sauvegarder l'utilisateur dans la base de données
        await newUser.save();

        // Si le rôle est 'STUDENT', créer un étudiant
        if (role === 'STUDENT') {
            // Utilisation du contrôleur pour créer un étudiant
            const studentData = {
                firstName,
                lastName,
            };

            // Appel de la méthode create du contrôleur StudentController pour enregistrer l'étudiant
            await studentController.create({ body: studentData }, res);
        }
        const token = createToken(newUser);

        res.status(201).json({
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error("Erreur d'inscription:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
});

app.get("/auth/logout", (req, res) => {
    // Vérifier si une réponse a déjà été envoyée
    if (res.headersSent) {
        return;
    }

    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: "Erreur lors de la déconnexion." });
        }

        // Effacer les cookies de session
        res.clearCookie('connect.sid');  // Si tu utilises des cookies pour la session

        // Si tu utilises aussi un cookie JWT ou un autre cookie pour l'authentification
        res.clearCookie('token');  // Si tu utilises un cookie JWT pour l'authentification

        // Répondre après avoir supprimé les cookies
        res.json({ message: "Déconnexion réussie" });
    });
});


// MongoDB connection
mongoose.connect("mongodb+srv://dbReact:dbReactPassword@cluster0.ol0ko.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Middleware pour vérifier le rôle
const checkRole = (role) => {
    return (req, res, next) => {
        if (req.isAuthenticated() && req.user.role === role) {
            return next();  // L'utilisateur a le bon rôle, on passe à la route suivante
        }
        return res.status(403).json({ message: 'Access denied. Insufficient role.' });  // Si l'utilisateur n'a pas le rôle requis
    };
};

// Exemple d'utilisation
app.get('/admin', checkRole('ADMIN'), (req, res) => {
    res.send('Welcome to the Admin page');
});

app.get('/scolarite', checkRole('SCOLARITE'), (req, res) => {
    res.send('Welcome to the Scolarité page');
});

app.get('/student', checkRole('STUDENT'), (req, res) => {
    res.send('Welcome to your student profile');
});


//Users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);  // Renvoie la réponse au format JSON
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Student routes
app.get('/api/students', studentController.getAll);
app.post('/api/students', studentController.create);
app.delete('/api/students/:id', studentController.delete);
app.put('/api/students/edit/:id', studentController.edit);

// Course routes
app.get('/api/courses', courseController.getAll);
app.post('/api/courses', courseController.create);

// Grade routes
app.get('/api/grades', gradeController.getAll);
app.post('/api/grades', gradeController.create);
app.delete('/api/grades/:id', gradeController.delete);
app.put('/api/grades/:id', gradeController.edit);
// Démarrage du serveur
const port = process.env.PORT || 8010;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
