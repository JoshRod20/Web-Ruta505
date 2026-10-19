const PinolitoAvatar = ({ size = 120, className = "" }) => (
  <svg
    viewBox="0 0 200 200"
    width={size}
    height={size}
    className={className}
    aria-hidden="true"
  >
    <ellipse cx="100" cy="120" rx="70" ry="65" fill="#8cc63f" />
    <ellipse cx="100" cy="130" rx="45" ry="40" fill="#eef7dc" />

    <ellipse cx="100" cy="55" rx="55" ry="12" fill="#d9a441" />
    <path d="M70 55 Q100 18 130 55 Q115 42 100 42 Q85 42 70 55Z" fill="#e7be6b" />

    <path d="M55 96 Q100 80 145 96 L145 106 Q100 92 55 106 Z" fill="#29abe2" />

    <circle cx="65" cy="122" r="8" fill="#f7941d" opacity="0.35" />
    <circle cx="135" cy="122" r="8" fill="#f7941d" opacity="0.35" />

    <circle cx="80" cy="107" r="10" fill="#123524" />
    <circle cx="120" cy="107" r="10" fill="#123524" />
    <circle cx="83" cy="103" r="3" fill="#fff" />
    <circle cx="123" cy="103" r="3" fill="#fff" />

    <path d="M92 120 L108 120 L100 132 Z" fill="#f7941d" />
  </svg>
);

export default PinolitoAvatar;