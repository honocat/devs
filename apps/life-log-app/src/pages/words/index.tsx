import { useEffect, useMemo, useState } from "react"

import { Calendar, Check, Filter, Search } from "lucide-react"
import { format, isValid, parseISO } from "date-fns"

// import { Container } from "@/components/layouts/Container"
import { ErrorMessage } from "@/lib/error"
import { Spinner } from "@/lib/spinner"
import { cn } from "@/lib/utils"

type WordStatus = "done" | "todo"

type Word = {
  id: string
  title: string
  description: string
  remarks: string
  genres: string[]
  date: string | null
  status: WordStatus
  done: boolean
}

type ViewKey = "all" | "undone" | string

const wordCache = new Map<string, Promise<Word[]> | Word[]>()

function normalizeText(value: string) {
  return value.trim().toLowerCase()
}

function formatDate(value: string | null) {
  if (!value) return "-"
  const parsed = parseISO(value)
  if (!isValid(parsed)) return value
  return format(parsed, "yyyy/MM/dd")
}

function getSortedWords(words: Word[]) {
  return [...words].sort((a, b) => {
    const dateDiff =
      (b.date ? Date.parse(b.date) : 0) - (a.date ? Date.parse(a.date) : 0)
    if (dateDiff !== 0) return dateDiff
    return a.title.localeCompare(b.title, "ja")
  })
}

async function fetchWords() {
  const res = await fetch("/api/words")
  if (!res.ok) throw new Error(`Failed to load words: ${res.status}`)
  return (await res.json()) as Word[]
}

async function fetchWordsWithCache() {
  const cached = wordCache.get("words")
  if (cached) {
    if (Array.isArray(cached)) return cached
    return cached
  }

  const pending = fetchWords()
    .then((result) => {
      wordCache.set("words", result)
      return result
    })
    .catch((error) => {
      wordCache.delete("words")
      throw error
    })

  wordCache.set("words", pending)
  return pending
}

function WordBadge({ done }: { done: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex size-6 items-center justify-center rounded-full border text-xs font-medium",
        done
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
          : "border-border bg-muted text-muted-foreground"
      )}
      aria-label={done ? "完了" : "未完了"}
      title={done ? "完了" : "未完了"}
    >
      <Check className={cn("size-3.5", done ? "opacity-100" : "opacity-40")} />
    </span>
  )
}

function WordTable({ words }: { words: Word[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <div className="min-w-275">
          <div className="grid grid-cols-[44px_120px_1.15fr_1.15fr_160px_120px_120px] border-b border-border bg-muted/40 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <div className="px-3 py-3" />
            <div className="px-3 py-3">語句</div>
            <div className="px-3 py-3">説明</div>
            <div className="px-3 py-3">備考</div>
            <div className="px-3 py-3">ジャンル</div>
            <div className="px-3 py-3">作成日</div>
            <div className="px-3 py-3">ステータス</div>
          </div>

          <div className="divide-y divide-border">
            {words.map((word) => (
              <div
                key={word.id}
                className="grid grid-cols-[44px_120px_1.15fr_1.15fr_160px_120px_120px] items-start text-sm transition-colors hover:bg-muted/30"
              >
                <div className="px-3 py-4">
                  <WordBadge done={word.done} />
                </div>
                <div className="px-3 py-4">
                  <div className="font-medium text-foreground">{word.title}</div>
                </div>
                <div className="px-3 py-4 text-sm leading-6 text-foreground/90">
                  {word.description || "-"}
                </div>
                <div className="px-3 py-4 text-sm leading-6 text-foreground/90">
                  {word.remarks || "-"}
                </div>
                <div className="px-3 py-4">
                  <div className="flex flex-wrap gap-2">
                    {word.genres.length > 0 ? (
                      word.genres.map((genre) => (
                        <span
                          key={`${word.id}-${genre}`}
                          className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                        >
                          {genre}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </div>
                </div>
                <div className="px-3 py-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    {formatDate(word.date)}
                  </span>
                </div>
                <div className="px-3 py-4">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                      word.done
                        ? "bg-emerald-500/10 text-emerald-700"
                        : "bg-amber-500/10 text-amber-700"
                    )}
                  >
                    {word.status === "done" ? "done" : "todo"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card/60 p-8 text-center text-sm text-muted-foreground">
      {message}
    </div>
  )
}

export default function WordsPage() {
  const [words, setWords] = useState<Word[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedView, setSelectedView] = useState<ViewKey>("all")
  const [query, setQuery] = useState("")

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      setError(null)

      const cached = wordCache.get("words")
      if (cached && Array.isArray(cached)) {
        if (cancelled) return
        setWords(cached)
        setLoading(false)
        return
      }

      setLoading(true)

      try {
        const data = await fetchWordsWithCache()
        if (cancelled) return
        setWords(data)
      } catch (e) {
        if (cancelled) return
        const message = e instanceof Error ? e.message : String(e)
        setError(`Error occured: ${message}`)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [])

  const genreViews = useMemo(() => {
    const genres = new Map<string, number>()
    words.forEach((word) => {
      word.genres.forEach((genre) => {
        genres.set(genre, (genres.get(genre) ?? 0) + 1)
      })
    })
    return [...genres.entries()]
      .map(([name, count]) => ({ key: name, label: name, count }))
      .sort((a, b) => a.label.localeCompare(b.label, "ja"))
  }, [words])

  const filteredWords = useMemo(() => {
    const search = normalizeText(query)

    const base = words.filter((word) => {
      if (selectedView === "all") return true
      if (selectedView === "undone") return !word.done
      return word.genres.includes(selectedView)
    })

    const searched = search
      ? base.filter((word) => {
          const haystacks = [word.title, word.description, word.remarks]
            .filter(Boolean)
            .map(normalizeText)
          return haystacks.some((text) => text.includes(search))
        })
      : base

    return getSortedWords(searched)
  }, [query, selectedView, words])

  const selectedLabel =
    selectedView === "all"
      ? "すべての語句"
      : selectedView === "undone"
        ? "未完了の語句"
        : selectedView

  const views = [
    { key: "all", label: "すべて", count: words.length },
    ...genreViews,
    { key: "undone", label: "未完了", count: words.filter((word) => !word.done).length },
  ]

  return (
    <div className="p-8">
      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Filter className="size-4" />
                語句一覧
              </div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight">
                {selectedLabel}
              </h1>
              <p className="text-sm leading-6 text-muted-foreground">
                Notion のビューのように、全件・ジャンル別・未完了を切り替えて一覧化します。
              </p>
            </div>

            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="語句、説明、備考を検索"
                className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/20"
              />
            </label>

            <div className="flex flex-wrap gap-2">
              {views.map((view) => {
                const active = selectedView === view.key
                return (
                  <button
                    key={view.key}
                    type="button"
                    onClick={() => setSelectedView(view.key)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground hover:bg-muted"
                    )}
                  >
                    <span>{view.label}</span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs",
                        active ? "bg-primary-foreground/15" : "bg-muted text-muted-foreground"
                      )}
                    >
                      {view.count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {loading ? (
          <Spinner />
        ) : error ? (
          <ErrorMessage error={error} />
        ) : filteredWords.length > 0 ? (
          <WordTable words={filteredWords} />
        ) : query ? (
          <EmptyState message="検索条件に一致する語句がありません。" />
        ) : (
          <EmptyState message="表示できる語句がありません。" />
        )}
      </div>
    </div>
  )
}
