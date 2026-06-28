import prisma from "../lib/prisma.js";

export default async function handler(req, res) {
    try {
        const { shortCode } = req.query;

        if (!shortCode) {
            return res.status(400).json({ error: "Missing short code" });
        }

        //find url
        const url = await prisma.url.findUnique({
            where: { shortCode }
        });

        // If not found show 404
        if (!url) {
            return res.status(404).send("Short link not found");
        }

        //statistics
        await prisma.url.update({
            where: { shortCode },
            data: {
                clicks: { increment: 1 }
            }
        });

        // redirect
        return res.redirect(url.originalUrl);

    } catch (err) {
        console.error(err);
        return res.status(500).send("Server error");
    }
}