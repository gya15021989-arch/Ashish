import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

/**
 * Print only the specified element (Registration Docket Slip)
 * Using an isolated hidden iframe prevents modal backdrops, scrollbars,
 * or dark background themes from polluting the printed document.
 */
export const printDocketElement = (elementId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const element = document.getElementById(elementId);
    if (!element) {
      // Fallback
      window.print();
      resolve(true);
      return;
    }

    // Create an isolated hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) {
      window.print();
      document.body.removeChild(iframe);
      resolve(true);
      return;
    }

    // Gather styles from current document
    const headStyles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map((el) => el.outerHTML)
      .join('\n');

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>UPRSA Official Registration Slip</title>
          ${headStyles}
          <style>
            @page {
              size: A4 portrait;
              margin: 6mm 5mm;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
              box-sizing: border-box;
            }
            html, body {
              background-color: #ffffff !important;
              color: #000000 !important;
              margin: 0 !important;
              padding: 0 !important;
              font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
            }
            #${elementId} {
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 !important;
              padding: 4px !important;
              border: none !important;
              box-shadow: none !important;
              background-color: #ffffff !important;
              color: #000000 !important;
            }
            .print\\:hidden {
              display: none !important;
            }
          </style>
        </head>
        <body>
          <div style="width: 100%; background: #ffffff; color: #000000;">
            ${element.outerHTML}
          </div>
        </body>
      </html>
    `);
    doc.close();

    // Allow resources & images to render
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        resolve(true);
      } catch (err) {
        console.warn('Iframe print failed, falling back to window.print()', err);
        window.print();
        resolve(true);
      } finally {
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 3000);
      }
    }, 450);
  });
};

/**
 * Generate and download a PDF of the Registration Slip
 */
export const downloadDocketPDF = async (
  elementId: string,
  fileNamePrefix: string = 'UPRSA_Registration_Docket'
): Promise<boolean> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Registration Docket element not found');
  }

  // Generate canvas with html2canvas-pro (with full oklch color support)
  const canvas = await html2canvas(element, {
    scale: 2, // 2x high resolution
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    windowWidth: 1024,
    imageTimeout: 15000,
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.95);

  // A4 dimensions in mm: 210 x 297
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = 210;
  const pdfHeight = 297;
  let imgWidth = pdfWidth;
  let imgHeight = (canvas.height * pdfWidth) / canvas.width;

  // If the content is within 15% of A4 page height, scale to fit exactly 1 page
  if (imgHeight > pdfHeight && imgHeight <= pdfHeight * 1.15) {
    const scaleFactor = (pdfHeight - 2) / imgHeight;
    imgWidth = pdfWidth * scaleFactor;
    imgHeight = imgHeight * scaleFactor;
    const xOffset = (pdfWidth - imgWidth) / 2;
    pdf.addImage(imgData, 'JPEG', xOffset, 1, imgWidth, imgHeight);
  } else {
    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Add subsequent pages only if substantial content remains (> 15mm)
    while (heightLeft > 15) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }
  }

  const safeName = fileNamePrefix.replace(/[^a-zA-Z0-9_-]/g, '_');
  pdf.save(`${safeName}.pdf`);
  return true;
};

/**
 * Download the Registration Slip as a high-resolution PNG image
 */
export const downloadDocketImage = async (
  elementId: string,
  fileNamePrefix: string = 'UPRSA_Registration_Docket'
): Promise<boolean> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Registration Docket element not found');
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    windowWidth: 1024,
    imageTimeout: 15000,
  });

  const link = document.createElement('a');
  link.download = `${fileNamePrefix.replace(/[^a-zA-Z0-9_-]/g, '_')}.png`;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return true;
};
