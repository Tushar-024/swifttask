import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Header() {
  return (
    <header className="py-4 px-6 bg-white shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          TaskMaster
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Button variant="ghost" asChild>
                <Link href="/">Home</Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" asChild>
                <Link href="#features">Features</Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" asChild>
                <Link href="#about">About</Link>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
