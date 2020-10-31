import * as fs from 'fs-extra'
import * as path from 'path'

async function main() {
  fs.copySync(
    path.resolve(__dirname, '../public'),
    path.resolve(__dirname, '../dist'),
    {
      dereference: true,
      filter: (file) =>
        file !== path.resolve(__dirname, '../public/index.html'),
    },
  )
}

main().catch((err) => {
  console.log(err)
  process.exit(1)
})
