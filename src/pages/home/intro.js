/**
 * The home page's staged entrance — navbar logo, then navbar, then status,
 * then the hero card — plays once per page load: on the first visit to home,
 * not every time someone comes back to it from another page.
 *
 * When the preloader has just played, the entrance starts a little later, so
 * the logo arrives as the preloader's power-off collapses rather than behind
 * it. Module state is enough: it only has to outlive route changes, not
 * reloads.
 */
const AFTER_PRELOADER_S = 0.35
const NO_PRELOADER_S = 0.1

let base = NO_PRELOADER_S
let played = false

/** Called by the app when the preloader hands over. */
export function introAfterPreloader() {
  base = AFTER_PRELOADER_S
}

/** Pure read, safe in render: should this mount stage its entrance? */
export function peekIntro() {
  return { enabled: !played, base }
}

/** Called once the entrance has been mounted; later mounts show at once. */
export function markIntroPlayed() {
  played = true
}
