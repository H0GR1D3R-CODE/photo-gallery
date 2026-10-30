import HeartIcon from './HeartIcon'

export default function Spinner() {
  return (
    <div role="status" className="flex flex-col items-center gap-5 py-28">
      <div className="relative grid h-16 w-16 place-items-center">
        <div className="absolute inset-0 animate-[spin_8s_linear_infinite] rounded-full border border-dashed border-foil" />
        <div className="absolute inset-1.5 animate-spin rounded-full border-2 border-transparent border-t-wax" />
        <HeartIcon filled className="h-5 w-5 animate-pulse text-wax" />
      </div>
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-mist">Loading photographs</p>
    </div>
  )
}
