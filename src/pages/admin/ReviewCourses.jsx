import { useEffect, useState } from "react";
import API from "../../api";

export default function ReviewCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingCourses = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/courses/review/courses");
      setCourses(res.data);
    } catch (err) {
      console.error(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCourses();
  }, []);

  const handleAction = async (courseId, action) => {
    try {
      await API.patch(`/admin/courses/${courseId}/${action}`);
      fetchPendingCourses(); // refresh list
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  if (loading) return <p>Loading pending courses...</p>;
  if (courses.length === 0) return <p>No pending courses.</p>;

  return (
    <div>
      <h2>Admin: Review Pending Courses</h2>
      {courses.map((course) => (
        <div
          key={course._id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <p>
            <strong>Creator:</strong> {course.creator.name} (
            {course.creator.email})
          </p>
          <p>
            <strong>Lessons:</strong> {course.lessons.length}
          </p>
          <button
            onClick={() => handleAction(course._id, "approve")}
            style={{ marginRight: "10px" }}
          >
            Approve
          </button>
          <button onClick={() => handleAction(course._id, "reject")}>
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}
