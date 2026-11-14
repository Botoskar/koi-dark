import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { koiMosaicSvg } from './koi-mosaic'

const { theme, problems } = makeColors({
  label: 'Koi Dark',
  only: 'dark',
  roles: { accent: '#ee8a4a', danger: '#e0584a', success: '#57b56f', warning: '#eec25a', pro: '#e79ab8' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0b1a1f',
        'surface-1': '#0f2127',
        'surface-2': '#13282f',
        'surface-3': '#13282f',
        'text-primary': '#e6f2ee',
        'text-secondary': '#bcd3cc',
        'text-muted': '#93b0a8',
      },
    },
  },
})

const GLASS = { blur: 12, tint: '#0a1a20', opacity: 0.5 }
const IDLE = 'koi-dark'
const LOAD_LAG_MS = 150

// A new scene name makes the app redraw the scene, so each show starts afresh: IDLE is the pond alone, and every other name, `koi-dark-<show>-<milliseconds so far>`, is the pond with that show's fireworks, its loops started that far in.
const look = (scene: string): ThemeSetArgs => ({
  colors: theme,
  overrideColorScheme: 'dark',
  backdrop: { scene, glass: GLASS },
})

export const register: Register = on => {
  let applied = false
  let shows = 0
  // When the pond began running, so a new scene can start its looping animations that far in.
  let startedAt = 0

  // /custom-theme off, or another mod, can clear the theme: put ours back once if a turn finds it never set.
  on('turn.start', async ($, e, next) => {
    if (!applied) {
      applied = true
      startedAt = await $.clock.now()
      await $.theme.set(look(IDLE))
    }
    return next(e)
  })

  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))
    if (unpainted !== undefined) $.ui.toast(unpainted)
    applied = true
    startedAt = await $.clock.now()
    await $.theme.set(look(IDLE))
    return next(e)
  })

  // The set waits a moment: set at the very end of a turn, the scene came up frozen.
  on('turn.complete', ($, e, next) => {
    if (e.reason === 'answer') {
      shows += 1
      const show = shows
      $.clock.after(1500, async () => {
        // In milliseconds, plus what the app takes to load the scene, so the loops pick up where they were.
        const elapsed = Math.round((await $.clock.now()) - startedAt + LOAD_LAG_MS)
        await $.theme.set(look(`${IDLE}-${show}-${elapsed}`))
      })
    }
    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') return next(e)
    if (!e.props.scene.startsWith(IDLE)) return next(e)
    const { Svg } = $.ui.resolve(e)
    const [show, elapsed] = e.props.scene.slice(IDLE.length + 1).split('-').map(Number)
    return <Svg source={koiMosaicSvg(show || 0, (elapsed || 0) / 1000)} alt="A dark tiled koi pond at night" isInteractive />
  })
}
