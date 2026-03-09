import Link from "next/link";
import Logo from "@/components/ui/Logo";

interface NavbarProps {
  rightSlot?: React.ReactNode;
  transparent?: boolean;
}

export default function Navbar({ rightSlot, transparent }: NavbarProps) {
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-3.5 border-b border-border-light ${
        transparent
          ? "bg-transparent border-transparent"
          : "bg-surface/90 backdrop-blur-md"
      }`}
    >
      <Link href="/" className="no-underline">
        <Logo variant="light" size="md" />
      </Link>
      {rightSlot && <div className="flex items-center gap-3">{rightSlot}</div>}
    </nav>
  );
}
