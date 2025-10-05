import { useEffect, useState } from "react";
import API from "../../api";
import { Link } from "react-router-dom";
import CourseForm from "./CourseForm";

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await API.get("/creator/courses");
      setCourses(res.data);
    } catch (err) {
      console.error(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const deleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await API.delete(`/creator/courses/${id}`);
      fetchCourses();
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">Creator Dashboard</h2>

      <button
        className={`btn ${showForm ? "btn-secondary" : "btn-primary"} mb-4`}
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "Create New Course"}
      </button>

      {showForm && <CourseForm onSuccess={() => { fetchCourses(); setShowForm(false); }} />}

      {loading ? (
        <p>Loading courses...</p>
      ) : courses.length === 0 ? (
        <p>No courses created yet.</p>
      ) : (
        courses.map((course) => (
          <div key={course._id} className="card mb-4 shadow">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">{course.title}</h5>
              <div>
                <Link to={`/creator/course/${course._id}`} className="btn btn-warning btn-sm me-2">
                  Edit
                </Link>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteCourse(course._id)}
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="card-body">
              <p className="card-text">{course.description}</p>
              <p>
                <strong>Category:</strong> {course.category || "N/A"}
              </p>

              <h6>Lessons:</h6>
              {course.lessons?.length === 0 ? (
                <p>No lessons added yet.</p>
              ) : (
                course.lessons.map((lesson, index) => (
                  <div key={index} className="card mb-2 border-secondary">
                    <div className="card-body">
                      <h6 className="card-title">
                        {index + 1}. {lesson.title}
                      </h6>
                      <p>
                        <strong>Type:</strong> {lesson.type}
                      </p>
                      {lesson.type === "text" && <p>{lesson.textContent}</p>}
                      {lesson.type === "pdf" && <p>PDF Uploaded</p>}
                      {lesson.type === "video" && <p>Video Uploaded</p>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
