import { Children, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import Profile from './pages/Profile.jsx'
import EditProfile from './pages/EditProfile.jsx'
import UserVideos from './pages/UserVideos.jsx'
import Upload from './pages/Upload.jsx'
import WatchHistory from './pages/WatchHistory.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import store from './store/store.js' 
import { Provider } from 'react-redux'


import { createBrowserRouter, Route, RouterProvider } from 'react-router-dom'
import AuthLayout from './components/AuthLayout.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,

    children: [

      {
        path: "/",  //Home
        element: <Home/>
      },

      {
        path: "/profile",  //Profile
        element: 
        <AuthLayout authentication = {true}>
          <Profile/>,
        </AuthLayout>
      },

      {
        path: "/edit-profile", //edit profile
        element:
        <AuthLayout authentication = {true}>
          <EditProfile/>
        </AuthLayout>
      },

      {
        path: "user-videos",  //user videos
        element: 
        <AuthLayout authentication = {true}>
          <UserVideos/>
        </AuthLayout>
      },

      {
        path: "/upload",  //upload
        element:
        <AuthLayout authentication = {true}>
          <Upload/>
        </AuthLayout>
      },

      {
        path: "/watch-history",  //watch history
        element:
        <AuthLayout authentication = {false}>
          <WatchHistory/>
        </AuthLayout>
      }
      


    ]

  },

  {
    path: "/login",
    element:
    <AuthLayout authentication = {false}>
      <Login/>
    </AuthLayout>
  },

  {
    path: "/signup",
    element:
    <AuthLayout authentication = {false}>
      <Signup/>
    </AuthLayout>
  }
])

createRoot(document.getElementById('root')).render(

  <Provider store={store}>
    <RouterProvider router={router}/>
  </Provider>

)
