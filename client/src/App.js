import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ShiftForm from './components/ShiftForm';

function App() {
  return (<Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shift" element={<ShiftForm />} />
      </Routes>
    </Router>
  );
}

export default App;
