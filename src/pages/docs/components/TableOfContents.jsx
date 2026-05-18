import { ChevronRight } from 'lucide-react'

export default function TableOfContents({ sections, activeSection, onSelect }) {
  return (
    <nav className="py-6">
      <h3 className="px-4 text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 border-b-2 border-slate-200 pb-2">
        Contents
      </h3>
      
      <ul className="space-y-1">
        {sections.map((section) => {
          const Icon = section.icon
          const isActive = activeSection === section.id
          
          return (
            <li key={section.id}>
              <button
                onClick={() => onSelect(section.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 text-base font-medium transition-all
                  ${isActive 
                    ? 'bg-emerald-50 text-emerald-800 border-r-4 border-emerald-600 shadow-sm' 
                    : 'text-slate-800 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-700' : 'text-slate-600'}`} />
                <span className="flex-1 text-left">{section.title}</span>
                {isActive && <ChevronRight className="w-5 h-5 text-emerald-600" />}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}