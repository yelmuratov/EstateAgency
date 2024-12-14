"use client"

import Link from 'next/link'

export default function Navbar() {

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center justify-between px-4 py-4 sm:px-6 sm:py-4">
        <Link href="/" className="font-bold text-2xl mr-6">
          Emplyees Dashboard
        </Link>
      </div>
    </nav>
  )
}

