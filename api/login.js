import crypto from "crypto";
import prisma from "../lib/prisma.js";

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
  try {

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    //validate the turnstile
    const turnStile = await validateTurnstile(req.body.turnstileToken)

    if (!turnStile.success) {
      return res.status(401).json({ error: "Incorrect captcha" });
    }

    const username = req.body.username;
    const password = req.body.password;

    const ADMIN_USER = process.env.ADMIN_USERNAME;
    const ADMIN_PASS = process.env.ADMIN_PASSWORD;

    if (!ADMIN_USER || !ADMIN_PASS) {
      return res.status(500).json({ error: "Server misconfigured" });
    }

    // simple credential check
    if (username !== ADMIN_USER || password !== ADMIN_PASS) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // VERY simple token (replace with JWT later)
    const token = crypto.randomUUID();

    await prisma.session.create({
      data: {
        token,
        username: username,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return res.status(200).json({
      success: true,
      token
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: err.message,
    });
  }

}