/**
 * Scroll to a section by id.
 *
 * Cinematic worlds are pinned stages: landing exactly on the section's top edge
 * would show the charcoal handoff before the frame and copy have arrived, so a
 * world is entered a little way into its own travel (where the frame is up and
 * the copy has been revealed). Plain sections land on their top edge.
 */
const ENTRY_RATIO = 0.18;

export function scrollToSection(id, behavior = 'smooth') {
  const target = id ? document.getElementById(id) : null;
  if (!target) return false;

  const stage = target.querySelector('.world__stage');
  let offset = 0;

  if (stage && target.classList.contains('world')) {
    const travel = Math.max(0, target.offsetHeight - stage.offsetHeight);
    offset = Math.round(Math.min(travel * ENTRY_RATIO, window.innerHeight * 0.6));
  }

  const top = target.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top: Math.round(top), left: 0, behavior });
  return true;
}
