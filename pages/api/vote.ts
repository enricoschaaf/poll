import { PrismaClient } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

const prisma = new PrismaClient()

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    if (req.body?.option) {
      const { votes } = await prisma.option.findOne({
        select: { votes: true },
        where: { id: req.body.option }
      })
      await prisma.option.update({
        data: { votes: votes + 1 },
        where: { id: req.body.option }
      })
    }
    const options = await Promise.all(
      Object.entries(req.body)
        .filter(([, value]) => value === true)
        .map(([id]) => {
          return prisma.option.findOne({
            select: { id: true, votes: true },
            where: { id }
          })
        })
    )
    await Promise.all(
      options.map(({ id, votes }) =>
        prisma.option.update({ data: { votes: votes + 1 }, where: { id } })
      )
    )
    res.end()
  }

  res.status(405)
}
