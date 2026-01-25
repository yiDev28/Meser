import { ChildrenProps, TypeMsg } from "@/interfaces/app";
import { MenuDTO, OrderTypeDTO } from "@/interfaces/order";
import { ProductCategoryDTO } from "@/interfaces/product";
import { TableDTO } from "@/interfaces/table";
import { getErrorMessage } from "@/utils/errorUtils";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

interface ParamOrderContextProps {
  orderType: OrderTypeDTO[];
  tables: TableDTO[];
  categoriesProducts: ProductCategoryDTO[];
  menu: MenuDTO | undefined;
  alert: TypeMsg | null;
}

// Creamos el contexto con un valor inicial nulo.
const ParamOrderContext = createContext<ParamOrderContextProps | undefined>(
  undefined
);

export const ParamOrderProvider: React.FC<ChildrenProps> = ({ children }) => {
  const [orderType, setOrderType] = useState<OrderTypeDTO[]>([]);
  const [menu, setMenu] = useState<MenuDTO>();
  const [tables, setTables] = useState<TableDTO[]>([]);

  const [alert, setAlert] = useState<TypeMsg | null>(null);

  const fetchOrderType = async () => {
    try {
      const response = await window.electron.getTypeOrder();
      console.log(response);
      if (response.code === 0) {
        setOrderType(response.data);
        setAlert(null);
      } else {
        setAlert({ type: "WARNING", msg: response.message });
      }
    } catch (error) {
      setAlert({
        type: "ERROR",
        msg: `Error inesperado sincronizando tipos de ordenes ||| ${getErrorMessage(
          error
        )}`,
      });
    }
  };

  const fetchMenu = async () => {
    try {
      const response = await window.electron.getMenu();
      console.log(response);
      if (response.code === 0) {
        setMenu(response.data);
        setAlert(null);
      } else {
        setAlert({ type: "WARNING", msg: response.message });
      }
    } catch (error) {
      setAlert({
        type: "ERROR",
        msg: `Error inesperado sincronizando el menu||| ${getErrorMessage(
          error
        )}`,
      });
    }
  };

  const fetchTables = async () => {
    try {
      const response = await window.electron.getTables();
      console.log(response);
      if (response.code === 0) {
        setTables(response.data);
        setAlert(null);
      } else {
        setAlert({ type: "WARNING", msg: response.message });
      }
    } catch (error) {
      setAlert({
        type: "ERROR",
        msg: `Error inesperado sincronizando mesas ||| ${getErrorMessage(
          error
        )}`,
      });
    }
  };

  // const fetchTCategoriesProducts = async () => {
  //   try {
  //     const response = await window.electron.getCategoriesProducts();
  //     console.log(response);
  //     if (response.code === 0) {
  //       setCategoriesProducts(response.data);
  //       setAlert(null);
  //     } else {
  //       setAlert({ type: "WARNING", msg: response.message });
  //     }
  //   } catch (error) {
  //     setAlert({
  //       type: "ERROR",
  //       msg: `Error inesperado sincronizando categorias ||| ${getErrorMessage(
  //         error
  //       )}`,
  //     });
  //   }
  // };

  const categoriesProducts = useMemo(() => {
  if (!menu?.menuItems) return [];

  const map = new Map<number, ProductCategoryDTO>();

  menu.menuItems.forEach(item => {
    const category = item.product.productCategory;
    if (category && !map.has(category.id)) {
      map.set(category.id, category);
    }
  });

  return Array.from(map.values());
}, [menu]);

  useEffect(() => {
    fetchOrderType();
    fetchMenu();
    fetchTables();
    //fetchTCategoriesProducts();
  }, []);

  const value = {
    orderType,
    menu,
    tables,
    categoriesProducts,
    alert,
  };
  return (
    <ParamOrderContext.Provider value={value}>
      {children}
    </ParamOrderContext.Provider>
  );
};

// Custom hook para consumir el contexto de manera sencilla
export const useParamOrder = (): ParamOrderContextProps => {
  const context = useContext(ParamOrderContext);
  if (!context) {
    throw new Error(
      "useParamOrder debe ser usado dentro de ParamOrderProvider"
    );
  }
  return context;
};
