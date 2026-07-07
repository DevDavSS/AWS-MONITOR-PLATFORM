import { NavLink } from "react-router-dom";

export default function AppSidebar() {
  return (
    <aside className="w-60 border-r h-screen bg-background">
      <div className="h-24 flex items-center justify-center border-b">
        <img
          src="/logo.png"
          alt="Company Logo"
          className="h-full w-full object-contain"
        />
      </div>

      <nav className="p-4 space-y-6">
        {/* Dashboard */}
        <div>
          <NavLink
            to="/"
            className="block px-3 py-2 rounded-md hover:bg-muted"
          >
            Dashboard
          </NavLink>
        </div>

        {/* AWS */}
        <div>
          <div className="mb-2 border-b pb-1">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              AWS Services
            </h2>
          </div>

          <div className="flex flex-col gap-2">
            <NavLink
              to="/ec2"
              className="px-3 py-2 rounded-md hover:bg-muted"
            >
              EC2
            </NavLink>

            <NavLink
              to="/eks"
              className="px-3 py-2 rounded-md hover:bg-muted"
            >
              EKS
            </NavLink>

            <NavLink
              to="/rds"
              className="px-3 py-2 rounded-md hover:bg-muted"
            >
              RDS
            </NavLink>
          </div>
        </div>

        {/* Cisco Meraki */}
        <div>
          <div className="mb-2 border-b pb-1">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
               Cisco Meraki 
            </h2>
          </div>

          <div className="flex flex-col gap-2">
            <NavLink
              to="/physical-servers/meraki"
              className="px-3 py-2 rounded-md hover:bg-muted"
            >
              Meraki
            </NavLink>
          </div>
        </div>
      </nav>
    </aside>
  );
}