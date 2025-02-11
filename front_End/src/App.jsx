import { Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Sign_Up from './Components/Sign_Up';
import './App.css';
import PrivateRoute from './util/PriveteRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Sign_Up />} />
        {/* <Route path="/main" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/payment" element={<PrivateRoute><PaymentPage /></PrivateRoute>} /> */}

    </Routes>
  );
}

export default App;
