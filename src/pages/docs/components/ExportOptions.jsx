import { FileText, Download } from 'lucide-react'

export default function ExportOptions({ onClose }) {
  const handleExportPDF = () => {
    window.print()
    onClose()
  }

  const handleExportMarkdown = () => {
    // Create markdown content from sections
    const markdown = `# Rice AI Doctor - Documentation

## Pitch Deck
[Content from pitch deck sections...]

## Technical Documentation
[Content from technical sections...]

---
Generated on ${new Date().toLocaleDateString()}
`
    
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'rice-ai-doctor-docs.md'
    a.click()
    URL.revokeObjectURL(url)
    onClose()
  }

  return (
    <div className="py-2">
      <button
        onClick={handleExportPDF}
        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Export as PDF
      </button>
      <button
        onClick={handleExportMarkdown}
        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
      >
        <FileText className="w-4 h-4" />
        Export as Markdown
      </button>
    </div>
  )
}
