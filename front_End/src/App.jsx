import { Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Sign_Up from './Pages/Sign_Up';
import DeskBoard from './Pages/deskBoard';
import './App.css';
import PrivateRoute from './util/PrivateRoute';
import Passbook from './Pages/Passbook';
import Profile from './Pages/Profile';
import Message from './Pages/Message';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Sign_Up />} />
      <Route path="/" element={<PrivateRoute><DeskBoard /></PrivateRoute>} />
        <Route path="/payment" element={<PrivateRoute><Passbook /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/message/:userName" element={<PrivateRoute><Message /></PrivateRoute>} />

    </Routes>
  );
}

export default App;
