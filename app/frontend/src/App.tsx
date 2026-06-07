import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";

import Dashboard from "@/pages/Dashboard";
import EC2 from "@/pages/EC2";
import EKS from "@/pages/EKS";
import RDS from "@/pages/RDS";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ec2" element={<EC2 />} />
          <Route path="/eks" element={<EKS />} />
          <Route path="/rds" element={<RDS />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}