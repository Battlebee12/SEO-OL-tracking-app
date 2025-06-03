import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import OLCheckInOut from "./components/ShiftForm";
// import AdminDashboard from "./AdminDashboard"; // if you’re creating that next

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shift-form" element={<OLCheckInOut />} />
        {/* <Route path="/admin" element={<AdminDashboard />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
