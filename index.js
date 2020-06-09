const plugin = require('tailwindcss/plugin')
const flattenColorPalette = require('tailwindcss/lib/util/flattenColorPalette').default

const sides = {
  t: 'top',
  r: 'right',
  b: 'bottom',
  l: 'left'
}

module.exports = plugin(({ theme, e, addUtilities, variants }) => {
  const colors = flattenColorPalette(theme('borderColor'))
  const utilities = {}

  for (const colorModifier in colors) {
    if (colorModifier === 'default') {
      continue
    }

    for (const sideModifier in sides) {
      const side = sides[sideModifier]
      const color = colors[colorModifier]

      utilities[`.${e(`border-${sideModifier}-${colorModifier}`)}`] = {
        [`border-${side}-color`]: color
      }
    }
  }

  addUtilities(utilities, variants('borderColor'))
})
