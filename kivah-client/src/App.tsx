import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import HustleHub from './modules/hustle/HustleHub'
import HustleDetail from './modules/hustle/HustleDetail'
import HomeBase from './modules/homebase/HomeBase'
import CareerHub from './modules/career/CareerHub'
import FamilySpace from './modules/family/FamilySpace'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/hustle" element={
            <ProtectedRoute>
              <HustleHub />
            </ProtectedRoute>
          } />
          <Route path="/hustle/:id" element={
  <ProtectedRoute>
    <HustleDetail />
  </ProtectedRoute>
} />
<Route path="/homebase" element={
  <ProtectedRoute>
    <HomeBase />
  </ProtectedRoute>
} />

<Route path="/career" element={
  <ProtectedRoute>
    <CareerHub />
  </ProtectedRoute>
} />

<Route path="/family" element={
  <ProtectedRoute>
    <FamilySpace />
  </ProtectedRoute>
} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App