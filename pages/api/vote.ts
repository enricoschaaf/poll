import { PrismaClient } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

const prisma = new PrismaClient()

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const ip: any = req.headers["x-real-ip"]
    if (req.body.option) {
      const {
        votes,
        Poll: { Blacklist: blacklist, id: pollId }
      } = await prisma.option.findOne({
        select: {
          votes: true,
          Poll: {
            select: {
              Blacklist: {
                where: { ip: { equals: ip } }
              },
              id: true
            }
          }
        },
        where: { id: req.body.option }
      })
      if (blacklist.length === 0) {
        await Promise.all([
          prisma.option.update({
            data: { votes: votes + 1 },
            where: { id: req.body.option }
          }),
          prisma.ip.create({
            data: {
              Poll: { connect: { id: pollId } },
              ip
            }
          })
        ])
        res.end()
      }
      res.status(403)
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
        prisma.option.update({
          data: { votes: votes + 1 },
          where: { id }
        })
      )
    )
    res.end()
  }

  res.status(405)
}
