import { Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Sign_Up from './Components/Sign_Up';
import DeskBoard from './Components/deskBoard';
import './App.css';
import PrivateRoute from './util/PriveteRoute';
import Passbook from './Components/Passbook';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Sign_Up />} />
      <Route path="/" element={<PrivateRoute><DeskBoard /></PrivateRoute>} />
        <Route path="/payment" element={<PrivateRoute><Passbook /></PrivateRoute>} />

    </Routes>
  );
}

export default App;
