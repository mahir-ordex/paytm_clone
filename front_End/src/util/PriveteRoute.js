import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'
function PrivateRoute({ children }) {
    const navigate = useNavigate(); 
  const auth= useAuth(); 
  return auth?.user ? children : navigate('/login ')
}

export default PrivateRoute;
