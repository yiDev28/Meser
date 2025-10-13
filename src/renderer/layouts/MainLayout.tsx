// // MainLayout.tsx
// import { ReactNode } from "react";
// import Sidebar from "../components/Layout/Sidebar";
// import Header from "../components/Layout/Header";
// import Footer from "../components/Layout/Footer";

// export function MainLayout({ children }: { children: ReactNode }) {

//   return (
//     <div className="flex w-screen h-screen text-gray-700">
//       <Sidebar />

//       <div className="flex flex-col flex-grow">
//         <Header />
//         <div className="flex-grow p-6 overflow-auto bg-gray-200">
//           {children}
//           <div className="grid grid-cols-3 gap-6">
//             <div className="h-24 col-span-1 bg-white border border-gray-300"></div>
//             <div className="h-24 col-span-1 bg-white border border-gray-300"></div>
//             <div className="h-24 col-span-1 bg-white border border-gray-300"></div>
//             <div className="h-24 col-span-2 bg-white border border-gray-300"></div>
//             <div className="h-24 col-span-1 bg-white border border-gray-300"></div>
//             <div className="h-24 col-span-1 bg-white border border-gray-300"></div>
//             <div className="h-24 col-span-2 bg-white border border-gray-300"></div>
//             <div className="h-24 col-span-3 bg-white border border-gray-300"></div>
//             <div className="h-24 col-span-1 bg-white border border-gray-300"></div>
//             <div className="h-24 col-span-1 bg-white border border-gray-300"></div>
//             <div className="h-24 col-span-1 bg-white border border-gray-300"></div>
//             <div className="h-24 col-span-2 bg-white border border-gray-300"></div>
//             <div className="h-24 col-span-1 bg-white border border-gray-300"></div>
//             <div className="h-24 col-span-1 bg-white border border-gray-300"></div>
//             <div className="h-24 col-span-2 bg-white border border-gray-300"></div>
//             <div className="h-24 col-span-3 bg-white border border-gray-300"></div>
//             <div className="h-24 col-span-1 bg-white border border-gray-300"></div>
//             <div className="h-24 col-span-1 bg-white border border-gray-300"></div>
//             <div className="h-24 col-span-1 bg-white border border-gray-300"></div>
//             <div className="h-24 col-span-2 bg-white border border-gray-300"></div>
//             <div className="h-24 col-span-1 bg-white border border-gray-300"></div>
//             <div className="h-24 col-span-1 bg-white border border-gray-300"></div>
//             <div className="h-24 col-span-2 bg-white border border-gray-300"></div>
//             <div className="h-24 col-span-3 bg-white border border-gray-300"></div>
//           </div>
//         </div>

//         <Footer/>
//       </div>
//     </div>
//   );
// }

// MainLayout.tsx
import Sidebar from "../components/Layout/Sidebar";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <div className="flex w-screen h-screen bg-primary ">
      <Sidebar />
      <div className="flex flex-col flex-grow  rounded-2xl">
        <Header />
        <div className="flex-grow px-3 py-6 overflow-auto bg-background-light rounded-2xl border-3 border-tertiary mr-2 ">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
}
