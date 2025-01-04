const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect('mongodb+srv://dbReact:dbReactPassword@cluster0.ol0ko.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Routes
const studentController = require('./controllers/studentController');
const courseController = require('./controllers/courseController');
const gradeController = require('./controllers/gradeController');

// Student routes
app.get('/api/students', studentController.getAll);
app.post('/api/students', studentController.create);
app.delete('/api/students/:id', studentController.delete);
app.put('/api/students/edit/:id', studentController.edit);

// Course routes
app.get('/api/courses', courseController.getAll);
app.post('/api/courses', courseController.create);

// Grade routes
app.get('/api/notes', gradeController.getAll);
app.post('/api/notes', gradeController.create);
app.delete('/api/notes/:id', gradeController.delete);
app.put('/api/notes/:id', gradeController.edit);

const port = process.env.PORT || 8010;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});