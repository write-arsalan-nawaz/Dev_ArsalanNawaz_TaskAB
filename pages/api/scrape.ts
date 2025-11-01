import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Invalid URL" });
  }

  try {
    new URL(url);
  } catch {
    return res.status(400).json({ error: "Invalid URL" });
  }

  const timeoutMs = 20000;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.setUserAgent("Mozilla/5.0 (compatible; MicroScraper/1.0)");

    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: timeoutMs,
    });

    const data = await page.evaluate(() => {
      const title = document.querySelector("title")?.innerText || null;
      const metaDescription =
        document.querySelector("meta[name='description']")?.getAttribute("content") || null;
      const h1 = document.querySelector("h1")?.innerText || null;
      return { title, metaDescription, h1 };
    });

    await browser.close();
    clearTimeout(timeout);

    return res.status(200).json({ ...data, status: 200 });
  } catch (err: any) {
    clearTimeout(timeout);

    if (err.name === "AbortError") {
      return res.status(504).json({ error: "Timeout" });
    }

    return res.status(500).json({ error: "Failed to scrape page", details: err.message });
  }
}
