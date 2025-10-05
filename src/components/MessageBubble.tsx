import { Card } from '~/components/ui/card'
import { cn } from '~/utils/cn'
import { createMemo, Show } from 'solid-js'
import { DbMessage } from '~/routes/_authed/chat'

export function MessageBubble(props: { message: DbMessage }) {
  const isUser = createMemo(() => props.message.role === 'user')

  return (
    <div class={cn('flex gap-3', isUser() ? 'justify-end' : 'justify-start')}>
      <Show when={!isUser()}>
        <div class='w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1'>
          <svg
            class='w-4 h-4 text-primary-foreground'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='2'
              d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
            />
          </svg>
        </div>
      </Show>

      <div class={cn('max-w-[80%]', isUser() ? 'order-first' : '')}>
        <Card
          class={cn(
            'p-4 shadow-sm',
            isUser() ? 'bg-primary text-primary-foreground' : 'bg-background border border-border',
          )}
        >
          <div class='whitespace-pre-wrap break-words'>
            <Show
              when={!props.message.isTyping}
              fallback={
                <div class='flex items-center gap-2'>
                  <span>AI is typing</span>
                  <div class='flex gap-1'>
                    <div
                      class='w-1.5 h-1.5 bg-current rounded-full animate-bounce'
                      style='animation-delay: 0ms'
                    />
                    <div
                      class='w-1.5 h-1.5 bg-current rounded-full animate-bounce'
                      style='animation-delay: 150ms'
                    />
                    <div
                      class='w-1.5 h-1.5 bg-current rounded-full animate-bounce'
                      style='animation-delay: 300ms'
                    />
                  </div>
                </div>
              }
            >
              {props.message.content}
            </Show>
          </div>
        </Card>
        <div
          class={cn(
            'text-xs mt-1 px-1',
            isUser() ? 'text-right text-muted-foreground' : 'text-left text-muted-foreground',
          )}
        >
          {props.message.timestamp.toLocaleTimeString()}
        </div>
      </div>

      <Show when={isUser()}>
        <div class='w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1'>
          <span class='text-primary-foreground text-sm font-medium'>U</span>
        </div>
      </Show>
    </div>
  )
}
