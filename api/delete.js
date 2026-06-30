import prisma from "../lib/prisma.js";

export default async function handler(req, res) {
    const token = req.headers.authorization?.replace("Bearer ", "");

    const session = await prisma.session.findUnique({
        where: { token }
    });

    if (!session || session.expiresAt < new Date()) {
        if (session) {
            await prisma.session.delete({
                where: { token }
            });
        }

        return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.body;

    await prisma.url.delete({
        where: { id }
    });

    return res.json({ success: true });
}