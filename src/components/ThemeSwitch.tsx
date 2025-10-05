import { createSignal, createEffect, Show } from 'solid-js'
import { Button } from '~/components/ui/button'

export function ThemeSwitch() {
  const [theme, setTheme] = createSignal<'light' | 'dark'>('light')

  // Initialize theme from localStorage or system preference
  createEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme) {
      setTheme(savedTheme as 'light' | 'dark')
    } else {
      setTheme(systemPrefersDark ? 'dark' : 'light')
    }
  })

  // Apply theme to document
  createEffect(() => {
    const root = document.documentElement
    if (theme() === 'dark') {
      root.classList.add('dark')
      root.setAttribute('data-kb-theme', 'dark')
    } else {
      root.classList.remove('dark')
      root.setAttribute('data-kb-theme', 'light')
    }
    localStorage.setItem('theme', theme())
  })

  const toggleTheme = () => {
    setTheme(theme() === 'light' ? 'dark' : 'light')
  }

  return (
    <Button variant='outline' size='sm' onClick={toggleTheme} class='flex items-center gap-2'>
      <Show
        when={theme() === 'light'}
        fallback={
          <svg class='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='2'
              d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
            />
          </svg>
        }
      >
        <svg class='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            stroke-linecap='round'
            stroke-linejoin='round'
            stroke-width='2'
            d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
          />
        </svg>
      </Show>
      <span class='text-xs'>{theme() === 'light' ? 'Dark' : 'Light'}</span>
    </Button>
  )
}
