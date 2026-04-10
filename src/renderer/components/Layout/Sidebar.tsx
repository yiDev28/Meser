import { Link, useLocation } from "react-router-dom";
import { menuAppItems } from "../../router/menuConfig";

export default function Sidebar() {
  const location = useLocation();

  return (
    <>
      {/* Barra lateral izquierda pequeña */}
      <aside className="flex flex-col items-center  px-2">
        <div className="flex flex-col items-center gap-4 justify-center h-full">
          {menuAppItems.map((item) => {
            const Icon = item.icon; // asignar componente a una variable
            return (
              <div key={item.path} className="relative group">
                <Link
                  className={`flex items-center justify-center shrink-0 p-3 bg-background rounded-lg
          hover:bg-neutral-light hover:text-neutral-dark
          ${
            location.pathname === item.path
              ? "bg-tertiary text-neutral-dark"
              : "text-neutral-gray"
          }`}
                  to={item.path}
                >
                  <Icon size={30} />
                </Link>
                {/* Dropdown */}
                <div
                  className="absolute left-full top-0 hidden p-3 w-40 ml-1 bg-neutral-light border border-secondary shadow-lg rounded-lg
          items-center justify-start pl-4 group-hover:flex z-50"
                >
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}
