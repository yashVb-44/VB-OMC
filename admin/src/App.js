import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles'; // Import ThemeProvider and createTheme
import './App.css';
import HomePage from './Pages/Home/HomePage';
import ErrorPage from './Pages/ErrorPages/ErrorPage';
import LoginPage from './Pages/AuthenticationPages/LoginPage';
import CreateSubAdminPage from './Pages/AuthenticationPages/CreateSubAdminPage';
import EditSubAdminPage from './Pages/AuthenticationPages/EditSubAdminPage';
import Demo from './Components/Demo';
import axios from 'axios';
import AddShippingCharge from './Pages/InnerPages/BackEndSide/Shipping/AddShippingCharge';
import PaymentForm from './Components/Demo/PaymentForm';
import Response from './Components/Demo/Response';
import Cancel from './Components/Demo/Cancel';
import PDFGenerator from './Pages/Demo/PDFGenerator';

let url = process.env.REACT_APP_API_URL

function ScrollToTopOnRouteChange() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;

}

// Create a theme with compact density
const theme = createTheme({
  components: {
    MuiDataGrid: {
      defaultProps: {
        density: 'compact',
      },
      styleOverrides: {
        root: {
          '& .MuiDataGrid-cell': {
            // padding: '4px',
          },
        },
      },
    },
  },
});


function PrivateRoute({ element }) {
  const token = localStorage.getItem('token');

  if (token) {
    return element;
  } else {
    return <Navigate to="/admin/login" />;
  }
}



function App() {


  let adminToken = localStorage.getItem('token');
  const [userRole, setUserRole] = useState('');


  useEffect(() => {

    async function checkAdmin() {
      try {
        const res = await axios.get(`${url}/auth/userName`,
          {
            headers: {
              Authorization: `${adminToken}`,
            },
          }
        )
        if (res?.data?.type === "success") {
          setUserRole(res?.data?.role);
        }
      } catch (error) {
        console.log(error)
      }
    }

    checkAdmin()
  }, [userRole, adminToken]);

  return (
    <Router>
      <ScrollToTopOnRouteChange />
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="*" element={<Navigate to="/admin" />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/error" element={<ErrorPage />} />

          {/* Private routes */}
          <Route
            path="/admin/*"
            element={
              <PrivateRoute
                element={<HomePage />}
              />
            }
          />
          <Route
            path="/admin/addSubAdmin"
            element={
              <PrivateRoute
                element={<CreateSubAdminPage />}
              />
            }
          />
          <Route
            path="/admin/editSubAdmin"
            element={
              <PrivateRoute
                element={<EditSubAdminPage />}
              />
            }
          />
          {/* <Route
            path="/admin/demo"
            element={
              <PrivateRoute
                element={<DrawPolygonMap />}
              />
            }
          /> */}
          {/* <Route
            path="/admin/map/:zone"
            element={
              <PrivateRoute
                element={<AddGeoMap />}
              />
            }
          /> */}
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
