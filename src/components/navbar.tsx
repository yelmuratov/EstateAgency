"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ModeToggle } from '@/components/mode-toggle'

const navItems = [
  { href: '/users', label: 'Users' },
  { href: '/metros', label: 'Metros' },
  { href: '/districts', label: 'Districts' },
  { href: '/lands', label: 'Lands' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center justify-between px-4 py-4 sm:px-6 sm:py-4">
        <Link href="/" className="font-bold text-2xl mr-6">
          Emplyee's Dashboard
        </Link>
        <ModeToggle />
      </div>
    </nav>
  )
}

