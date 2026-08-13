type EmptyStateProps = { text: string; locale?: string }

export function EmptyState({ text }: EmptyStateProps) {
  return <div className="empty" role="status"><span aria-hidden="true">🍽</span><p>{text}</p></div>
}
