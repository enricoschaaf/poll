import { PrismaClient } from "@prisma/client"
import { nanoid } from "nanoid"
import { NextApiRequest, NextApiResponse } from "next"

const prisma = new PrismaClient()

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { title, options, allowMultipleOptions } = req.body

    const { id, slug } = await prisma.poll.create({
      select: { id: true, slug: true },
      data: {
        title,
        slug: nanoid(7),
        allowMultipleOptions
      }
    })
    await Promise.all(
      options.map(option =>
        prisma.option.create({
          data: { name: option, Poll: { connect: { id } } }
        })
      )
    )
    res.json({ data: { slug } })
  }

  res.status(405)
}
