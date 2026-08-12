// SPDX-License-Identifier: Apache-2.0
// Data Room Browser — admin-only view of the FreeLeased data room.
//
// Loads `data-room/_index/manifest.json` (a static mirror of the real
// Data Room at G:\My Drive\Development\Future Caribbean\Data Room\) and
// lets the admin browse the 22 folders / 45 files. Click a folder → see
// files. Click a file → preview.
//
// RBAC: this component is only mounted when the current user has ADMIN
// role. The server-side endpoint enforces the same gate.

import React, { useEffect, useMemo, useState } from "react"
import { Folder, FileText, ChevronRight, Search, Image as ImageIcon, FileCode, FileArchive, ShieldCheck, ExternalLink, Filter } from "lucide-react"

interface DataRoomFile {
  id: string
  name: string
  description: string
  sizeBytes: number
  kind: "markdown" | "text" | "csv" | "image" | "code" | "zip" | "pdf"
  trlLevel: string
  verified: boolean
}

interface DataRoomFolder {
  id: string
  label: string
  category: string
  trlLevel: string
  files: DataRoomFile[]
}

interface DataRoomCategory {
  id: string
  label: string
  folders: string[]
}

interface DataRoomManifest {
  version: string
  generatedAt: string
  rootNote: string
  summary: string
  categories: DataRoomCategory[]
  folders: DataRoomFolder[]
}

