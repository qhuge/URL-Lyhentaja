import prisma from "../lib/prisma.js";
import crypto from "crypto";

function generateCode(length = 4) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }

    return result;
}

async function validateTurnstile(token) {
  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_KEY,
          response: token,
        }),
      },
    );

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Turnstile validation error:", error);
    return { success: false, "error-codes": ["internal-error"] };
  }
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {

        //validate the turnstile
        const turnStile = await validateTurnstile(req.body.turnstileToken)

        if (!turnStile.success) {
            return res.status(401).json({ error: "Incorrect captcha" });
        }

        const url = req.body.url;

        if (!url) {
            return res.status(400).json({ error: "Missing URL" });
        }

        const isValidUrl = (string) => {
            try {
                new URL(string)
                return true
            } catch (err) {
                return false
            }
        }

        if (!isValidUrl(url)) {
            return res.status(400).json({ error: "Invalid url" });
        }

        //if url is alreadt shortened, just return that shortcode
        const existing = await prisma.url.findFirst({
            where: { originalUrl: url }
        });

        if (existing) {
            return res.status(200).json({
                shortCode: existing.shortCode,
                cached: true
            });
        }

        //create new shortcode, that is unique
        let shortCode;
        let exists = true;

        while (exists) {
            shortCode = generateCode(4);

            const found = await prisma.url.findUnique({
                where: { shortCode }
            });

            exists = !!found;
        }

        // basic short code

        const newUrl = await prisma.url.create({
            data: {
                originalUrl: url,
                shortCode,
            },
        });

        return res.status(200).json({
            shortCode: newUrl.shortCode,
            cached: false
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
}