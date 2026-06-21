import { connect } from "framer-api"

const PROJECT_URL = "https://framer.com/projects/systemlink-ch-2--OJrpYeSo4XOmvRRkt9O7-4Jt8d"

// Article Type enum IDs:
//   bbYlKoiV1 = ROI & Strategy
//   Nwd0e1xs1 = Implementation
//   vYwBiJqxd = Technology Selection
//   RPk0dEsKN = Risk Management

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  // Simple secret check so only Zapier can trigger this
  if (req.headers["x-secret"] !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const {
    slug,
    title,
    shortDescription,
    introHeader,
    content,
    articleType,
    date,
    mainImageUrl,
    authorName,
    authorRole,
    authorImageUrl,
  } = req.body

  if (!slug || !title || !content) {
    return res.status(400).json({ error: "Missing required fields: slug, title, content" })
  }

  try {
    const framer = await connect(PROJECT_URL)
    const collections = await framer.getCollections()
    const articles = collections.find(c => c.name === "Articles")

    await articles.addItems([
      {
        slug,
        fieldData: {
          lykBqV4LS: { type: "string",        value: title },
          o4SXCAnQ0: { type: "string",        value: shortDescription ?? "" },
          YjPZVq2pH: { type: "string",        value: introHeader ?? "" },
          QRCJgS8I0: { type: "formattedText", value: content },
          uaSqZPqyE: { type: "enum",          value: articleType ?? "bbYlKoiV1" },
          fjIGNgJXm: { type: "date",          value: date ?? new Date().toISOString().split("T")[0] },
          e2iT0TEOk: { type: "image",         value: mainImageUrl ?? "" },
          Hvo4YvXge: { type: "string",        value: authorName ?? "" },
          f3v9PL9tj: { type: "string",        value: authorRole ?? "" },
          zBueKQ98m: { type: "image",         value: authorImageUrl ?? "" },
        },
      },
    ])

    await framer.publish()
    await framer.disconnect()

    return res.status(200).json({ success: true, slug })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err.message })
  }
}
