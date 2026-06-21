import { connect } from "framer-api"

const PROJECT_URL = "https://framer.com/projects/systemlink-ch-2--OJrpYeSo4XOmvRRkt9O7-4Jt8d"

const payload = JSON.parse(process.env.ARTICLE_PAYLOAD)

const {
  slug,
  title,
  shortDescription = "",
  introHeader = "",
  content,
  articleType = "bbYlKoiV1",
  date = new Date().toISOString().split("T")[0],
  mainImageUrl = "",
  authorName = "",
  authorRole = "",
  authorImageUrl = "",
} = payload

if (!slug || !title || !content) {
  console.error("Missing required fields: slug, title, content")
  process.exit(1)
}

console.log(`Connecting to Framer...`)
const framer = await connect(PROJECT_URL)
console.log(`Connected.`)

const collections = await framer.getCollections()
const articles = collections.find(c => c.name === "Articles")

console.log(`Pushing article: "${title}"...`)
await articles.addItems([{
  slug,
  fieldData: {
    lykBqV4LS: { type: "string",        value: title },
    o4SXCAnQ0: { type: "string",        value: shortDescription },
    YjPZVq2pH: { type: "string",        value: introHeader },
    QRCJgS8I0: { type: "formattedText", value: content },
    uaSqZPqyE: { type: "enum",          value: articleType },
    fjIGNgJXm: { type: "date",          value: date },
    e2iT0TEOk: { type: "image",         value: mainImageUrl },
    Hvo4YvXge: { type: "string",        value: authorName },
    f3v9PL9tj: { type: "string",        value: authorRole },
    zBueKQ98m: { type: "image",         value: authorImageUrl },
  }
}])
console.log(`Article added. Publishing...`)

await framer.publish()
console.log(`Published live on systemlink.ch`)

await framer.disconnect()
