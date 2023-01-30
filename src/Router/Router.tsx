import { Routes, Route } from "react-router-dom";
import { Chat } from "../Pages/Chat";
import { Home } from "../Pages/Home";
import { Login } from "../Pages/Login";
import { Register } from "../Pages/Register";
import { LoginUserProvider } from "../providers/AuthProviders";

export const Router = () => {
  return (
    <LoginUserProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </LoginUserProvider>
  )
}
