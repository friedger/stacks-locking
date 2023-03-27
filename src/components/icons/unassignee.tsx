export function Unassignee(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 5c0 .675-.223 1.299-.6 1.8C7.372 7.53 8 8.69 8 10v4H0v-4c0-1.309.628-2.47 1.6-3.2A3 3 0 1 1 7 5ZM4 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm-2 4a2 2 0 1 1 4 0v2H2v-2Z"
        fill="#000"
      />
      <path d="M16 5a1 1 0 0 0-1-1h-4a1 1 0 1 0 0 2h4a1 1 0 0 0 1-1Z" fill="#000" />
    </svg>
  );
}
