export function QuestionIcon({ active }: { active?: boolean }) {
  const color = active ? "var(--c-brand)" : "var(--c-text-3)";

  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="9" stroke={color} strokeWidth="1" />
      <path
        d="M8.5 9C8.5 7.61929 9.61929 6.5 11 6.5C12.3807 6.5 13.5 7.61929 13.5 9C13.5 10.3807 11 10.7 11 13"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="11" cy="15.5" r="1" fill={color} />
    </svg>
  );
}
