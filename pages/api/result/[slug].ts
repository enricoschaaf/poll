import { PrismaClient } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

const prisma = new PrismaClient()

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { slug }: any = req.query
    const data = await prisma.poll.findOne({
      where: { slug },
      select: {
        options: {
          orderBy: { votes: "desc" },
          select: { id: true, name: true, votes: true }
        }
      }
    })
    res.json(data)
  }

  res.status(405)
}
