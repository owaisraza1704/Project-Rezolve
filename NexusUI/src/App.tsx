import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import AdminApp from './pages/AdminApp'
import { SignIn, SignUp } from './pages/Auth'
import Landing from './pages/Landing'
import ResolverApp from './pages/ResolverApp'
import UserApp from './pages/UserApp'
import ProtectedRoute from './routes/ProtectedRoute'
import ResolverRoute from './routes/ResolverRoute'
import RoleRoute from './routes/RoleRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/user/*"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['user']}>
                <UserApp />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/resolver/*"
          element={
            <ProtectedRoute>
              <ResolverRoute>
                <ResolverApp />
              </ResolverRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['admin']}>
                <AdminApp />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
