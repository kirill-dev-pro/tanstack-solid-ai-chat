import { useNavigate } from '@tanstack/solid-router'
import { Accessor, createSignal, Show } from 'solid-js'
import { authClient } from '~/lib/auth-client'
import { toast } from 'solid-sonner'

export function LoginForm({ redirect }: { redirect?: string }) {
  const [error, setError] = createSignal('')
  const [loading, setLoading] = createSignal(false)
  const navigate = useNavigate()

  const handleLogin = async (e: SubmitEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    setLoading(true)
    setError('')

    authClient.signIn.email(
      {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      },
      {
        onSuccess: () => {
          navigate({ to: redirect || '/' })
        },
        onError: ({ error }) => {
          console.error(error, {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
          })
          setError(error.message || 'Login failed')
        },
        onResponse: () => {
          setLoading(false)
        },
      },
    )
  }

  return (
    <div class='w-full max-w-[400px]'>
      {/* Login Form */}
      <div class='text-center mb-8'>
        <h2 class="font-['Inter'] text-2xl text-neutral-900 mb-2">Login</h2>
        <p class="font-['Inter'] text-base text-neutral-600">Login to your account</p>
      </div>

      {/* Error Message */}
      <Show when={error()}>
        <div class='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6'>
          {error()}
        </div>
      </Show>

      <form class='space-y-6' onSubmit={handleLogin}>
        <div>
          <label class="block font-['Inter'] text-sm text-neutral-700 mb-2">E-mail</label>
          <input
            type='email'
            name='email'
            placeholder='email@company.ru'
            class='w-full h-[42px] px-3 border border-neutral-300 rounded-[6px] font-["Inter"] text-base text-neutral-900 placeholder:text-[#adaebc] focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent'
          />
        </div>

        <div>
          <label class="block font-['Inter'] text-sm text-neutral-700 mb-2">Пароль</label>
          <input
            type='password'
            name='password'
            placeholder='Введите пароль'
            class='w-full h-[42px] px-3 border border-neutral-300 rounded-[6px] font-["Inter"] text-base text-neutral-900 placeholder:text-[#adaebc] focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent'
          />
        </div>

        <div
          class='flex items-center justify-between'
          onClick={() => toast.info('Too bad', { id: 'forgot-password' })}
        >
          <a href='#' class="font-['Inter'] text-sm text-neutral-900 underline">
            Forgot password?
          </a>
        </div>

        <button
          type='submit'
          disabled={loading()}
          class='w-full h-[48px] bg-neutral-900 text-white rounded-[6px] font-["Inter"] text-base hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <Show when={loading()} fallback={<span>Login</span>}>
            <span>Loading...</span>
          </Show>
        </button>
      </form>
    </div>
  )
}
