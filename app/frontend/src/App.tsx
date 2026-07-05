import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";

import Dashboard from "@/pages/Dashboard";
import EC2 from "@/pages/EC2";
import EKS from "@/pages/EKS";
import RDS from "@/pages/RDS";
import Ec2Detail from "@/pages/Ec2Detail";
import RdsDetail from "@/pages/RDSDetail";
import EksDetail from "@/pages/EksDetail";
import EksNodeGroup from "./pages/EksNodeGroup";

import { HeaderProvider } from "./components/layout/HeaderContext";


export default function App() {
  return (
    <BrowserRouter>
      <HeaderProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ec2" element={<EC2 />} />
            <Route path="/eks" element={<EKS />} />
            <Route path="/rds" element={<RDS />} />
            <Route path="/ec2/:instanceId" element={<Ec2Detail />} />
            <Route path="/rds/:DBinstanceId" element={<RdsDetail />} />
            <Route path="/eks/:EksClusterId" element={<EksDetail />}/>
            <Route path="/eks/:EksClusterId/nodegroup/:EksNodeGroupId" element={<EksNodeGroup/>}/>
          </Route>
        </Routes>
      </HeaderProvider>
    </BrowserRouter>
  );
}