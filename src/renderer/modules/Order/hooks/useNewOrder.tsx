import { ORDER_TYPE, OrderType } from "@/interfaces/const/order.const";
import { CreateOrderDTO } from "@/interfaces/order";
import { FormCreateOrder } from "@/interfaces/types/errors.type";
import { defaultAlert } from "@/renderer/components/Modals/AlertService";
import { useParamOrder } from "@/renderer/context/ParamOrderContext";
import { UPPERCASE_FIELDS } from "@/renderer/utils/inputsTransform";
import {
  validateErrorsOrUndefined,
  validateField,
  VALIDATORS,
} from "@/renderer/utils/validators";
import { useEffect, useMemo, useState } from "react";

export const useNewOrder = () => {
  const { orderType, menu, tables, categoriesProducts } = useParamOrder();
  const [openModalNew, setOpenModalNew] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormCreateOrder>({});
    const [step, setStep] = useState<number>(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  const CUSTOMER_VALIDATION_BY_ORDER_TYPE: Record<
    OrderType,
    Partial<{
      name: typeof VALIDATORS.NAME;
      phone: typeof VALIDATORS.PHONE;
      address: typeof VALIDATORS.ADDRESS;
    }>
  > = {
    [ORDER_TYPE.ONSITE]: {
      //table: VALIDATORS.NAME,
    },

    [ORDER_TYPE.DELIVERY]: {
      name: VALIDATORS.NAME,
      phone: VALIDATORS.PHONE,
      address: VALIDATORS.ADDRESS,
    },

    [ORDER_TYPE.CARRY]: {
      name: VALIDATORS.NAME,
    },
  };

  const openModalNewOrder = () => {
    setOpenModalNew(true);
    setSelectedCategoryId(null)
  };

  const closeModalNewOrder = () => {
    setOpenModalNew(false);
  };

  const createOrder = async (order: CreateOrderDTO) => {
    //SE DEBE VALIDAR ALGO ???????

    const res = await window.electron.createOrder(order);

    if (res.code !== 0) {
      defaultAlert({
        mode: "warning",
        body: `${res.msg}`,
        successButton: true,
      });
      return;
    }
    defaultAlert({
      mode: "success",
      body: `EXitosooooooooooooo`,
      successButton: true,
    });
  };

  const [payload, setPayload] = useState<CreateOrderDTO>({
    customerId: 0,
    orderType: 0,
    userId: 0,
    items: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

  setPayload((prev) => ({
    ...prev,
    [name]: UPPERCASE_FIELDS.includes(name)
      ? value.toUpperCase()
      : value,
  }));

    setErrors({
      ...errors,
      [e.target.name]: undefined,
    });
  };

  const handleSelectOrderType = (typeId: number) => {
    setPayload((prev) => ({ ...prev, orderType: typeId }));
    setStep(2);
  };

  const handleSelectTable = (tableId: number) => {
    setPayload((prev) => ({ ...prev, tableId: tableId }));
    setStep(3);
  };

  const handleSelectCategory = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
  };

  const handleContinueCustomer = () => {
    const orderType = selectedType?.paramType as OrderType;

    if (!orderType) return;

    const newErrors = validateDataCustomer(orderType, payload);

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setStep(3);
  };

  const validateDataCustomer = (
    orderType: OrderType,
    payload: FormCreateOrder
  ) => {
    const validators = CUSTOMER_VALIDATION_BY_ORDER_TYPE[orderType];

    return validateErrorsOrUndefined<FormCreateOrder>({
      name: validators.name
        ? validateField(payload.name, validators.name)
        : undefined,

      phone: validators.phone
        ? validateField(payload.phone, validators.phone)
        : undefined,

      address: validators.address
        ? validateField(payload.address, validators.address)
        : undefined,
    });
  };

  const handleAddItem = (menuItemId: number) => {
    setPayload((prev) => {
      const existing = prev.items.find((i) => i.menuItemId === menuItemId);
      if (existing) {
        return {
          ...prev,
          items: prev.items.map((i) =>
            i.menuItemId === menuItemId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        ...prev,
        items: [...prev.items, { menuItemId, quantity: 1 }],
      };
    });
  };

  const handleRemoveItem = (menuItemId: number) => {
    setPayload((prev) => {
      const existing = prev.items.find((i) => i.menuItemId === menuItemId);
      if (!existing) return prev;
      if (existing.quantity === 1) {
        return {
          ...prev,
          items: prev.items.filter((i) => i.menuItemId !== menuItemId),
        };
      }
      return {
        ...prev,
        items: prev.items.map((i) =>
          i.menuItemId === menuItemId ? { ...i, quantity: i.quantity - 1 } : i
        ),
      };
    });
  };

  const handleNoteItem = (menuItemId: number, note: string) => {
    setPayload((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i.menuItemId === menuItemId ? { ...i, notes: note } : i
      ),
    }));
  };

  const handleConfirm = () => {
    //createOrder({ ...payload, notes });
    closeModalNewOrder();
  };

  const filteredProducts = useMemo(() => {
    if (!menu || !selectedCategoryId) return [];

    return menu.menuItems.filter(
      (item) => item.product.productCategory.id === selectedCategoryId
    );
  }, [menu, selectedCategoryId]);

  const selectedType = orderType.find((t) => t.id === payload.orderType);

  useEffect(() => {
    if (openModalNew) {
      setPayload({
        customerId: 0,
        orderType: 0,
        userId: 999,
        items: [],
      });
      setStep(1);
    }
  }, [openModalNew]);

  useEffect(() => {
    if (selectedType) {
      setErrors({});
    }
  }, [selectedType]);

  return {
    openModalNewOrder,
    closeModalNewOrder,
    openModalNew,
    step,
    handleSelectOrderType,
    selectedType,
    setStep,
    handleContinueCustomer,
    handleRemoveItem,
    handleAddItem,
    handleNoteItem,
    payload,
    handleConfirm,
    setPayload,
    orderType,
    menu,
    handleChange,
    errors,
    tables,
    handleSelectTable,
    categoriesProducts,
    handleSelectCategory,
    filteredProducts,
    selectedCategoryId
  };
};
