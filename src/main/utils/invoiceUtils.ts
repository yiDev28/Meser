import Invoices from "../models/Invoice/InvoiceModel";

export const generateNextInvoiceNumber = async (transaction: any) => {
  const lastInvoice = await Invoices.findOne({
    order: [["createdAt", "DESC"]],
    attributes: ['number'],
    transaction
  });

  let nextNumber = 1;

  if (lastInvoice) {
    // Extraemos la parte numérica (asumiendo formato "POS-0001")
    const lastNumberStr = lastInvoice.dataValues.number.split('-')[1];
    nextNumber = parseInt(lastNumberStr, 10) + 1;
  }

  // Retornamos con ceros a la izquierda para que se vea profesional
  const padding = nextNumber.toString().padStart(6, '0');
  return `POS-${padding}`; // Ejemplo: POS-000125
};