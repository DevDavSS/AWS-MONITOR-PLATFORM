import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Server, Boxes, Database, Radio } from "lucide-react";

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
}

// Mismos íconos que usamos para resourceType en alertas/reglas
// (Server = instance, Boxes = cluster, Database = database, Radio = device),
// así el lenguaje visual es consistente en toda la app.
const AWS_ITEMS: NavItem[] = [
  { to: "/ec2", label: "EC2", icon: Server },
  { to: "/eks", label: "EKS", icon: Boxes },
  { to: "/rds", label: "RDS", icon: Database },
];

const MERAKI_ITEMS: NavItem[] = [
  { to: "/physical-servers/meraki", label: "Meraki", icon: Radio },
];

export default function AppSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 w-60 flex flex-col border-r border-gray-100 bg-white">
      {/* Logo */}
      <div className="h-20 flex items-center justify-center border-b border-gray-100 px-6 shrink-0">
        <img src="/logo.png" alt="Company Logo" className="h-full w-full object-contain" />
      </div>

      {/* Navegación — con su propio scroll por si crece la lista de servicios */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-7">
        <SidebarLink to="/" label="Dashboard" icon={LayoutDashboard} end />

        <SidebarSection title="AWS Services">
          {AWS_ITEMS.map((item) => (
            <SidebarLink key={item.to} {...item} />
          ))}
        </SidebarSection>

        <SidebarSection title="Cisco Meraki">
          {MERAKI_ITEMS.map((item) => (
            <SidebarLink key={item.to} {...item} />
          ))}
        </SidebarSection>
      </nav>
    </aside>
  );
}

function SidebarSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
        {title}
      </h2>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

function SidebarLink({ to, label, icon: Icon, end }: NavItem & { end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? "bg-gray-900 text-white"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`
      }
    >
      <Icon className="w-4 h-4 shrink-0" />
      {label}
    </NavLink>
  );
}