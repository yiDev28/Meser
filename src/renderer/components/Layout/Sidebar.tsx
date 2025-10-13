import { Link, useLocation } from "react-router-dom";
import { menuAppItems } from "../../router/menuConfig";

export default function Sidebar() {
  const location = useLocation();

  return (
    <>
      {/* Barra lateral izquierda pequeña */}
      <aside className="flex flex-col items-center pb-4 bg-primary gap-2 mx-2">
        <div className="h-15"></div>

        {menuAppItems.map((item) => {
          const Icon = item.icon; // asignar componente a una variable
          return (
            <div key={item.path} className="relative group">
              <Link
                className={`flex items-center justify-center flex-shrink-0 p-3 bg-background-light rounded-lg
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
                className="absolute left-full top-0 hidden p-3 w-40 ml-1 bg-white border border-secondary shadow-lg rounded-lg
          items-center justify-start pl-4 group-hover:flex z-50"
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </aside>

      {/* Menú principal */}
      {/* <div className="flex flex-col w-56 border-r border-gray-300">
        <div className="flex flex-col flex-grow p-4 overflow-auto">
          {menuItems.map((item) => (
            <>
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 ${
                  location.pathname === item.path ? "bg-gray-300" : ""
                }`}
              >
                <span className="leading-none">{item.label}</span>
              </Link>
            </>
          ))}
        </div>
      </div> */}
    </>
  );
}
