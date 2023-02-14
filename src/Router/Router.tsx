import { Routes, Route } from "react-router-dom";
import { Home } from "../Pages/Home";
import { Login } from "../Pages/Login";
import { Register } from "../Pages/Register";
import { Room } from "../Pages/Room";
import { LoginUserProvider } from "../providers/AuthProviders";

export const Router = () => {
  return (
    <LoginUserProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/room/:urlParams" element={<Room />} />
      </Routes>
    </LoginUserProvider>
  )
}
