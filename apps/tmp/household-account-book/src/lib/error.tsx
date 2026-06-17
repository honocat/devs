interface Props {
  error: string
}

export function ErrorMessage(props: Props) {
  const { error } = props
  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
      {error}
    </div>
  )
}
