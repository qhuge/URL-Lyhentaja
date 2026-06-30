import prisma from "../lib/prisma.js";

export default async function handler(req, res) {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ valid: false });
    }

    const session = await prisma.session.findUnique({
        where: { token }
    });

    //Delete the entry if its expired and return valid: false to the user
    if (!session || session.expiresAt < new Date()) {
        if (session) {
            await prisma.session.delete({
                where: { token }
            });
        }

        return res.status(401).json({ valid: false });
    }

    //else return valid:true
    return res.status(200).json({ valid: true });
}