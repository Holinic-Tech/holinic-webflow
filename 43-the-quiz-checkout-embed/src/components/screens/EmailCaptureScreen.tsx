/**
 * Presentational email-capture screen (idx-18). Controlled name + email inputs
 * whose values + change handlers are owned by the parent (`QuizApp`). The whole
 * form — including the orange Submit button INSIDE the gradient card — lives here
 * (matching the golden, which has no sticky bottom CTA on this screen). It knows
 * NOTHING about the spec, the store, or tracking; the store wires
 * webhook/Converge/tracking downstream.
 *
 * Layout (top → bottom): title → subhead → conditional concern line + 🔒 →
 * progress bar → gradient form card (header + Name + Email + Submit) → privacy.
 */
export interface EmailCaptureScreenProps {
  /** Big page headline ("Your results are ready!"). Falls back to `headline`. */
  title?: string
  subhead?: string
  /** Conditional "Probability to fix your … in 14 days:" line (resolved upstream). */
  concernLine?: string
  /** Card header text; '\n' becomes a line break. */
  cardHeader?: string
  privacy?: string
  submitLabel?: string
  /** Back-compat single line (used as the title when `title` is absent). */
  headline: string
  name: string
  email: string
  onNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onSubmit: () => void
}

export function EmailCaptureScreen({
  title,
  subhead,
  concernLine,
  cardHeader = 'Enter your details\nto unlock your results 🔐',
  privacy = 'Your info is 100% secure and never shared with third parties.',
  submitLabel = 'Submit',
  headline,
  name,
  email,
  onNameChange,
  onEmailChange,
  onSubmit,
}: EmailCaptureScreenProps) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit()
  }

  const heading = title ?? headline

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 px-5 pb-8 pt-3">
      <h1 className="text-center text-[30px] font-medium leading-tight text-rich-black">
        {heading}
      </h1>
      {subhead && (
        <p className="text-center text-base leading-snug text-rich-black">{subhead}</p>
      )}

      {concernLine && (
        <div className="mt-1 flex flex-col gap-1.5">
          <p className="text-center text-sm font-medium text-rich-black">
            {concernLine} 🔒
          </p>
          <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-200">
            <div className="h-full w-[80%] rounded-full bg-gradient-to-r from-plum via-periwinkle to-almond-warm" />
          </div>
        </div>
      )}

      {/* Gradient form card */}
      <div className="mt-2 flex flex-col gap-4 rounded-2xl border border-plum/40 bg-gradient-to-br from-periwinkle/50 via-violet to-periwinkle/40 p-5">
        <p className="whitespace-pre-line text-center text-lg font-semibold leading-snug text-rich-black">
          {cardHeader}
        </p>
        <label className="sr-only" htmlFor="email-name">
          Name
        </label>
        <input
          id="email-name"
          type="text"
          placeholder="Name"
          aria-label="Name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          autoComplete="name"
          className="rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-base text-rich-black outline-none transition-colors placeholder:text-shadow focus:border-plum"
        />
        <label className="sr-only" htmlFor="email-email">
          Email
        </label>
        <input
          id="email-email"
          type="email"
          placeholder="Email"
          aria-label="Email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          autoComplete="email"
          className="rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-base text-rich-black outline-none transition-colors placeholder:text-shadow focus:border-plum"
        />
        <button
          type="submit"
          className="rounded-full bg-cta-orange px-4 py-4 text-center text-base font-semibold text-white transition-colors hover:bg-cta-orange-deep"
        >
          {submitLabel}
        </button>
      </div>

      <p className="mt-3 text-center text-sm text-neutral-400">{privacy}</p>
    </form>
  )
}

/** Trim + validate the email-capture form (shared with the bottom-CTA wiring). */
export function isEmailFormValid(name: string, email: string): boolean {
  const n = name.trim()
  const e = email.trim()
  return n.length > 0 && e.includes('@') && e.includes('.')
}
