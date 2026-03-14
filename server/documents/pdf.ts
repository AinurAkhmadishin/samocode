import { chromium } from "playwright";

export async function generatePdfFromHtml(html: string) {
  const browser = await chromium.launch({
    headless: true,
    executablePath: chromium.executablePath(),
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    await page.emulateMedia({ media: "print" });

    return await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "16mm",
        right: "14mm",
        bottom: "16mm",
        left: "14mm",
      },
    });
  } finally {
    await browser.close();
  }
}
