import { useEffect } from 'react'
import './App.css'
import api from './utils/axiosConfig'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import PublicRoute from './components/Auth/PublicRoute'
import Login from '@/pages/Login'
import Home from '@/pages/Home'
import { useDispatch } from 'react-redux'
import { setUser } from './store/features/userSlice'
import Signup from './pages/Signup'
import toast from 'react-hot-toast'

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    api.get('/users/current-user').then(res => {
      console.log(res)
      dispatch(setUser({user:res.data.data}))
    }).catch(err => {
      console.log(err)
      dispatch(setUser({user:null}))
      toast("Please login to continue",{icon:'🔒'})
    })
  }, [])

  return (
    <div className='bg-white'>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute >
            <Home/>
          </ProtectedRoute>
        }/>
        {/* Login route */}
        <Route path="/login" element={
          <PublicRoute >
            <Login/>
          </PublicRoute>
        }/>
        {/* Signup route */}
        <Route path="/signup" element={
          <PublicRoute >
            <Signup/>
          </PublicRoute>
        }/>
        {/* 404 route */}
        <Route path="*" element={<h1 className='flex items-center justify-center h-screen w-screen'>404 | Not Found</h1>} />
      </Routes>
    </div>
  )
}

export default App
