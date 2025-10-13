import { InvoiceDTO } from "@/interfaces/invoice";
import { NEW_RESPONSE, RESPONSE } from "@/interfaces/response";
import { Customer } from "@/main/models/Customer/CustomerModel";
import InvoiceItem from "@/main/models/Invoice/InvoiceItemModel";
import Invoice from "@/main/models/Invoice/InvoiceModel";

export async function getInvoices(): Promise<RESPONSE<InvoiceDTO[]>> {
  try {
    const _invoices = await Invoice.findAll({
      attributes: {
        exclude: ["status", "createdAt"],
      },
      include: [
        {
          model: Customer,
          as: "customerInvoice",
          attributes: {
            exclude: ["status", "userId", "createdAt", "updatedAt"],
          },
        },
        {
          model: InvoiceItem,
          as: "itemsInvoice",
          attributes: {
            exclude: ["status", "userId", "createdAt", "updatedAt"],
          },
        },
      ],
      raw: false, // Dejamos raw en `false` para que los datos anidados se mantengan
      nest: true, // Esto permite que los resultados anidados se estructuren correctamente
      order: [["createdAt", "DESC"]],
    });

    return NEW_RESPONSE(
      0,
      "",
      _invoices.map((order: Invoice) =>
        order.get({ plain: true })
      ) as InvoiceDTO[]
    );
  } catch (error) {
    return NEW_RESPONSE(-1, "Error inesperado al consultar facturas: " + error);
  }
}
