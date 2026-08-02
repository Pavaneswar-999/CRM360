import { app } from './app.js'
import { connectDatabase } from './db.js'
import { env } from './config/env.js'

const start = async () => {
  await connectDatabase()
  app.listen(env.PORT, () => console.log(`CRM360 API listening on ${env.PORT}`))
}
start().catch((error) => { console.error('Unable to start CRM360 API', error); process.exit(1) })