const KIND_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  markdown: FileText,
  text: FileText,
  csv: FileText,
  image: ImageIcon,
  code: FileCode,
  zip: FileArchive,
  pdf: FileText,
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function DataRoomBrowser() {
  const [manifest, setManifest] = useState<DataRoomManifest | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<DataRoomFile | null>(null)
  const [query, setQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  useEffect(() => {
    let alive = true
    fetch("/data-room/_index/manifest.json")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status} loading manifest`)
        return r.json()
      })
      .then((m: DataRoomManifest) => {
        if (!alive) return
        setManifest(m)
      })
      .catch((e) => {
        if (!alive) return
        setError(String(e instanceof Error ? e.message : e))
      })
    return () => {
      alive = false
    }
  }, [])

  const filteredFolders = useMemo(() => {
    if (!manifest) return []
    return manifest.folders.filter((f) => categoryFilter === "all" || f.category === categoryFilter)
  }, [manifest, categoryFilter])

  const currentFolder = useMemo(
    () => manifest?.folders.find((f) => f.id === selectedFolder) ?? null,
    [manifest, selectedFolder],
  )

  const stats = useMemo(() => {
    if (!manifest) return { folders: 0, files: 0, bytes: 0 }
    const folders = manifest.folders.length
    const files = manifest.folders.reduce((a, f) => a + f.files.length, 0)
    const bytes = manifest.folders.reduce((a, f) => a + f.files.reduce((b, file) => b + file.sizeBytes, 0), 0)
    return { folders, files, bytes }
  }, [manifest])

  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md text-sm">
        <strong>Could not load the Data Room manifest.</strong>
        <p className="text-xs text-red-700 mt-1">{error}</p>
      </div>
    )
  }

  if (!manifest) {
    return <div className="p-4 text-sm text-slate-500">Loading data room manifest…</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">Admin · Data Room</p>
          <h2 className="text-2xl font-bold text-slate-900">Buildathon Data Room</h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Validation layer for every TRL claim. Mirror of the live Data Room at <code className="text-xs bg-slate-100 px-1 rounded">G:\My Drive\Development\Future Caribbean\Data Room\</code>.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
            {stats.folders} folders
          </span>
          <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
            {stats.files} files
          </span>
          <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 border border-slate-300">
            {formatSize(stats.bytes)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3">
        <label className="block">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 flex items-center gap-1">
            <Search className="w-3 h-3" /> search
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="file name, description, TRL…"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </label>
        <label className="block">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 flex items-center gap-1">
            <Filter className="w-3 h-3" /> category
          </span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
          >
            <option value="all">All categories</option>
            {manifest.categories.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[18rem_1fr_22rem] gap-4">
        {/* Folder list */}
        <aside className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="px-3 py-2 border-b border-slate-100 bg-slate-50">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Folders</p>
          </div>
          <ul className="p-1.5 space-y-0.5">
            {filteredFolders.map((f) => {
              const active = selectedFolder === f.id
              return (
                <li key={f.id}>
                  <button
                    onClick={() => { setSelectedFolder(f.id); setSelectedFile(null) }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-start gap-2.5 transition border ${
                      active
                        ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                        : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Folder className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
                    <span className="flex-1 min-w-0">
                      <span className="block text-[13px] font-semibold leading-tight">{f.label}</span>
                      <span className="block text-[10px] text-slate-500">{f.files.length} files · {f.trlLevel}</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </li>
              )
            })}
          </ul>
        </aside>

        {/* File list */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm min-h-[20rem]">
          <div className="px-3 py-2 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {currentFolder ? currentFolder.label : "Select a folder"}
            </p>
            {currentFolder && (
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">{currentFolder.trlLevel}</span>
            )}
          </div>
          {!currentFolder ? (
            <div className="p-4 text-sm text-slate-500">Pick a folder on the left to see its files.</div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {currentFolder.files
                .filter((file) => {
                  if (!query) return true
                  const q = query.toLowerCase()
                  return file.name.toLowerCase().includes(q) || file.description.toLowerCase().includes(q) || file.trlLevel.toLowerCase().includes(q)
                })
                .map((file) => {
                  const Icon = KIND_ICON[file.kind] ?? FileText
                  const active = selectedFile?.id === file.id
                  return (
                    <li key={file.id}>
                      <button
                        onClick={() => setSelectedFile(file)}
                        className={`w-full text-left px-4 py-3 flex items-start gap-3 transition ${
                          active ? "bg-emerald-50" : "hover:bg-slate-50"
                        }`}
                      >
                        <Icon className="w-4 h-4 mt-0.5 shrink-0 text-slate-500" />
                        <span className="flex-1 min-w-0">
                          <span className="block text-[13px] font-semibold text-slate-900">{file.name}</span>
                          <span className="block text-[11px] text-slate-600">{file.description}</span>
                          <span className="mt-1 inline-flex items-center gap-2 text-[10px] font-mono text-slate-500">
                            <span>{file.kind}</span>
                            <span>·</span>
                            <span>{formatSize(file.sizeBytes)}</span>
                            <span>·</span>
                            <span>{file.trlLevel}</span>
                            {file.verified && <span className="text-emerald-700">· verified</span>}
                          </span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </li>
                  )
                })}
            </ul>
          )}
        </section>

        {/* Preview */}
        <aside className="bg-white border border-slate-200 rounded-xl shadow-sm min-h-[20rem]">
          <div className="px-3 py-2 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Preview</p>
            {selectedFile?.verified && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700">
                <ShieldCheck className="w-3 h-3" /> verified
              </span>
            )}
          </div>
          {!selectedFile ? (
            <div className="p-4 text-sm text-slate-500">Pick a file to see its preview.</div>
          ) : (
            <div className="p-4 space-y-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedFile.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{selectedFile.description}</p>
              </div>
              <dl className="grid grid-cols-2 gap-2 text-[11px]">
                <dt className="text-slate-500 font-mono">kind</dt>
                <dd className="text-slate-700">{selectedFile.kind}</dd>
                <dt className="text-slate-500 font-mono">size</dt>
                <dd className="text-slate-700">{formatSize(selectedFile.sizeBytes)}</dd>
                <dt className="text-slate-500 font-mono">trl</dt>
                <dd className="text-slate-700">{selectedFile.trlLevel}</dd>
                <dt className="text-slate-500 font-mono">verified</dt>
                <dd className="text-slate-700">{selectedFile.verified ? "yes" : "no"}</dd>
              </dl>
              <div className="border-t border-slate-100 pt-3">
                <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">Preview</p>
                {selectedFile.kind === "image" && (
                  <div className="text-xs text-slate-500 italic">Image preview not embedded in the buildathon lite view. Click "open" to view full-binary.</div>
                )}
                {selectedFile.kind === "markdown" && (
                  <pre className="text-xs font-mono text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-3 whitespace-pre-wrap leading-relaxed max-h-72 overflow-auto">
{`# ${selectedFile.name}\n\n> ${selectedFile.description}\n\n[FILE BINARY — FULL CONTENT NOT INLINED]\n\nProvenance metadata:\n- trl: ${selectedFile.trlLevel}\n- verified: ${selectedFile.verified}\n- size: ${formatSize(selectedFile.sizeBytes)}\n`}
                  </pre>
                )}
                {selectedFile.kind === "csv" && (
                  <pre className="text-xs font-mono text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-3 whitespace-pre-wrap leading-relaxed max-h-72 overflow-auto">
{`# ${selectedFile.name}\n\n[CSV BINARY — FULL CONTENT NOT INLINED]\nProvenance: ${selectedFile.trlLevel}`}
                  </pre>
                )}
                {selectedFile.kind === "code" && (
                  <pre className="text-xs font-mono text-slate-700 bg-slate-900 text-emerald-200 border border-slate-700 rounded-lg p-3 whitespace-pre-wrap leading-relaxed max-h-72 overflow-auto">
{`// ${selectedFile.name}\n// ${selectedFile.description}\n// [CODE EXCERPT — full file in repo]\n\nexport const provenance = {\n  trl: "${selectedFile.trlLevel}",\n  verified: ${selectedFile.verified}\n};`}
                  </pre>
                )}
                {selectedFile.kind === "zip" && (
                  <p className="text-xs text-slate-500">Archive — full content available in the live workspace at <code className="text-xs bg-slate-100 px-1 rounded">data-room/</code>.</p>
                )}
              </div>
              <a
                href={`/data-room/${currentFolder?.id}/${selectedFile.name}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-900"
              >
                open in new tab <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

export default DataRoomBrowser
