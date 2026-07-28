import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";

import Dashboard from "@/pages/dashboard/Dashboard";
import EC2 from "@/pages/ec2/EC2";
import EKS from "@/pages/eks/EKS";
import RDS from "@/pages/rds/RDS";
import Ec2Detail from "@/pages/ec2/Ec2Detail";
import RdsDetail from "@/pages/rds/RDSDetail";
import EksDetail from "@/pages/eks/EksDetail";
import EksNodeGroup from "./pages/eks/EksNodeGroup";
import EKSNode from "./pages/eks/EksNodeDetail";
import Meraki from "./pages/Meraki";

import { HeaderProvider } from "./components/layout/HeaderContext";
import { FilterProvider } from "@/contexts/FilterContext";

export default function App() {
  return (
    <BrowserRouter>

      <FilterProvider>

        <HeaderProvider>

          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/ec2" element={<EC2 />} />
              <Route path="/eks" element={<EKS />} />
              <Route path="/rds" element={<RDS />} />
              <Route path="/physical-servers/meraki" element={<Meraki />} />
              <Route path="/ec2/:instanceId" element={<Ec2Detail />} />
              <Route path="/rds/:DBinstanceId" element={<RdsDetail />} />
              <Route path="/eks/:EksClusterId" element={<EksDetail />} />
              <Route
                path="/eks/:EksClusterId/nodegroup/:EksNodeGroupId"
                element={<EksNodeGroup />}
              />
              <Route
                path="/eks/:EksClusterId/nodegroup/:EksNodeGroupId/node/:instanceId"
                element={<EKSNode />}
              />
            </Route>
          </Routes>

        </HeaderProvider>

      </FilterProvider>

    </BrowserRouter>
  );
}