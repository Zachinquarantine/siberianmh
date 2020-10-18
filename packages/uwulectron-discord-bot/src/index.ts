async function main() {
  Promise.reject()
}

main().catch((err) => {
  console.log(err)
  process.exit(1)
})
