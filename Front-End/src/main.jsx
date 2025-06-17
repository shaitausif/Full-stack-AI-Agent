import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthCheck from "./components/AuthCheck.jsx";
import Ticket from "./pages/Ticket.jsx";
import Tickets from "./pages/Tickets.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Admin from "./pages/Admin.jsx";
import { Provider } from 'react-redux';
import { store } from './store/Store';
import { ToastContainer } from "react-toastify";
import { Bounce } from "react-toastify";
import Navbar from "./components/Navbar.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Bounce}
    />
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AuthCheck protected={true}>
              <Navbar/>
              <Tickets />
            </AuthCheck>
          }
        />
        <Route
          path="/ticket/:id"
          element={
            <AuthCheck protected={true}>
              <Navbar/>
              <Ticket />
            </AuthCheck>
          }
        />
        <Route
          path="/login"
          element={
            <AuthCheck protected={false}>
              <Login />
            </AuthCheck>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthCheck protected={false}>
              <SignUp />
            </AuthCheck>
          }
        />
        <Route
          path="/admin"
          element={
            <AuthCheck protected={true}>
              <Navbar/>
              <Admin />
            </AuthCheck>
          }
        />
      </Routes>
    </BrowserRouter>
    </Provider>
  </StrictMode>
);
