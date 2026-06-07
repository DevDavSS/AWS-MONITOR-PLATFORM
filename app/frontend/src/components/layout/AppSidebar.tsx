import { NavLink } from "react-router-dom";

export default function AppSidebar() {
  return (
    <aside className="w-60 border-r h-screen">
        <div className="h-24 flex items-center justify-center border-b">
        <img
            src="/logo.png"
            alt="Company Logo"
            className="h-full w-full object-contain"
        />
        </div>
    
      <nav className="p-4 flex flex-col gap-2">
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/ec2" className="px-3 py-2 rounded-md">EC2</NavLink>
        <NavLink to="/eks" className="px-3 py-2 rounded-md">EKS</NavLink>
        <NavLink to="/rds" className="px-3 py-2 rounded-md">RDS</NavLink>
      </nav>
    </aside>
  );
}