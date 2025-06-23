import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ShiftForm from './components/ShiftForm';
import AdminDashboard from './components/AdminDashboard';
import TotalHoursPage from './components/TotalHours';
import ShiftExceptionsPage from './components/ShiftExceptions';
import PreviousShifts from './components/PreviousShifts';
import UpdateShift from './components/UpdateShift';

function App() {
  return (<Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pshifts" element={<PreviousShifts/>} />
        <Route path="/shift" element={<ShiftForm />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/total-hours" element={<TotalHoursPage />} />
        <Route path="/admin/shift-exceptions" element={<ShiftExceptionsPage />} />
        <Route path="/admin/update-shift" element={<UpdateShift />} />

      </Routes>
    </Router>
  );
}

export default App;