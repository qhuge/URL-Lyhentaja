import prisma from "../lib/prisma.js";

export default async function handler(req, res) {
    const token = req.headers.authorization?.replace("Bearer ", "");

    const session = await prisma.session.findUnique({
        where: { token }
    });

    if (!session || session.expiresAt < new Date()) {
        await prisma.session.delete({
            where: { token }
        });

        return res.status(401).json({ error: "Unauthorized" });
    }

    const { id, newCode } = req.body;

    try {
        const updated = await prisma.url.update({
            where: { id },
            data: { shortCode: newCode }
        });

        return res.json(updated);
    } catch (err) {
        return res.status(400).json({ error: "Code already exists or invalid" });
    }
}