import { Logo } from "@/components/layout/Logo";

const lineItems = [
  { description: "Website Hosting (Annual)", amount: 330.00 },
  { description: "Domain & SSL Certificate", amount: 40.00 },
  { description: "AI Token Usage", amount: 65.00 },
  { description: "Database & Cloud Services License", amount: 70.00 },
  { description: "Development Platform License", amount: 75.00 },
];

const total = lineItems.reduce((sum, item) => sum + item.amount, 0);

const invoiceDate = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function Invoice() {
  return (
    <div className="min-h-screen bg-white print:bg-white">
      <div className="max-w-3xl mx-auto px-8 py-12 print:py-6 print:px-4">

        <div className="flex items-start justify-between mb-12 print:mb-8">
          <div className="w-56 text-black">
            <Logo />
          </div>
          <div className="text-right text-sm text-gray-600 space-y-1">
            <h1 className="text-2xl font-serif font-semibold text-black tracking-wide mb-2">INVOICE</h1>
            <p>Date: {invoiceDate}</p>
            <p>Invoice #: MR-2026-001</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 mb-10 print:mb-6 grid grid-cols-2 gap-8">
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-semibold text-black text-xs uppercase tracking-widest mb-2">From</p>
            <p className="font-medium text-black">Mark Restelli</p>
            <p>Coldwell Banker Realty</p>
            <p>Cranberry Township, PA</p>
            <p>markrestelli.com</p>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-semibold text-black text-xs uppercase tracking-widest mb-2">Bill To</p>
            <p className="font-medium text-black">Client</p>
          </div>
        </div>

        <table className="w-full mb-10 print:mb-6" data-testid="invoice-table">
          <thead>
            <tr className="border-b-2 border-gray-800">
              <th className="text-left py-3 text-xs uppercase tracking-widest font-semibold text-gray-700">Description</th>
              <th className="text-right py-3 text-xs uppercase tracking-widest font-semibold text-gray-700">Amount</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-100" data-testid={`invoice-row-${idx}`}>
                <td className="py-4 text-sm text-gray-800">{item.description}</td>
                <td className="py-4 text-sm text-gray-800 text-right font-mono">${item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-800">
              <td className="py-4 text-sm font-semibold text-black uppercase tracking-widest">Total</td>
              <td className="py-4 text-lg font-semibold text-black text-right font-mono" data-testid="invoice-total">${total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <div className="border-t border-gray-200 pt-6 text-sm text-gray-500 space-y-1">
          <p>Payment is due within 30 days of the invoice date.</p>
          <p>Thank you for your business.</p>
        </div>

        <div className="mt-10 print:hidden flex justify-center">
          <button
            onClick={() => window.print()}
            className="px-8 py-3 bg-gray-900 text-white text-sm uppercase tracking-widest hover:bg-gray-700 transition-colors duration-300"
            data-testid="button-print"
          >
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
