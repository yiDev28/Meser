/* eslint-disable @typescript-eslint/no-explicit-any */
import { MenuDTO, OrderTypeDTO } from "@/interfaces/order";
import { NEW_RESPONSE, RESPONSE } from "@/interfaces/response";
import ProductCategory from "@/main/models/Products/ProductCatModel";
import Product from "@/main/models/Products/ProductModel";
import MenuItem from "@/main/models/Menu/MenuItemModel";
import Menu from "@/main/models/Menu/MenuModel";
import OrderType from "@/main/models/Order/OrderTypeModel";
import { getErrorMessage } from "@/utils/errorUtils";

export async function getTypeOrder(): Promise<RESPONSE<OrderTypeDTO[]>> {
  try {
    const typeOrder = await OrderType.findAll({
      attributes: {
        exclude: ["status", "userId", "createdAt", "updatedAt"],
      },
      where: { status: 1 },
      raw: false, // Dejamos raw en `false` para que los datos anidados se mantengan
      nest: true, // Esto permite que los resultados anidados se estructuren correctamente
    });

    return NEW_RESPONSE(
      0,
      "",
      typeOrder.map((type: any) =>
        typeof type.get === "function" ? type.get({ plain: true }) : type
      ) as OrderTypeDTO[]
    );
  } catch (error) {
    return NEW_RESPONSE(-1, "Error inesperado: " + getErrorMessage(error));
  }
}

export async function getMenu(): Promise<RESPONSE<MenuDTO>> {
  try {
    const menu = await Menu.findOne({
      attributes: {
        exclude: ["status", "userId", "createdAt", "updatedAt"],
      },
      where: { status: 1 }, // solo menú activo
      raw: false, // Dejamos raw en `false` para que los datos anidados se mantengan
      nest: true, // Esto permite que los resultados anidados se estructuren correctamente
      //order: [["createdAt", "DESC"]], // el más reciente
      include: [
        {
          model: MenuItem,
          as: "menuItems", // asegúrate que coincida con el alias de la asociación
          attributes: {
            exclude: [
              "productId",
              "status",
              "userId",
              "createdAt",
              "updatedAt",
            ],
          },
          where: { status: 1 }, // solo items activos
          //required: false, // si no hay items no rompe
          include: [
            {
              model: Product,
              as: "product",
              attributes: {
                exclude: [
                  "category",
                  "status",
                  "userId",
                  "createdAt",
                  "updatedAt",
                ],
              },
              include: [
                {
                  model: ProductCategory,
                  as: "productCategory",
                  attributes: {
                    exclude: ["status", "userId", "createdAt", "updatedAt"],
                  },
                },
              ],
            },
          ],
        },
      ],
    });

    return NEW_RESPONSE(0, "", menu.get({ plain: true }) as MenuDTO);
  } catch (error) {
    return NEW_RESPONSE(
      -1,
      "Error inesperado al consultar menu: " + getErrorMessage(error)
    );
  }
}
