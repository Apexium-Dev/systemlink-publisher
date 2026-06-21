import { connect } from "framer-api"
import "dotenv/config"

const PROJECT_URL = "https://framer.com/projects/systemlink-ch-2--OJrpYeSo4XOmvRRkt9O7-4Jt8d"

// Field IDs
// e2iT0TEOk  image         Main Image
// fjIGNgJXm  date          Date
// uaSqZPqyE  enum          Article Type — valid values (use the ID, not the name):
//                            bbYlKoiV1 = "ROI & Strategy"
//                            Nwd0e1xs1 = "Implementation"
//                            vYwBiJqxd = "Technology Selection"
//                            RPk0dEsKN = "Risk Management"
// lykBqV4LS  string        Title
// o4SXCAnQ0  string        Short Description
// YjPZVq2pH  string        Intro Header
// QRCJgS8I0  formattedText Content
// Hvo4YvXge  string        Author Name
// f3v9PL9tj  string        Author Role
// zBueKQ98m  image         Author Image

async function pushArticle({
  slug,
  title,
  shortDescription,
  introHeader,
  content,          // HTML string
  articleType,      // must match one of the enum values in Framer
  date,             // ISO string e.g. "2026-06-21"
  mainImageUrl,     // public URL
  authorName,
  authorRole,
  authorImageUrl,   // public URL
}) {
  console.log(`Connecting to Framer...`)
  const framer = await connect(PROJECT_URL)
  console.log(`Connected.`)

  const collections = await framer.getCollections()
  const articles = collections.find(c => c.name === "Articles")

  console.log(`Pushing article: "${title}"...`)
  await articles.addItems([
    {
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
      },
    },
  ])
  console.log(`Article added.`)

  console.log(`Publishing...`)
  await framer.publish()
  console.log(`Published live.`)

  await framer.disconnect()
}

// --- TEST: run this once to confirm everything works ---
await pushArticle({
  slug:             "test-article-1",
  title:            "Test Article",
  shortDescription: "This is a test article pushed via the Framer API.",
  introHeader:      "Welcome to the test",
  content:          "<p>This is the <strong>body content</strong> of the test article.</p>",
  articleType:      "bbYlKoiV1",   // ROI & Strategy
  date:             "2026-06-21",
  mainImageUrl:     "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
  authorName:       "Test Author",
  authorRole:       "Writer",
  authorImageUrl:   "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
})
