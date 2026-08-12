// Layout — FreeLeased reskin of the RHD extraction's responsive shell.
//
// Provides a responsive grid layout with sidebar + main content + right
// rail. Used by the new Charts / Housing Matrix / Rights Grid / Glossary
// tabs in the freeleased-app.

import React, { ReactNode, useState } from 'react'
import { Menu, X, Search } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
  activeTab: string
  setActiveTab: (tab: string) => void
  tabs: { id: string; label: string; section: string; blurb: string }[]
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, tabs }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const sections = Array.from(new Set(tabs.map((t) => t.section)))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            className="lg:hidden px-2 py-1 rounded border border-slate-300 text-slate-700"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-700">FreeLeased layout</p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <Search className="w-3.5 h-3.5" />
          <span>⌘K to search (buildathon demo)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[16rem_1fr] gap-4">
        <aside className={`bg-white border border-slate-200 rounded-xl shadow-sm ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="px-3 py-2 border-b border-slate-100 bg-slate-50">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Sections</p>
          </div>
          <ul className="p-1.5 space-y-1">
            {sections.map((section) => (
              <li key={section}>
                <p className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-slate-400">{section}</p>
                <ul className="space-y-0.5">
                  {tabs.filter((t) => t.section === section).map((t) => {
                    const active = activeTab === t.id
                    return (
                      <li key={t.id}>
                        <button
                          onClick={() => { setActiveTab(t.id); setIsMobileMenuOpen(false) }}
                          className={`w-full text-left px-3 py-2 rounded-lg flex items-start gap-2.5 transition border ${
                            active
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                          }`}
                        >
                          <span className="flex-1 min-w-0">
                            <span className="block text-[13px] font-semibold leading-tight">{t.label}</span>
                            <span className="block text-[10px] text-slate-500 leading-snug mt-0.5">{t.blurb}</span>
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  )
}

export default Layout
