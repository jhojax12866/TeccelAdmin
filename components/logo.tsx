import Image from "next/image"
import Link from "next/link"

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="relative h-12 w-12">
        <Image src="/logo.png" alt="TECCEL MOCOA Logo" fill className="object-contain" />
      </div>
      <span className="font-bold text-[#e41e26] text-xl">TECCEL MOCOA</span>
      <div className="relative">
        <span className="text-[#e41e26] text-xs absolute -bottom-3 right-0 whitespace-nowrap">
          Expertos en redes de acceso
        </span>
      </div>
    </Link>
  )
}

