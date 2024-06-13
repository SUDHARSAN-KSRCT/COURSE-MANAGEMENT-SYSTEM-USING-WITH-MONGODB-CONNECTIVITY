const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');  // Import Mongoose

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://ADMIN:Sudhan2004@sudharsan.lrmktkx.mongodb.net/?retryWrites=true&w=majority&appName=SUDHARSAN', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema for the course
const courseSchema = new mongoose.Schema({
  title: String,
  instructor: String,
});

// Create a Course model based on the schema
const Course = mongoose.model('Course', courseSchema);

// Get all courses
app.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).send('Error fetching courses');
  }
});

// Add a new course
app.post('/courses', async (req, res) => {
  const { title, instructor } = req.body;
  try {
    const newCourse = await Course.create({ title, instructor });
    res.json(newCourse);
  } catch (error) {
    res.status(500).send('Error creating course');
  }
});

// Update an existing course
app.put('/courses/:id', async (req, res) => {
  const id = req.params.id;
  const { title, instructor } = req.body;
  try {
    const updatedCourse = await Course.findByIdAndUpdate(id, { title, instructor }, { new: true });
    res.json(updatedCourse);
  } catch (error) {
    res.status(404).send('Course not found');
  }
});

// Delete a course
app.delete('/courses/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await Course.findByIdAndDelete(id);
    res.send('Course deleted successfully');
  } catch (error) {
    res.status(404).send('Course not found');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
