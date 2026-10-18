export default function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <rect width="40" height="40" rx="10" fill="#1E40AF" />
      <path d="M17 9h6v8h8v6h-8v8h-6v-8H9v-6h8z" fill="#fff" />
      <rect x="27" y="6" width="7" height="7" rx="1.5" fill="#06B6D4" />
    </svg>
  );
}
