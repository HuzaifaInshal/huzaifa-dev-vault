import type React from 'react'

export function handleRippleAnimation(
  event: React.MouseEvent<HTMLElement>,
  rippleClassName = 'bg-white/35',
) {
  const target = event.currentTarget
  const rect = target.getBoundingClientRect()

  const ripple = document.createElement('span')
  const size = Math.max(rect.width, rect.height)

  ripple.className = `ripple ${rippleClassName}`.trim()
  ripple.style.width = `${size}px`
  ripple.style.height = `${size}px`
  ripple.style.left = `${event.clientX - rect.left - size / 2}px`
  ripple.style.top = `${event.clientY - rect.top - size / 2}px`

  const existingRipple = target.getElementsByClassName('ripple')[0]
  if (existingRipple) {
    existingRipple.remove()
  }

  target.appendChild(ripple)
  ripple.addEventListener('animationend', () => ripple.remove(), { once: true })
}
