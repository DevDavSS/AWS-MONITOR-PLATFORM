import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";

/* ============================================================
 * <AppLayout />
 * - AppSidebar usa `fixed`, así que sale del flujo normal.
 * - Esta columna usa `pl-60` (mismo ancho que el sidebar) para
 *   no quedar tapada por él.
 * - AppHeader es un item normal de este flex-col (no scrollea).
 * - Solo <main> tiene overflow-y-auto, así que es la única parte
 *   que se mueve al hacer scroll.
 * ========================================================== */
export default function AppLayout() {
  return (
    <div className="h-screen bg-gray-50">
      <AppSidebar />

      <div className="h-screen pl-60 flex flex-col">
        <AppHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}