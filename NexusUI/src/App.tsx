import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import AdminApp from './pages/AdminApp'
import { SignIn, SignUp } from './pages/Auth'
import Landing from './pages/Landing'
import ResolverApp from './pages/ResolverApp'
import UserApp from './pages/UserApp'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/user/*" element={<UserApp />} />
        <Route path="/resolver/*" element={<ResolverApp />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
