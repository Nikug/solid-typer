import { Component, createEffect, createSignal, onCleanup, onMount, Show } from 'solid-js'
import { createStore } from 'solid-js/store'
import quotesJson from './assets/quotes.json'
import { Dropdown } from './components/Dropdown'
import { ProgressBar } from './components/ProgressBar'
import { QuoteInformation } from './components/QuoteInformation'
import { StatisticsContainer } from './components/StatisticsContainer'
import { TextContainer } from './components/TextContainer'
import { CleanupKeyboard, SetupKeyboard } from './KeyboardHandler'
import {
  Attempt,
  AttemptStates,
  CatppuccinFlavour,
  CatppuccinFlavourClass,
  catppuccinFlavours,
  QuotesJson,
  QuoteWithWords,
  Theme,
  Word,
} from './types'
import { capitalize, getRandomFromArray } from './util'

const quotes = quotesJson as QuotesJson
export const getRandomQuote = () => getRandomFromArray(quotes.quotes)

const splitParagraph = (text: string): Word[] => {
  const words: Word[] = []
  let word: Word = new Map()
  for (let i = 0, limit = text.length; i < limit; i++) {
    if (text[i] !== ' ') {
      word.set(i, text[i])
    } else {
      words.push(word)
      words.push(new Map().set(i, ' '))
      word = new Map()
    }
  }

  words.push(word)
  return words
}

export const initQuote = () => {
  const randomQuote = getRandomQuote()
  return { ...randomQuote, words: splitParagraph(randomQuote.text) }
}
export const newAttempt = (): Attempt => ({
  state: AttemptStates.notStarted,
  allText: '',
  finalText: '',
  measurements: {
    startTime: null,
    endTime: null,
    words: [],
    timestamps: new Map(),
  },
})

export const resetAttempt = () => {
  setAttempt(newAttempt())
  setQuote(initQuote())
}

export const [quote, setQuote] = createSignal<QuoteWithWords>(initQuote())
export const [attempt, setAttempt] = createStore<Attempt>(newAttempt())

export const [catppuccinFlavour, setCatppuccinFlavour] = createSignal<Theme>({
  flavour: 'mocha',
  class: 'ctp-mocha',
})
export const setTheme = (flavour: CatppuccinFlavour): Theme =>
  setCatppuccinFlavour({ flavour, class: `ctp-${flavour}` })

const App: Component = () => {
  onMount(() => SetupKeyboard())
  onCleanup(() => CleanupKeyboard())

  createEffect(() => {
    document.body.className = catppuccinFlavour().class
  })

  return (
    <div class="w-screen min-h-screen bg-ctp-base text-ctp-text">
      <div class="grid grid-rows-5 h-screen justify-center">
        <div class="row-span-1 flex flex-col items-center">
          <h1 class="text-5xl font-bold mt-4 mb-4">Solid typer</h1>
          <Dropdown
            value={capitalize(catppuccinFlavour().flavour)}
            options={Object.entries(catppuccinFlavours).map(([key]) => ({
              key: key as CatppuccinFlavour,
              value: capitalize(key),
            }))}
            onSelect={(option) => setTheme(option.key)}
          />
          <Show when={attempt.state === AttemptStates.completed}>
            <h2 class="text-4xl font-bold mt-auto mb-4">Your score</h2>
          </Show>
        </div>
        <Show when={attempt.state !== AttemptStates.completed}>
          <div class="row-span-3 overflow-scroll max-w-5xl px-16 h-48 my-auto">
            <div class="h-8">
              <QuoteInformation />
            </div>
            <div class="h-32 overflow-hidden">
              <TextContainer attempt={attempt} quote={quote()} />
            </div>
            <div class="h-8">
              <Show when={attempt.state !== AttemptStates.completed}>
                <ProgressBar />
              </Show>
            </div>
          </div>
        </Show>
        <Show when={attempt.state === AttemptStates.completed}>
          <div class="row-span-4 flex justify-center">
            <div class="max-w-5xl px-16">
              <StatisticsContainer attempt={attempt} quote={quote()} />
            </div>
          </div>
        </Show>
      </div>
    </div>
  )
}

export default App
