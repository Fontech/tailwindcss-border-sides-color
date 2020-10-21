const _ = require('lodash')
const createColor = require('color')
const plugin = require('tailwindcss/plugin')
const flattenColorPalette = require('tailwindcss/lib/util/flattenColorPalette').default

const sides = {
  t: 'top',
  r: 'right',
  b: 'bottom',
  l: 'left'
}

const hasAlpha = (color) => {
  return (
    color.startsWith('rgba(') ||
    color.startsWith('hsla(') ||
    (color.startsWith('#') && color.length === 9) ||
    (color.startsWith('#') && color.length === 5)
  )
}


const toRgba = (color) => {
  const [r, g, b, a] = createColor(color).rgb().array()

  return [r, g, b, a === undefined && hasAlpha(color) ? 1 : a]
}

const withAlphaVariable = ({ color, property, variable }) => {
  if (_.isFunction(color)) {
    return {
      [variable]: '1',
      [property]: color({ opacityVariable: variable })
    }
  }

  try {
    const [r, g, b, a] = toRgba(color)

    if (a !== undefined) {
      return { [property]: color }
    }

    return {
      [variable]: '1',
      [property]: `rgba(${r}, ${g}, ${b}, var(${variable}))`,
    }
  } catch (error) {
    return { [property]: color }
  }
}

const toColorValue = (maybeFunction) => {
  return _.isFunction(maybeFunction) ? maybeFunction({}) : maybeFunction
}

module.exports = plugin(({ theme, e, addUtilities, variants, corePlugins }) => {
  const getProperties = ({ side, color }) => {
    const property = `border-${side}-color`
    const variable = '--border-opacity'

    if (corePlugins('borderOpacity')) {
      return withAlphaVariable({ color, property, variable })
    }

    return { [property]: toColorValue(color) }
  }

  const colors = flattenColorPalette(theme('borderColor'))
  const utilities = {}

  for (const colorModifier in colors) {
    if (colorModifier === 'default') {
      continue
    }


    for (const sideModifier in sides) {
      const side = sides[sideModifier]
      const color = colors[colorModifier]

      utilities[`.${e(`border-${sideModifier}-${colorModifier}`)}`] = getProperties({ side, color })
    }
  }

  addUtilities(utilities, variants('borderColor'))
})
