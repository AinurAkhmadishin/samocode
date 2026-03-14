declare module "pdfmake/js/Printer" {
  class PdfPrinter {
    constructor(fontDescriptors: Record<string, unknown>);
    createPdfKitDocument(docDefinition: unknown, options?: unknown): NodeJS.ReadWriteStream;
  }

  export = PdfPrinter;
}
