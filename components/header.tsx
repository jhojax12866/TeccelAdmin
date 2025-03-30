import { Search, ShoppingCart } from "lucide-react"
import Link from "next/link"
import Logo from "./logo"
import Navigation from "./navigation"
import { Button } from "./ui/button"

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo />
        <Navigation />
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-5 w-5 text-[#e41e26]" />
          </Button>
          <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-[#e41e26] transition-colors">
            LOGIN.
          </Link>
          <Button variant="ghost" size="icon" aria-label="Cart" className="relative">
            <ShoppingCart className="h-5 w-5 text-[#e41e26]" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#e41e26] text-[10px] text-white">
              0
            </span>
          </Button>
        </div>
      </div>
    </header>
  )
}

