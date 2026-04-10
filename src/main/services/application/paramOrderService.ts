/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ConfigInvoicedDTO,
  MenuDTO,
  OrderTypeDTO,
  TypePaymentDTO,
  TypePaymentObjDTO,
} from "@/interfaces/order";
import { NEW_RESPONSE, RESPONSE } from "@/interfaces/response";
import ProductCategory from "@/main/models/Products/ProductCatModel";
import Product from "@/main/models/Products/ProductModel";
import MenuItem from "@/main/models/Menu/MenuItemModel";
import Menu from "@/main/models/Menu/MenuModel";
import OrderType from "@/main/models/Order/OrderTypeModel";
import { getErrorMessage } from "@/utils/errorUtils";
import { TableDTO } from "@/interfaces/table";
import Table from "@/main/models/Establishment/TableModel";
import { ProductCategoryDTO } from "@/interfaces/product";
import { Parameter, ParameterValue } from "@/main/models/Params/ParameterModel";
import TypePayment from "@/main/models/Invoice/TypePaymentModel";
import { STATUS_ENUM } from "@/interfaces/const/status.const";

export async function getTypeOrder(): Promise<RESPONSE<OrderTypeDTO[]>> {
  try {
    const typeOrder = await OrderType.findAll({
      attributes: {
        exclude: ["status", "userId", "createdAt", "updatedAt"],
      },
      where: { status: STATUS_ENUM.ACTIVE },
      include: [
        {
          model: ParameterValue,
          as: "parameters",
          required: false, // IMPORTANTÍSIMO
          where: {
            status: STATUS_ENUM.ACTIVE,
          },
          attributes: ["id", "value", "valueType"],
          include: [
            {
              model: Parameter,
              as: "definition",
              attributes: ["id", "code", "name", "description"],
            },
          ],
        },
      ],
    });

    return NEW_RESPONSE(
      0,
      "",
      typeOrder.map((type: any) =>
        typeof type.get === "function" ? type.get({ plain: true }) : type,
      ) as OrderTypeDTO[],
    );
  } catch (error) {
    return NEW_RESPONSE(-1, "Error inesperado: " + getErrorMessage(error));
  }
}

export async function getMenu(): Promise<RESPONSE<MenuDTO | null>> {
  try {
    const menu = await Menu.findOne({
      attributes: {
        exclude: ["status", "userId", "createdAt", "updatedAt"],
      },
      where: { status: STATUS_ENUM.ACTIVE },
      raw: false,
      nest: true,
      include: [
        {
          model: MenuItem,
          as: "menuItems",
          attributes: {
            exclude: [
              "productId",
              "status",
              "userId",
              "createdAt",
              "updatedAt",
            ],
          },
          where: { status: STATUS_ENUM.ACTIVE },
          required: false,
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
              required: false,
              include: [
                {
                  model: ProductCategory,
                  as: "productCategory",
                  attributes: {
                    exclude: ["status", "userId", "createdAt", "updatedAt"],
                  },
                  required: false,
                },
              ],
            },
          ],
        },
      ],
    });

    if (!menu) {
      return NEW_RESPONSE(0, "", null);
    }

    const plainMenu = typeof menu.get === "function" 
      ? menu.get({ plain: true }) 
      : menu;
      
    return NEW_RESPONSE(0, "", plainMenu as MenuDTO);
  } catch (error) {
    return NEW_RESPONSE(
      -1,
      "Error inesperado al consultar menu: " + getErrorMessage(error),
    );
  }
}

export async function getTables(): Promise<RESPONSE<TableDTO[]>> {
  try {
    const typeOrder = await Table.findAll({
      attributes: {
        exclude: ["status", "userId", "createdAt", "updatedAt"],
      },
      where: { status: STATUS_ENUM.ACTIVE },
      raw: false, // Dejamos raw en `false` para que los datos anidados se mantengan
      nest: true, // Esto permite que los resultados anidados se estructuren correctamente
    });

    return NEW_RESPONSE(
      0,
      "",
      typeOrder.map((type: any) =>
        typeof type.get === "function" ? type.get({ plain: true }) : type,
      ) as TableDTO[],
    );
  } catch (error) {
    return NEW_RESPONSE(-1, "Error inesperado: " + getErrorMessage(error));
  }
}

