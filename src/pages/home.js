import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/home.css";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ id: '', title: '', instructor: '' });
  const [editCourseId, setEditCourseId] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/courses', newCourse);
      setCourses([...courses, response.data]);
      setNewCourse({ id: '', title: '', instructor: '' });
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/courses/${id}`);
      setCourses(courses.filter(course => course.id !== id));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleEdit = (id) => {
    setEditCourseId(id);
  };

  const handleUpdate = async (course) => {
    try {
      await axios.put(`http://localhost:5000/courses/${course.id}`, {
        title: course.title,
        instructor: course.instructor
      });
      setEditCourseId(null);
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  return (
    <div className='container'>
      <h1>Course Management System 📚</h1>
      <div>
        <h2>Add Course</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="id"
            placeholder="ID"
            value={newCourse.id}
            onChange={handleInputChange}
            className="input-field"
          />
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newCourse.title}
            onChange={handleInputChange}
            className="input-field"
          />
          <input
            type="text"
            name="instructor"
            placeholder="Instructor"
            value={newCourse.instructor}
            onChange={handleInputChange}
            className="input-field"
          />
          <button type="submit" className="submit-button">Add Course</button>
        </form>
        <div style={{border: "1.5px solid white"}}></div>
      </div>
      <div className='course-list'>
        <h2>Courses</h2>
        <ul>
          {courses.map(course => (
            <li key={course.id} className="course-item">
              {editCourseId === course.id ? (
                <>
                  <input
                    type="text"
                    value={course.title}
                    onChange={(e) => setCourses(courses.map(c => c.id === course.id ? { ...c, title: e.target.value } : c))}
                  />
                  <input
                    type="text"
                    value={course.instructor}
                    onChange={(e) => setCourses(courses.map(c => c.id === course.id ? { ...c, instructor: e.target.value } : c))}
                  />
                  <button onClick={() => handleUpdate(course)}>Update</button>
                </>
              ) : (
                <>
                  <strong>{course.title}</strong> - Instructor: {course.instructor}
                  <button onClick={() => handleDelete(course.id)} className="delete-button">Delete Course</button>
                  <button onClick={() => handleEdit(course.id)}>Edit</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;