import { useState } from "react";
import API from "../../api";

export default function CourseForm({ onSuccess }) {
  const [course, setCourse] = useState({
    title: "",
    description: "",
    category: "",
    thumbnail: "",
  });

  const [lessons, setLessons] = useState([
    {
      title: "",
      type: "text",
      textContent: "",
      contentUrl: "",
      order: 1,
      file: null,
    },
  ]);

  const handleCourseChange = (e) =>
    setCourse({ ...course, [e.target.name]: e.target.value });

  const handleLessonChange = (index, field, value) => {
    const newLessons = [...lessons];
    newLessons[index][field] = value;
    setLessons(newLessons);
  };

  const addLesson = () => {
    const nextOrder = lessons.length + 1;
    setLessons([
      ...lessons,
      {
        title: "",
        type: "text",
        textContent: "",
        contentUrl: "",
        order: nextOrder,
        file: null,
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: handle file uploads before posting if needed
      await API.post("/creator/courses", { ...course, lessons });
      onSuccess();
      setCourse({ title: "", description: "", category: "", thumbnail: "" });
      setLessons([
        {
          title: "",
          type: "text",
          textContent: "",
          contentUrl: "",
          order: 1,
          file: null,
        },
      ]);
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  return (
    <div className="container my-4">
      <div className="card shadow">
        <div className="card-body">
          <h3 className="card-title mb-4">Create New Course</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                className="form-control"
                name="title"
                placeholder="Course Title"
                value={course.title}
                onChange={handleCourseChange}
                required
              />
            </div>
            <div className="mb-3">
              <textarea
                className="form-control"
                name="description"
                placeholder="Description"
                value={course.description}
                onChange={handleCourseChange}
                required
              />
            </div>
            <div className="mb-3">
              <input
                className="form-control"
                name="category"
                placeholder="Category"
                value={course.category}
                onChange={handleCourseChange}
              />
            </div>
            <div className="mb-3">
              <input
                className="form-control"
                name="thumbnail"
                placeholder="Thumbnail URL"
                value={course.thumbnail}
                onChange={handleCourseChange}
              />
            </div>

            <h5 className="mt-4">Lessons</h5>
            {lessons.map((lesson, index) => (
              <div key={index} className="card mb-3 border-secondary">
                <div className="card-body">
                  <div className="mb-2">
                    <input
                      className="form-control"
                      placeholder="Lesson Title"
                      value={lesson.title}
                      onChange={(e) =>
                        handleLessonChange(index, "title", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <select
                      className="form-select"
                      value={lesson.type}
                      onChange={(e) =>
                        handleLessonChange(index, "type", e.target.value)
                      }
                    >
                      <option value="text">Text</option>
                      <option value="pdf">PDF</option>
                      <option value="video">Video</option>
                    </select>
                  </div>

                  {lesson.type === "text" && (
                    <div className="mb-2">
                      <textarea
                        className="form-control"
                        placeholder="Text Content"
                        value={lesson.textContent}
                        onChange={(e) =>
                          handleLessonChange(
                            index,
                            "textContent",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>
                  )}

                  {(lesson.type === "pdf" || lesson.type === "video") && (
                    <div className="mb-2">
                      <input
                        className="form-control"
                        type="file"
                        accept={
                          lesson.type === "pdf" ? "application/pdf" : "video/*"
                        }
                        onChange={(e) =>
                          handleLessonChange(index, "file", e.target.files[0])
                        }
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={addLesson}
              >
                + Add Lesson
              </button>
              <button type="submit" className="btn btn-primary">
                Save Course
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
