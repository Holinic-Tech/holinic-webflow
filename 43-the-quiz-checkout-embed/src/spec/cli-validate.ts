import { hairquizSpec } from '../quiz/hairquiz.spec'
import { validateSpec } from './validate'

// This CLI backs `npm run validate` and acts as the CI gate that stops a
// mis-wired spec from shipping. It guards the REAL production spec.
const errors = validateSpec(hairquizSpec)

if (errors.length > 0) {
  console.error(`spec invalid (${errors.length} error${errors.length === 1 ? '' : 's'}):`)
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}

console.log('spec valid')
