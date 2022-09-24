const PUBLISH_CONFIRM = !!(process.env.PUBLISH_CONFIRM)

if (!PUBLISH_CONFIRM) {
  console.error('Please confirm: `PUBLISH_CONFIRM=1 pnpm publish package/`')
  process.exit(1)
}

