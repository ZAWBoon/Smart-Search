const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
app.use(express.json());

app.post("/search", async (req, res) => {
  const query = req.body.query;
  if (!query) return res.status(400).json({ error: "query is required" });

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://www.google.com");

  await page.type("input[name='q']", query);
  await page.keyboard.press("Enter");

  await page.waitForSelector("h3");
  const result = await page.evaluate(() => {
    const title = document.querySelector("h3")?.innerText;
    const link = document.querySelector("h3")?.parentElement?.href;
    return { title, link };
  });

  await browser.close();
  res.json(result);
});

app.listen(3000, () => console.log("Server running on port 3000"));
