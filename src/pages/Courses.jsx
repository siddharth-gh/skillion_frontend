import { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get("/learner/courses");
        console.log(res)
        setCourses(res.data);
      } catch (err) {
        console.error(err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <p>Loading courses...</p>;

  return (
    <div className="container my-4">
      <h2 className="mb-4">Available Courses</h2>

      {courses.length === 0 && <p>No courses available.</p>}

      <div className="row">
        {courses.map((course) => (
          <div key={course._id} className="col-md-6 mb-4">
            <div className="card h-100 shadow">
              {course.thumbnail && (
                <img
                  src={course.thumbnail}
                  className="card-img-top"
                  alt={course.title}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{course.title}</h5>
                <p className="card-text">{course.description}</p>
                <p>
                  <strong>Category:</strong> {course.category || "N/A"}
                </p>
                <Link
                  to={`/courses/${course._id}`}
                  className="btn btn-primary mt-auto"
                >
                  View Course
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
