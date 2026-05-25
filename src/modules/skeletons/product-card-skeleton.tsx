export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square rounded-xl bg-muted mb-3" />
      <div className="space-y-2">
        <div className="h-3 w-1/3 bg-muted rounded" />
        <div className="h-4 w-4/5 bg-muted rounded" />
        <div className="h-4 w-1/4 bg-muted rounded" />
      </div>
    </div>
  )
}
