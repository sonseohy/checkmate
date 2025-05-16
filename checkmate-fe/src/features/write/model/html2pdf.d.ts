declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | number[];
    filename?: string;
    image?: { type: string; quality: number };
    html2canvas?: unknown;
    jsPDF?: { unit: string; format: string; orientation: string };
  }

  interface Html2Pdf {
    from(element: HTMLElement): this;
    set(opts: Html2PdfOptions): this;
    outputPdf(type: 'blob'): Promise<Blob>;
    save(filename?: string): void;
  }

  function html2pdf(): Html2Pdf;
  export default html2pdf;
}
