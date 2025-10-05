import { useNavigate } from '@tanstack/solid-router'
import { createSignal, Show } from 'solid-js'
import { authClient } from '~/lib/auth-client'
import { toast } from 'solid-sonner'

export function RegisterForm() {
  const [error, setError] = createSignal('')
  const [loading, setLoading] = createSignal(false)
  const navigate = useNavigate()

  const handleRegister = async (e: SubmitEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    // Validate password confirmation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    setError('')

    authClient.signUp.email(
      {
        email: formData.get('email') as string,
        password: password,
        name: formData.get('name') as string,
      },
      {
        onSuccess: () => {
          toast.success('Registration successful!')
          navigate({ to: '/' })
        },
        onError: ({ error }) => {
          console.error(error, {
            email: formData.get('email') as string,
            name: formData.get('name') as string,
          })
          setError(error.message || 'Registration failed')
        },
        onResponse: () => {
          setLoading(false)
        },
      },
    )
  }

  return (
    <div class='w-full max-w-[400px]'>
      {/* Register Form */}
      <div class='text-center mb-8'>
        <h2 class="font-['Inter'] text-2xl text-neutral-900 mb-2">Register</h2>
        <p class="font-['Inter'] text-base text-neutral-600">Create your account</p>
      </div>

      {/* Error Message */}
      <Show when={error()}>
        <div class='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6'>
          {error()}
        </div>
      </Show>

      <form class='space-y-6' onSubmit={handleRegister}>
        <div>
          <label class="block font-['Inter'] text-sm text-neutral-700 mb-2">Name</label>
          <input
            type='text'
            name='name'
            placeholder='Your full name'
            required
            class='w-full h-[42px] px-3 border border-neutral-300 rounded-[6px] font-["Inter"] text-base text-neutral-900 placeholder:text-[#adaebc] focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent'
          />
        </div>

        <div>
          <label class="block font-['Inter'] text-sm text-neutral-700 mb-2">E-mail</label>
          <input
            type='email'
            name='email'
            placeholder='email@company.ru'
            required
            class='w-full h-[42px] px-3 border border-neutral-300 rounded-[6px] font-["Inter"] text-base text-neutral-900 placeholder:text-[#adaebc] focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent'
          />
        </div>

        <div>
          <label class="block font-['Inter'] text-sm text-neutral-700 mb-2">Password</label>
          <input
            type='password'
            name='password'
            placeholder='Enter password'
            required
            minLength={6}
            class='w-full h-[42px] px-3 border border-neutral-300 rounded-[6px] font-["Inter"] text-base text-neutral-900 placeholder:text-[#adaebc] focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent'
          />
        </div>

        <div>
          <label class="block font-['Inter'] text-sm text-neutral-700 mb-2">Confirm Password</label>
          <input
            type='password'
            name='confirmPassword'
            placeholder='Confirm password'
            required
            minLength={6}
            class='w-full h-[42px] px-3 border border-neutral-300 rounded-[6px] font-["Inter"] text-base text-neutral-900 placeholder:text-[#adaebc] focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent'
          />
        </div>

        <button
          type='submit'
          disabled={loading()}
          class='w-full h-[48px] bg-neutral-900 text-white rounded-[6px] font-["Inter"] text-base hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <Show when={loading()} fallback={<span>Register</span>}>
            <span>Creating account...</span>
          </Show>
        </button>
      </form>
    </div>
  )
}
