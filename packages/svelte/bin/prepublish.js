const PUBLISH_CONFIRM = !!(process.env.PUBLISH_CONFIRM)

if (!PUBLISH_CONFIRM) {
  console.error("!!! Confirm flag and dir: `PUBLISH_CONFIRM=1 pnpm publish package/` !!!\n")
  process.exit(1)
}

