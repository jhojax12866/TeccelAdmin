import Link from "next/link"

interface NavigationItem {
  title: string
  href: string
}

export default function Navigation() {
  const items: NavigationItem[] = [
    { title: "INICIO", href: "/" },
    { title: "PRODUCTOS", href: "/productos" },
    { title: "NOSOTROS", href: "/nosotros" },
    { title: "CONTACTO", href: "/contacto" },
  ]

  return (
    <nav className="hidden md:flex items-center space-x-8">
      {items.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}

