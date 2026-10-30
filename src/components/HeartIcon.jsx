export default function HeartIcon({ filled, className = 'h-5 w-5' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <path
        d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z"
        className={filled ? 'fill-current stroke-none' : 'fill-none stroke-current stroke-[1.5]'}
      />
    </svg>
  )
}
