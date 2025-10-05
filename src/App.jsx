import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import Dashboard from "./pages/Creator/Dashboard";
import ReviewCourses from "./pages/admin/ReviewCourses";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/creator/dashboard" element={<Dashboard />} />
        <Route path="/admin/review/courses" element={<ReviewCourses />} />

        <Route path="/" element={<Courses />} />
      </Routes>
    </Router>
  );
}

export default App;
