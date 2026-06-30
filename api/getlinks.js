import prisma from "../lib/prisma.js";

export default async function handler(req, res) {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json();
    }

    const session = await prisma.session.findUnique({
        where: { token }
    });

    //Delete the entry if its expired and return error
    if (!session || session.expiresAt < new Date()) {
        if (session) {
            await prisma.session.delete({
                where: { token }
            });
        }

        return res.status(401).json();
    }

    //return all links to the user when authenticated
    const urls = await prisma.url.findMany({ orderBy: { createdAt: "desc" } });

    return res.status(200).json(urls);
}