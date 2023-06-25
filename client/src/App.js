import React, { Component }  from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
} from "react-router-dom";

import Home from "./pages/Home"
import Analytics from "./pages/Analytics"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Profile from './pages/Profile';
import UpdateProfile from './pages/updateProfile'

import "./style.scss"
const Layout = () => {
  return(
    <>
    <Navbar/>
    <Outlet/>
    <Footer/>
    </>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element:<Layout/>,
    children:[
      {
        path:"/",
        element:<Home/>,
      },
      {
        path: "/analytics",
        element: <Analytics></Analytics>,
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
    ]
  },
  {
    path: "/profile/edit/:id",
    element: <UpdateProfile></UpdateProfile>,
  },
  {
    path: "/login",
    element: <Login></Login>,
  },
  {
    path: "/Register",
    element: <Register></Register>,
  }
]);

function App() {
  return (
    <div className="app">
      <div className="container">
        <RouterProvider router={router}></RouterProvider>
      </div>
    </div>
  );
}

export default App;
