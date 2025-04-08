import { Routes, Route ,Navigate } from "react-router-dom"


import SignUpPage from "./pages/SignUpPage"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import Navbar from "./components/Navbar"
import ProfilePage from "./pages/ProfilePage"
import CreatePost from "./pages/CreatePost"
import Messages from "./pages/Messages"
import SettingsPage from "./pages/SettingsPage"


import { Toaster } from "react-hot-toast"
import { Loader } from "lucide-react"
import { useAuthStore } from "./store/useAuthStore"
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react"

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  const { theme } = useThemeStore();

  // console.log({ onlineUsers });
  // console.log(theme);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  return (
    <div data-theme={theme}>
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar/>
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/profile" element={authUser?<ProfilePage/>:<Navigate to="/login"/>}/>
        <Route path="/post" element={authUser?<CreatePost/>:<Navigate to="/login"/>}/>
        <Route path="/messages" element={authUser?<Messages/>:<Navigate to="/login"/>}/>
        <Route path="/settings" element={authUser?<SettingsPage/>:<Navigate to="/login"/>}/>
      </Routes>
    </div>
  )
}

export default App