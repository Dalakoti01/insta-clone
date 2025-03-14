import { Toaster } from './components/ui/sonner'
import Login from './components/Auth/Login'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import Home from './components/Home'
import Register from './components/Auth/Register'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import Message from './components/Message'
import {io} from "socket.io-client"
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { setSocket } from './store/socketSlice'
import { increamentUnreadMessage, setOnlineUsers } from './store/chatSlice'
import { setLikeNotification, setMessageNotification } from './store/rtnSlice'
import ProtectedRoutes from './components/ProtectedRoutes'
import NotFound from './components/NotFound'
import Search from './components/Search'

function App() {

  const browserRouter = createBrowserRouter([
    {
      path : "/",
      element : <ProtectedRoutes><MainLayout/></ProtectedRoutes>,
      children : [
        {
          path : "/",
          element : <ProtectedRoutes><Home/></ProtectedRoutes>
        },
        {
          path : "/:id/profile",
          element : <ProtectedRoutes><Profile/></ProtectedRoutes>
        },
        {
          path : "/edit/profile",
          element : <ProtectedRoutes><EditProfile/></ProtectedRoutes>
        },
        {
          path : "/message",
          element : <ProtectedRoutes><Message/></ProtectedRoutes>
        },
        {
          path : "/search",
          element : <ProtectedRoutes><Search/></ProtectedRoutes>
        }
      ]
    },
    {
      path : "/login",
      element : <Login/>
    },
    {
      path : "/register",
      element : <Register/>
    },
    {
      path : "*",
      element : <NotFound/>
    }
  ])

  const dispatch = useDispatch()
  const {user} = useSelector(store => store.auth)
  const {socket} = useSelector(store => store.socketio)

  useEffect(() => {
    if(user){
      const socketio = io('http://localhost:8000',{
        query: {
          userId : user?._id
        },
        transports : ['websocket']
      })
      dispatch(setSocket(socketio))

      //listen all the events
      socketio.on('getOnlineUsers',(onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers))
      })

      socketio.on('notification',(notification) => {
        console.log('Received notification:', notification);
        if(notification.type === "like"){
          dispatch(setLikeNotification(notification))
        } else if(notification.type === "message"){
          dispatch(setMessageNotification(notification))
          dispatch(increamentUnreadMessage(notification.userId))
        }
        
      })

      return () => {
        socketio.close()
        dispatch(setSocket(null))
      }
    } else if(socket){
      socket.close()
      dispatch(setSocket(null))
    }
  },[user,dispatch])

  return (
    <>
    <Toaster/>
    <RouterProvider router ={browserRouter}/>
    </>
  )
}

export default App