export async function getCategoriesProducts(): Promise<
  RESPONSE<ProductCategoryDTO[]>
> {
  try {
    const typeOrder = await ProductCategory.findAll({
      attributes: {
        exclude: ["status", "userId", "createdAt", "updatedAt"],
      },
      where: { status: STATUS_ENUM.ACTIVE },
      raw: false, // Dejamos raw en `false` para que los datos anidados se mantengan
      nest: true, // Esto permite que los resultados anidados se estructuren correctamente
    });

    return NEW_RESPONSE(
      0,
      "",
      typeOrder.map((type: any) =>
        typeof type.get === "function" ? type.get({ plain: true }) : type,
      ) as ProductCategoryDTO[],
    );
  } catch (error) {
    return NEW_RESPONSE(-1, "Error inesperado: " + getErrorMessage(error));
  }
}

export async function getTypesPayments(): Promise<RESPONSE<TypePaymentObjDTO>> {
  try {
    let result: TypePaymentObjDTO = {
      status: false,
      default: 0,
      paymentsTypes: [],
    };

    const TypePaymentParam = await ParameterValue.findAll({
      attributes: {
        exclude: ["status", "userId", "createdAt", "updatedAt"],
      },
      include: [
        {
          model: Parameter,
          as: "definition",
          attributes: ["id", "code", "name", "description"],
        },
      ],
      where: { status: STATUS_ENUM.ACTIVE },
      raw: false,
      nest: true,
    });

    const paymentTypeStatus = TypePaymentParam.find(
      (item: ParameterValue) => item.definition?.code === "PAYMENTS_TYPES",
    );

    if (!paymentTypeStatus || !Boolean(paymentTypeStatus.value)) {
      return NEW_RESPONSE(0, "", result);
    }

    const paymentTypeDefault = TypePaymentParam.find(
      (item: ParameterValue) => item.definition?.code === "PAYMENT_TYPE_DEFAULT",
    );

    result.status = Boolean(paymentTypeStatus.value);
    result.default = paymentTypeDefault ? Number(paymentTypeDefault.value) : 0;

    const paymentType = await TypePayment.findAll({
      attributes: {
        exclude: ["status", "userId", "createdAt", "updatedAt"],
      },
      where: { status: STATUS_ENUM.ACTIVE },
      raw: false,
      nest: true,
    });

    result.paymentsTypes = paymentType.map((type: any) =>
      typeof type.get === "function" ? type.get({ plain: true }) : type,
    ) as TypePaymentDTO[];

    return NEW_RESPONSE(0, "", result);
  } catch (error) {
    return NEW_RESPONSE(-1, "Error inesperado: " + getErrorMessage(error));
  }
}

export async function getConfigInvoiced(): Promise<RESPONSE<ConfigInvoicedDTO>> {
  try {
    let result: ConfigInvoicedDTO = {
      status: false,
      default: 0,
    };

    const TypeConfigInvoiced = await ParameterValue.findAll({
      attributes: {
        exclude: ["status", "userId", "createdAt", "updatedAt"],
      },
      where: {
        status: 1,
        scopeId: 3,
      },
      include: [
        {
          model: Parameter,
          as: "definition",
          attributes: ["id", "code", "name", "description"],
        },
      ],
      raw: false, // Dejamos raw en `false` para que los datos anidados se mantengan
      nest: true, // Esto permite que los resultados anidados se estructuren correctamente
    });

    const configInvoicedStatus = TypeConfigInvoiced.find(
      (item: ParameterValue) => item.definition.code === "ELECTRONIC_INVOICE",
    );

    if (!Boolean(configInvoicedStatus.value)) {
      return NEW_RESPONSE(0, "", result);
    }

    const configInvoicedDefault = TypeConfigInvoiced.find(
      (item: ParameterValue) => item.definition.code === "ELECTRONIC_INVOICE_DEFAULT",
    );

    result.status = Boolean(configInvoicedStatus.value);
    result.default = Number(configInvoicedDefault.value);

    return NEW_RESPONSE(0, "", result);
  } catch (error) {
    return NEW_RESPONSE(-1, "Error inesperado: " + getErrorMessage(error));
  }
}


