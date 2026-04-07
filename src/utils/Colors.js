/**
 * TallyDekho Design System — Mobile
 *
 * Base: Pure black (#000000) and white (#FFFFFF)
 * Grays: True neutral grayscale — no warm tints
 * Accent: Single teal, used only for functional states
 * Semantic: Error / warning / success for data only
 */

const Colors = {
  // ─── Base ─────────────────────────────────────────────────────────────────
  white:          '#FFFFFF',
  black:          '#000000',

  // ─── Surface (backgrounds) ────────────────────────────────────────────────
  bgPrimary:      '#FFFFFF',           // main screen background — pure white
  bgSecondary:    '#F5F5F5',           // cards, sheets — light gray
  bgTertiary:     '#EBEBEB',           // hover, pressed, chip background
  bgInverse:      '#111111',           // dark surfaces — near black

  // ─── Text ─────────────────────────────────────────────────────────────────
  textPrimary:    '#000000',           // headings, primary data
  textSecondary:  '#555555',           // labels, subtext
  textTertiary:   '#999999',           // placeholder, disabled, hints
  textInverse:    '#FFFFFF',           // text on dark surfaces

  // Aliases (backward compat)
  primaryText:    '#000000',
  secondaryText:  '#555555',
  primaryTitle:   '#000000',
  placeholder:    '#999999',

  // ─── Border ───────────────────────────────────────────────────────────────
  border:         '#E0E0E0',           // default — inputs, cards
  borderStrong:   '#BBBBBB',           // focused, emphasized
  borderSubtle:   '#F0F0F0',           // inner dividers

  // ─── Brand Accent ─────────────────────────────────────────────────────────
  // Used sparingly: CTA buttons, active tab indicator, key highlights
  primary:        '#059669',
  primaryLight:   '#D1FAE5',
  primaryDark:    '#047857',

  // ─── Semantic (data states only — never decorative) ───────────────────────
  success:        '#059669',
  successBg:      '#D1FAE5',
  error:          '#DC2626',
  errorBg:        '#FEE2E2',
  warning:        '#D97706',
  warningBg:      '#FEF3C7',
  info:           '#2563EB',
  infoBg:         '#DBEAFE',

  // ─── Icons ────────────────────────────────────────────────────────────────
  IconColor:      '#999999',           // inactive icons
  IconActive:     '#000000',           // active / selected icons

  // ─── Legacy aliases ───────────────────────────────────────────────────────
  backgroundColorPrimary: '#FFFFFF',
};

/**
 * Shadow utility — clean, minimal
 */
export const getShadowStyle = (elevation = 4, options = {}) => {
  const {
    shadowColor   = '#000000',
    shadowOpacity = 0.08,
    shadowRadius  = elevation * 0.5,
    shadowOffset  = {width: 0, height: elevation * 0.4},
  } = options;

  return {
    elevation,
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
  };
};

export default Colors;
