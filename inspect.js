import { connect } from "framer-api"
import "dotenv/config"

const PROJECT_URL = "https://framer.com/projects/systemlink-ch-2--OJrpYeSo4XOmvRRkt9O7-4Jt8d"

console.log("Connecting to Framer...")
const framer = await connect(PROJECT_URL)
console.log("Connected.")

console.log("Fetching collections...")
const collections = await framer.getCollections()
console.log("\n=== Collections ===")
collections.forEach(c => console.log(`  id: ${c.id}  name: ${c.name}`))

const articles = collections.find(c => c.name.toLowerCase() === "articles")
if (!articles) {
  console.error('\nNo collection named "articles" found. Check the names above and update the script.')
  await framer.disconnect()
  process.exit(1)
}

console.log("\nFetching fields for 'articles'...")
const fields = await articles.getFields()
console.log("\n=== Fields in 'articles' collection ===")
fields.forEach(f => console.log(`  id: ${f.id}  type: ${f.type}  name: ${f.name}`))

console.log("\nDone.")
await framer.disconnect()
