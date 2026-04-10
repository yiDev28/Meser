import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/renderer/context/AuthContext";
import { RiLogoutCircleLine } from "react-icons/ri";
import { ButtonActionsPadding } from "../Buttons/ButtonActionsPadding";
import { BiLogOut } from "react-icons/bi";

export function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(user);
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  return (
    <div className="relative" ref={menuRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 cursor-pointer hover:bg-base-200 px-2 py-1 rounded"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setIsOpen(!isOpen)}
      >
        <div className="avatar placeholder">
          <div className="bg-background text-primary text-xl rounded-full w-10 h-10 flex items-center justify-center font-bold">
            <span>{user?.username?.charAt(0).toUpperCase()}</span>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute bg-neutral-light/90 right-0 mt-2 w-[25vw] shadow-2xl rounded-lg border border-neutral-gray/50 p-3 z-50">
          <ul className="menu p-2 flex-col gap-2  w-full">
            <li className="menu-title border-b border-neutral-gray/50 pb-1 mb-1">
              <span className="text-xs text-neutral-gray">Sesión de usuario</span>
              </li>
            <li>
              <div className="">
                <p className="font-semibold text-neutral-dark">
                  {user?.username}
                </p>
                <p className="text-sm text-neutral-dark">Rol: {user?.role}</p>
              </div>
            </li>
            <li className="flex justify-end">
              <ButtonActionsPadding
               onClick={handleLogout}
               label="Cerrar Sesión"
               mode="primary_light"
               icon={BiLogOut}
              />
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
