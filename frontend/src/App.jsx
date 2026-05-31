import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar            from './components/Navbar'
import Landing           from './pages/Landing'
import Login             from './pages/Login'
import Signup            from './pages/Signup'
import Dashboard         from './pages/Dashboard'
import Courses           from './pages/Courses'
import CourseDetail      from './pages/CourseDetail'
import CertificateLock   from './pages/CertificateLock'
import CertificateView   from './pages/CertificateView'
import MyCertificates    from './pages/MyCertificates'
import VerifyCertificate from './pages/VerifyCertificate'
import Leaderboard       from './pages/Leaderboard'
import Shop              from './pages/Shop'
import Cart              from './pages/Cart'
import Downloads         from './pages/Downloads'
import Profile           from './pages/Profile'
import About             from './pages/About'
import Contact           from './pages/Contact'
import Privacy           from './pages/Privacy'
import FAQ               from './pages/FAQ'
import Blog              from './pages/Blog'
import BlogPost          from './pages/BlogPost'
import AdminLogin        from './pages/AdminLogin'
import AdminDashboard    from './pages/AdminDashboard'
import AdminShop         from './pages/AdminShop'

function Protected({ children }) {
  const { isAuth, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-ember-500 border-t-transparent animate-spin" />
    </div>
  )
  return isAuth ? children : <Navigate to="/login" replace />
}

function AdminGuard({ children }) {
  return localStorage.getItem('wp_admin_token')
    ? children
    : <Navigate to="/admin/login" replace />
}

function AppRoutes() {
  const path    = window.location.pathname
  const isAdmin = path.startsWith('/admin') && path !== '/admin/login'
  return (
    <>
      {!isAdmin && <Navbar />}
      <Routes>
        {/* Public */}
        <Route path="/"                               element={<Landing />} />
        <Route path="/login"                          element={<Login />} />
        <Route path="/signup"                         element={<Signup />} />
        <Route path="/leaderboard"                    element={<Leaderboard />} />
        <Route path="/verify/:code"                   element={<VerifyCertificate />} />
        <Route path="/profile/:userId"                element={<Profile />} />
        <Route path="/about"                          element={<About />} />
        <Route path="/contact"                        element={<Contact />} />
        <Route path="/privacy"                        element={<Privacy />} />
        <Route path="/faq"                            element={<FAQ />} />
        <Route path="/blog"                           element={<Blog />} />
        <Route path="/blog/:slug"                     element={<BlogPost />} />

        {/* Student protected */}
        <Route path="/dashboard"                      element={<Protected><Dashboard /></Protected>} />
        <Route path="/courses"                        element={<Protected><Courses /></Protected>} />
        <Route path="/courses/:name"                  element={<Protected><CourseDetail /></Protected>} />
        <Route path="/courses/:name/certificate"      element={<Protected><CertificateLock /></Protected>} />
        <Route path="/courses/:name/certificate/view" element={<Protected><CertificateView /></Protected>} />
        <Route path="/certificates"                   element={<Protected><MyCertificates /></Protected>} />
        <Route path="/shop"                           element={<Protected><Shop /></Protected>} />
        <Route path="/shop/cart"                      element={<Protected><Cart /></Protected>} />
        <Route path="/shop/downloads"                 element={<Protected><Downloads /></Protected>} />

        {/* Admin */}
        <Route path="/admin/login"                    element={<AdminLogin />} />
        <Route path="/admin"                          element={<AdminGuard><AdminDashboard /></AdminGuard>} />
        <Route path="/admin/shop"                     element={<AdminGuard><AdminShop /></AdminGuard>} />

        <Route path="*"                               element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
