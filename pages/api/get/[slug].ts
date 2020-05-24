import { PrismaClient } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

const prisma = new PrismaClient()

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { slug }: any = req.query
    const data = await prisma.poll.findOne({
      select: {
        title: true,
        options: { select: { id: true, name: true, votes: true } },
        allowMultipleOptions: true
      },
      where: { slug }
    })
    res.json({ data })
  }

  res.status(405)
}
