"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
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
      <div className="flex h-16 items-center px-4">
        <Link href="/" className="font-bold text-2xl mr-6">
          Admin
        </Link>
        <div className="flex space-x-4 flex-1">
          {navItems.map((item) => (
            <Button
              key={item.href}
              asChild
              variant={pathname === item.href ? 'secondary' : 'ghost'}
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </div>
        <ModeToggle />
      </div>
    </nav>
  )
}

