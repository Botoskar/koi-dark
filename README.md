# koi-dark

A mod for the **Claude Code desktop app**: the Koi Mosaic pond in a dark theme, with koi, lily pads and ripples drifting behind the conversation, and a burst of tile fireworks (each with a water ring) every time Claude finishes a reply.

- Dark colors for the whole Code tab, in a teal that keeps text readable.
- Two tiled koi swim down the sides of the window; the pads and ripples move too.
- When a reply ends, nine fireworks open across the whole background for a few seconds.
- The pond carries on where it was when the fireworks start, so the fish don't jump.

## Install

In a terminal session of Claude Code:

```
/plugin install koi-dark --marketplace Botoskar/koi-dark
```

Answer `y` to add the marketplace, then pick a scope. From a shell:

```
claude plugin install koi-dark --marketplace Botoskar/koi-dark
```

In the desktop app, where `/plugin` does not run: click **+** next to the prompt box, then **Plugins**, **Add marketplace** with `Botoskar/koi-dark`, then **Add plugin**.

## Notes

- It draws in the desktop and mobile apps only. The terminal draws no backdrop.
- A session has one theme. This mod sets its theme and replaces any other mod's colors or backdrop, so use it instead of another theme mod, not with one. If another theme (for example `/custom-theme` from `theme-examples`) is on, turn that one off first.
- The fireworks start 1.5 seconds after a reply ends, by setting the theme again with a new scene name, so the app redraws the scene.
- If your system asks for reduced motion, the scene's animations are switched off.
- Needs a Claude Code version that has `$.theme.set` with scenes (v2.1.323 or later) and colors (v2.1.324 or later).

## How it works

`hooks/register.tsx` sets the theme once and again after each reply; `hooks/koi-mosaic.ts` builds the pond as one SVG whose animation is plain CSS; `hooks/make-colors.js` is the color helper that ships with Claude Code's mod-authoring tools, unchanged.

## Credits and license

The pond scene is adapted from the Koi Mosaic scene of the `theme-examples` plugin by Anthropic, from the `claude-plugins-official` marketplace, with a dark palette, the fireworks and the time offset added. `make-colors.js` is copied unchanged from Claude Code's plugin-authoring tools.

Licensed under the Apache License 2.0: see `LICENSE`.
