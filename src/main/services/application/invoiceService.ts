import {
  InvoiceDTO,
  InvoiceListDTO,
  InvoiceDetailDTO,
} from "@/interfaces/invoice";
import { NEW_RESPONSE, RESPONSE } from "@/interfaces/response";
import { Customer } from "@/main/models/Customer/CustomerModel";
import InvoiceItem from "@/main/models/Invoice/InvoiceItemModel";
import Invoice from "@/main/models/Invoice/InvoiceModel";
import Order from "@/main/models/Order/OrderModel";
import OrderType from "@/main/models/Order/OrderTypeModel";
import TypePayment from "@/main/models/Invoice/TypePaymentModel";
import { Client } from "@/main/models/Client/ClientModel";
import { Op } from "sequelize";
import { BrowserWindow, app } from "electron";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { STATUS_ENUM } from "@/interfaces/const/status.const";

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
        order.get({ plain: true }),
      ) as InvoiceDTO[],
    );
  } catch (error) {
    return NEW_RESPONSE(-1, "Error inesperado al consultar facturas: " + error);
  }
}

export async function getInvoicesOfDay(): Promise<RESPONSE<InvoiceListDTO[]>> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const invoices = await Invoice.findAll({
      where: {
        createdAt: {
          [Op.gte]: today,
          [Op.lt]: tomorrow,
        },
        status: STATUS_ENUM.ACTIVE,
      },
      include: [
        {
          model: Order,
          as: "order",
          attributes: ["id"],
          include: [
            {
              model: OrderType,
              as: "type",
              attributes: ["id", "name", "colorLabel"],
            },
          ],
        },
        {
          model: TypePayment,
          as: "typePayment",
          attributes: ["id", "name", "affectsCash"],
        },
        {
          model: InvoiceItem,
          as: "itemsInvoice",
          attributes: ["id"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const result: InvoiceListDTO[] = invoices.map((inv: Invoice) => {
      const plain = inv.get({ plain: true });
      return {
        id: plain.id,
        number: plain.number,
        total: Number(plain.total),
        subtotal: Number(plain.subtotal),
        tax: Number(plain.tax),
        paymentMethodId: plain.paymentMethod,
        orderId: plain.orderId,
        orderTypeId: plain.order?.type?.id || 0,
        createdAt: plain.createdAt,
        itemsCount: plain.itemsInvoice?.length || 0,
      };
    });

    return NEW_RESPONSE(0, "", result);
  } catch (error) {
    return NEW_RESPONSE(-1, "Error al consultar facturas del día: " + error);
  }
}

export async function getInvoiceDetail(  invoiceId: string,): Promise<RESPONSE<InvoiceDetailDTO | null>> {
  try {
    const invoice = await Invoice.findByPk(invoiceId, {
      include: [
        {
          model: Order,
          as: "order",
          include: [
            {
              model: OrderType,
              as: "type",
              attributes: ["id", "name", "colorLabel"],
            },
          ],
        },
        {
          model: TypePayment,
          as: "typePayment",
          attributes: ["id", "name", "affectsCash"],
        },
        {
          model: InvoiceItem,
          as: "itemsInvoice",
          attributes: {
            exclude: ["status", "userId", "createdAt", "updatedAt"],
          },
        },
      ],
    });

    if (!invoice) {
      return NEW_RESPONSE(1, "Factura no encontrada");
    }

    const plain = invoice.get({ plain: true });

    const result: InvoiceDetailDTO = {
      id: plain.id,
      number: plain.number,
      total: Number(plain.total),
      subtotal: Number(plain.subtotal),
      tax: Number(plain.tax),
      paymentMethodId: plain.paymentMethod,
      orderId: plain.orderId,
      orderTypeId: plain.order?.type?.id || 0,
      createdAt: plain.createdAt,
      itemsCount: plain.itemsInvoice?.length || 0,
      items: (plain.itemsInvoice || []).map((item: InvoiceItem) => ({
        id: item.id,
        description: item.description || "",
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        discount: Number(item.discount),
        total: Number(item.total),
      })),
      cashRegisterId: plain.cashRegisterId,
      userId: plain.userId || 0,
    };

    return NEW_RESPONSE(0, "", result);
  } catch (error) {
    return NEW_RESPONSE(-1, "Error al consultar detalle de factura: " + error);
  }
}

export async function printInvoice(invoiceId: string): Promise<RESPONSE<null>> {
  try {
    console.log("[printInvoice] Iniciando impresión para factura:", invoiceId);
    
    const invoiceResponse = await getInvoiceDetail(invoiceId);
    if (invoiceResponse.code !== 0 || !invoiceResponse.data) {
      console.log("[printInvoice] Factura no encontrada");
      return NEW_RESPONSE(1, invoiceResponse.msg || "Factura no encontrada");
    }

    const invoice = invoiceResponse.data;
    console.log("[printInvoice] Datos de factura obtenidos:", invoice.number);

    const client = await Client.findByPk("1");
    const clientName = client?.name || "Restaurante";
    console.log("[printInvoice] Cliente:", clientName);

    const printData = {
      ...invoice,
      clientName,
    };

    const mainDir = path.dirname(fileURLToPath(import.meta.url));
    const devBase = path.join(process.cwd(), "src", "main", "windows", "print");
    const prodBase = app.isPackaged
      ? path.join(process.resourcesPath, "print")
      : mainDir;

    const devIndexHtml = path.join(devBase, "index.html");
    const prodIndexHtml = path.join(prodBase, "index.html");

    console.log("[printInvoice] Paths:");
    console.log("  devIndexHtml:", devIndexHtml, "existe:", fs.existsSync(devIndexHtml));
    console.log("  prodIndexHtml:", prodIndexHtml, "existe:", fs.existsSync(prodIndexHtml));

    const indexHtmlPath = fs.existsSync(devIndexHtml) ? devIndexHtml : prodIndexHtml;

    console.log("[printInvoice] Usando HTML:", indexHtmlPath);

    const printWindow = new BrowserWindow({
      show: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    // Leer el HTML y injectar los datos
    let htmlContent = fs.readFileSync(indexHtmlPath, 'utf-8');
    
    // Reemplazar el script para que use los datos inyectados
    const dataScript = `
      <script>
        window.invoiceData = ${JSON.stringify(printData)};
      </script>
    `;
    
    // Insertar los datos antes del script principal
    htmlContent = htmlContent.replace('</body>', dataScript + '</body>');

    console.log("[printInvoice] HTML con datos inyectado, cargando...");
    await printWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent));
    console.log("[printInvoice] HTML cargado");

    printWindow.webContents.on("did-finish-load", () => {
      setTimeout(() => {
        console.log("[printInvoice] Intentando imprimir...");
        printWindow.webContents.print(
          {
            silent: false,
            printBackground: true,
            pageSize: { width: 80000, height: 297000 },
          },
          (success, failureReason) => {
            console.log("[printInvoice] Resultado impresión:", success, failureReason);
            printWindow.close();
          },
        );
      }, 500);
    });

    printWindow.on("closed", () => {
      console.log("[printInvoice] Ventana de impresión cerrada");
    });

    return NEW_RESPONSE(0, "Factura enviada a impresión");
  } catch (error) {
    console.error("[printInvoice] Error:", error);
    return NEW_RESPONSE(-1, "Error al imprimir factura: " + error);
  }
}
