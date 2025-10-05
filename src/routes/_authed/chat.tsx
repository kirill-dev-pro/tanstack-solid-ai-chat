import { createFileRoute } from '@tanstack/solid-router'
import { createSignal, createEffect, For, Show, Switch, Match } from 'solid-js'
import { Button } from '~/components/ui/button'
import { TextArea } from '~/components/ui/textarea'
import { TextFieldRoot } from '~/components/ui/textfield'
import { RIVER_CLIENT } from '~/lib/river'
import { RiverRouter } from '../api/chat'
import { MessageBubble } from '~/components/MessageBubble'

const riverClient = RIVER_CLIENT.createClientCaller<RiverRouter>('/api/chat/')

export const Route = createFileRoute('/_authed/chat')({
  component: ChatComponent,
})

export interface DbMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  isTyping?: boolean
}

export interface ModelMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

function dbMessageToModelMessage(dbMessage: DbMessage): ModelMessage {
  return {
    role: dbMessage.role,
    content: dbMessage.content,
  }
}

function ChatComponent() {
  const [messages, setMessages] = createSignal<DbMessage[]>([])
  const [inputValue, setInputValue] = createSignal('')
  const [isLoading, setIsLoading] = createSignal(false)
  const [messagesEndRef, setMessagesEndRef] = createSignal<HTMLDivElement>()

  // Auto-scroll to bottom when new messages arrive
  createEffect(() => {
    if (messages().length > 0) {
      messagesEndRef()?.scrollIntoView({ behavior: 'smooth' })
    }
  })

  const chatCaller = riverClient.chat({
    onStart: () => {
      setIsLoading(true)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '',
          id: crypto.randomUUID(),
          timestamp: new Date(),
        },
      ])
    },
    onChunk: (chunk) => {
      if (chunk.type === 'text-delta') {
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1]
          return [
            ...prev.slice(0, -1),
            { ...lastMessage, content: lastMessage.content + chunk.text },
          ]
        })
      }
    },
    onCancel: () => {
      console.warn('cancelled')
    },
    onError: (error) => {
      console.error(error)
    },
    onComplete: ({ duration, totalChunks }) => {
      setIsLoading(false)
      setInputValue('')
      console.log('complete', { duration, totalChunks })
      const lastMessage = messages()[messages().length - 1]
      if (lastMessage.content.trim() === '') {
        if (lastMessage.role === 'user') {
          setMessages((prev) => [...prev.slice(0, -1)])
        }
        if (lastMessage.role === 'assistant') {
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { ...lastMessage, content: 'AI failed to respond' },
          ])
        }
      }
    },
  })

  const sendMessage = () => {
    const newDbMessage: DbMessage = {
      content: inputValue(),
      role: 'user',
      id: crypto.randomUUID(),
      timestamp: new Date(),
    }
    const newMessages: ModelMessage[] = [
      ...messages().map(dbMessageToModelMessage),
      dbMessageToModelMessage(newDbMessage),
    ]
    setMessages((prev) => [...prev, newDbMessage])
    chatCaller.start(newMessages)
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div class='flex flex-1 flex-col mx-auto w-full overflow-hidden'>
      {/* Header */}
      <div class='flex items-center justify-between p-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div class='flex items-center gap-3'>
          <div class='w-8 h-8 rounded-full bg-primary flex items-center justify-center'>
            <span class='text-primary-foreground text-sm font-medium'>AI</span>
          </div>
          <div>
            <h1 class='text-xl font-semibold'>Chat Assistant</h1>
            <div class='flex items-center gap-2'>
              <p class='text-sm text-muted-foreground'>Powered by openrouter and river lib</p>
            </div>
          </div>
        </div>
        <Button variant='outline' size='sm' onClick={() => setMessages([])}>
          <svg class='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='2'
              d='M12 4v16m8-8H4'
            />
          </svg>
          New Chat
        </Button>
      </div>

      {/* Messages Area */}
      <div class='flex-1 overflow-y-auto p-4 space-y-4'>
        <Show when={messages().length > 0} fallback={<EmptyChat />}>
          <For each={messages()}>{(message) => <MessageBubble message={message} />}</For>
        </Show>
        <div ref={setMessagesEndRef} />
      </div>

      {/* Input Area */}
      <div class='p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div class='flex gap-2 items-end'>
          <TextFieldRoot class='flex-1 relative'>
            <TextArea
              value={inputValue()}
              onInput={(e) => setInputValue(e.currentTarget.value)}
              onKeyDown={handleKeyPress}
              placeholder='Type your message here... (Press Enter to send, Shift+Enter for new line)'
              class='max-h-[120px] resize-none pr-12'
              disabled={isLoading()}
            />
            <div class='absolute bottom-2 right-2 text-xs text-muted-foreground'>
              {inputValue().length > 0 && `${inputValue().length} chars`}
            </div>
          </TextFieldRoot>
          <Switch>
            <Match when={isLoading()}>
              <Button onClick={() => chatCaller.stop()} class='self-end min-w-[80px]' size='lg'>
                Stop
              </Button>
            </Match>
            <Match when={!isLoading()}>
              <Button
                onClick={sendMessage}
                disabled={!inputValue().trim()}
                class='self-end min-w-[80px]'
                size='lg'
              >
                <Show
                  when={isLoading()}
                  fallback={
                    <>
                      Send
                      <svg
                        class='w-4 h-4 ml-2 rotate-90'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          stroke-linecap='round'
                          stroke-linejoin='round'
                          stroke-width='2'
                          d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
                        />
                      </svg>
                    </>
                  }
                >
                  <div class='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
                </Show>
              </Button>
            </Match>
          </Switch>
        </div>
        <div class='flex items-center justify-between mt-2 text-xs text-muted-foreground'>
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>{messages().length} messages</span>
        </div>
      </div>
    </div>
  )
}

function EmptyChat() {
  return (
    <div class='flex items-center justify-center h-full'>
      <div class='text-center text-muted-foreground max-w-md'>
        <div class='w-16 h-16 mx-auto mb-6 rounded-full bg-primary flex items-center justify-center'>
          <svg
            class='w-8 h-8 text-primary-foreground'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='2'
              d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
            />
          </svg>
        </div>
        <h3 class='text-lg font-medium mb-2'>Start a river chat</h3>
        <p class='text-sm mb-6'>Ask me anything and I'll help you out!</p>
      </div>
    </div>
  )
}
