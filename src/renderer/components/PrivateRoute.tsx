// // src/renderer/components/PrivateRoute.tsx
// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// interface PrivateRouteProps {
//   // Puedes añadir roles requeridos aquí si implementas RBAC (Role-Based Access Control)
//   // requiredRoles?: string[];
// }

// const PrivateRoute: React.FC<PrivateRouteProps> = () => {
//   const { isAuthenticated, isLoading } = useAuth();

//   if (isLoading) {
//     // Puedes mostrar un spinner de carga mientras se verifica el token inicial
//     return (
//       <div className="d-flex justify-content-center align-items-center vh-100">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Cargando...</span>
//         </div>
//       </div>
//     );
//   }

//   // Si no está autenticado, redirige a la página de login
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   // Si está autenticado, renderiza el componente hijo (la ruta protegida)
//   return <Outlet />;
// };

// export default PrivateRoute;