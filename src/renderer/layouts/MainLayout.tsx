import Sidebar from "../components/Layout/Sidebar";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <div className="flex w-screen h-screen bg-primary">
      <Sidebar />
      <div className="flex flex-col grow  rounded-lg">
        <Header />
        <div className="grow px-3 py-6 overflow-auto bg-background rounded-lg border-3 border-tertiary mr-2 ">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
}
