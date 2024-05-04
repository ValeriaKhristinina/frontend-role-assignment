import "./styles.css";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  color?: string;
}

export default function Button({ color = "blue", text, onClick }: ButtonProps) {
  return (
    // For real project we shouldn't pass color as inline-style for component.
    <button onClick={onClick} style={{ backgroundColor: color }}>
      {text}
    </button>
  );
}
