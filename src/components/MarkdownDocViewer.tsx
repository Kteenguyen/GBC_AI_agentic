"use client";

import React, { useState } from "react";
import { 
  Copy, 
  Check, 
  Terminal, 
  FileCode, 
  Layers, 
  ExternalLink, 
  Bookmark, 
  Info,
  AlertTriangle,
  CheckCircle2,
  ChevronRight
} from "lucide-react";

interface MarkdownDocViewerProps {
  content: string;
  isLight: boolean;
}

export function MarkdownDocViewer({ content, isLight }: MarkdownDocViewerProps) {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  const handleCopyCode = (codeText: string, index: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  // Parse markdown lines into structured blocks
  const parseMarkdown = (raw: string) => {
    const lines = raw.split("\n");
    const blocks: Array<{
      type: "h1" | "h2" | "h3" | "h4" | "p" | "code" | "table" | "quote" | "list" | "hr";
      content: string;
      language?: string;
      items?: string[];
      rows?: string[][];
      id?: string;
    }> = [];

    let inCodeBlock = false;
    let codeBuffer: string[] = [];
    let codeLang = "";

    let inTable = false;
    let tableRows: string[][] = [];

    let inList = false;
    let listItems: string[] = [];

    const flushList = () => {
      if (inList && listItems.length > 0) {
        blocks.push({ type: "list", content: "", items: [...listItems] });
        listItems = [];
        inList = false;
      }
    };

    const flushTable = () => {
      if (inTable && tableRows.length > 0) {
        blocks.push({ type: "table", content: "", rows: [...tableRows] });
        tableRows = [];
        inTable = false;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code block start/end
      if (line.trim().startsWith("```")) {
        if (!inCodeBlock) {
          flushList();
          flushTable();
          inCodeBlock = true;
          codeLang = line.trim().replace(/^```/, "").trim() || "bash";
          codeBuffer = [];
        } else {
          inCodeBlock = false;
          blocks.push({
            type: "code",
            content: codeBuffer.join("\n"),
            language: codeLang
          });
          codeBuffer = [];
          codeLang = "";
        }
        continue;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        continue;
      }

      // Horizontal Rule
      if (line.trim() === "---" || line.trim() === "***" || line.trim() === "___") {
        flushList();
        flushTable();
        blocks.push({ type: "hr", content: "" });
        continue;
      }

      // Table line
      if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
        flushList();
        inTable = true;
        // Ignore table separator line e.g. |---|---|
        if (!line.includes("---")) {
          const cells = line
            .split("|")
            .slice(1, -1)
            .map(c => c.trim());
          tableRows.push(cells);
        }
        continue;
      } else if (inTable) {
        flushTable();
      }

      // List line
      if (/^[-*+]\s+/.test(line.trim()) || /^\d+\.\s+/.test(line.trim())) {
        inList = true;
        listItems.push(line.trim().replace(/^[-*+]\s+/, "").replace(/^\d+\.\s+/, ""));
        continue;
      } else if (inList) {
        flushList();
      }

      // Headings
      if (line.startsWith("# ")) {
        blocks.push({ 
          type: "h1", 
          content: line.replace(/^# /, "").trim(),
          id: generateId(line.replace(/^# /, "").trim())
        });
        continue;
      }
      if (line.startsWith("## ")) {
        blocks.push({ 
          type: "h2", 
          content: line.replace(/^## /, "").trim(),
          id: generateId(line.replace(/^## /, "").trim())
        });
        continue;
      }
      if (line.startsWith("### ")) {
        blocks.push({ 
          type: "h3", 
          content: line.replace(/^### /, "").trim(),
          id: generateId(line.replace(/^### /, "").trim())
        });
        continue;
      }
      if (line.startsWith("#### ")) {
        blocks.push({ 
          type: "h4", 
          content: line.replace(/^#### /, "").trim(),
          id: generateId(line.replace(/^#### /, "").trim())
        });
        continue;
      }

      // Blockquotes
      if (line.startsWith("> ")) {
        blocks.push({ type: "quote", content: line.replace(/^> /, "").trim() });
        continue;
      }

      // Regular Paragraph
      if (line.trim().length > 0) {
        blocks.push({ type: "p", content: line.trim() });
      }
    }

    flushList();
    flushTable();
    return blocks;
  };

  const generateId = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 50);
  };

  // Helper to format inline bold, inline code tags, links
  const renderInlineFormatted = (text: string) => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyIdx = 0;

    // Regex to match inline `code`, **bold**, *italic*, [link](url)
    const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
    let match: RegExpExecArray | null;
    let lastIndex = 0;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const token = match[0];
      if (token.startsWith("`") && token.endsWith("`")) {
        const code = token.slice(1, -1);
        parts.push(
          <code 
            key={keyIdx++} 
            className={`px-1.5 py-0.5 rounded-md font-mono text-[11px] font-semibold border ${
              isLight 
                ? 'bg-[#EFECE6] text-blue-800 border-[#E2DDD5]' 
                : 'bg-slate-800/90 text-cyan-300 border-slate-700/80'
            }`}
          >
            {code}
          </code>
        );
      } else if (token.startsWith("**") && token.endsWith("**")) {
        parts.push(
          <strong key={keyIdx++} className={`font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith("*") && token.endsWith("*")) {
        parts.push(
          <em key={keyIdx++} className="italic">
            {token.slice(1, -1)}
          </em>
        );
      } else if (token.startsWith("[") && token.includes("](")) {
        const titleMatch = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (titleMatch) {
          parts.push(
            <a 
              key={keyIdx++} 
              href={titleMatch[2]} 
              target="_blank" 
              rel="noreferrer" 
              className={`underline underline-offset-2 font-bold ${
                isLight ? 'text-blue-600 hover:text-blue-800' : 'text-cyan-400 hover:text-cyan-300'
              }`}
            >
              {titleMatch[1]}
            </a>
          );
        }
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const blocks = parseMarkdown(content);

  return (
    <div className="space-y-5 text-xs sm:text-[13px] leading-relaxed">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "h1":
            return (
              <div key={idx} id={block.id} className="pt-2 pb-1 border-b border-dashed border-slate-300 dark:border-slate-800 scroll-mt-20">
                <h1 className={`text-lg sm:text-xl font-black tracking-tight flex items-center gap-2 ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  <span className={`w-2 h-5 rounded-full ${isLight ? 'bg-blue-600' : 'bg-cyan-500'}`} />
                  <span>{block.content}</span>
                </h1>
              </div>
            );

          case "h2":
            return (
              <div key={idx} id={block.id} className="pt-4 pb-1 border-b border-slate-200/80 dark:border-slate-800/80 scroll-mt-20">
                <h2 className={`text-sm sm:text-base font-extrabold tracking-tight flex items-center gap-2 ${
                  isLight ? 'text-slate-900' : 'text-cyan-300'
                }`}>
                  <ChevronRight className={`w-4 h-4 shrink-0 ${isLight ? 'text-blue-600' : 'text-cyan-400'}`} />
                  <span>{block.content}</span>
                </h2>
              </div>
            );

          case "h3":
            return (
              <div key={idx} id={block.id} className="pt-3 scroll-mt-20">
                <h3 className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 ${
                  isLight ? 'text-blue-900' : 'text-slate-200'
                }`}>
                  <span className="text-slate-400">#</span>
                  <span>{block.content}</span>
                </h3>
              </div>
            );

          case "h4":
            return (
              <div key={idx} id={block.id} className="pt-2 scroll-mt-20">
                <h4 className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  {block.content}
                </h4>
              </div>
            );

          case "p":
            return (
              <p key={idx} className={`${isLight ? 'text-slate-700' : 'text-slate-300'} leading-relaxed`}>
                {renderInlineFormatted(block.content)}
              </p>
            );

          case "quote":
            return (
              <div 
                key={idx} 
                className={`p-3.5 rounded-xl border-l-4 border flex items-start gap-2.5 shadow-xs ${
                  isLight 
                    ? 'bg-blue-50/60 border-blue-200 border-l-blue-600 text-blue-950' 
                    : 'bg-cyan-950/30 border-cyan-800/50 border-l-cyan-400 text-cyan-200'
                }`}
              >
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-600 dark:text-cyan-400" />
                <div className="text-xs leading-relaxed">{renderInlineFormatted(block.content)}</div>
              </div>
            );

          case "list":
            return (
              <ul key={idx} className="space-y-1.5 pl-4 list-disc marker:text-blue-600 dark:marker:text-cyan-400">
                {block.items?.map((item, itemIdx) => (
                  <li key={itemIdx} className={`${isLight ? 'text-slate-700' : 'text-slate-300'} leading-relaxed`}>
                    {renderInlineFormatted(item)}
                  </li>
                ))}
              </ul>
            );

          case "table":
            if (!block.rows || block.rows.length === 0) return null;
            const headerRow = block.rows[0];
            const dataRows = block.rows.slice(1);
            return (
              <div key={idx} className={`overflow-x-auto rounded-xl border shadow-xs my-3 ${
                isLight ? 'border-[#E2DDD5] bg-white' : 'border-slate-800 bg-[#0B0F19]'
              }`}>
                <table className="w-full text-left border-collapse text-[11px] sm:text-xs">
                  <thead>
                    <tr className={`border-b ${isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-900 border-slate-800'}`}>
                      {headerRow.map((cell, cIdx) => (
                        <th key={cIdx} className={`p-2.5 font-bold uppercase tracking-wider ${
                          isLight ? 'text-slate-800' : 'text-slate-300'
                        }`}>
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.map((row, rIdx) => (
                      <tr 
                        key={rIdx} 
                        className={`border-b last:border-b-0 transition-colors ${
                          isLight 
                            ? (rIdx % 2 === 0 ? 'bg-white' : 'bg-[#FAF8F5]/50') + ' hover:bg-blue-50/40 border-[#E2DDD5]' 
                            : (rIdx % 2 === 0 ? 'bg-transparent' : 'bg-slate-900/30') + ' hover:bg-slate-800/40 border-slate-800/60'
                        }`}
                      >
                        {row.map((cell, cellIdx) => (
                          <td key={cellIdx} className={`p-2.5 leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                            {renderInlineFormatted(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "code":
            const codeIndex = idx;
            const isCopied = copiedCodeIndex === codeIndex;
            const isTerminalOrScript = ["bash", "sh", "shell", "powershell", "zsh", "cmd"].includes(block.language?.toLowerCase() || "");
            return (
              <div key={idx} className="my-3.5 rounded-2xl overflow-hidden border shadow-sm transition-all border-slate-700/60 bg-[#0D1117]">
                {/* Code Block Top Header Bar */}
                <div className="px-3.5 py-2 bg-[#161B22] border-b border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="h-3 w-px bg-slate-700" />
                    <div className="flex items-center gap-1 text-[10.5px] font-mono font-bold text-slate-400">
                      {isTerminalOrScript ? <Terminal className="w-3 h-3 text-cyan-400" /> : <FileCode className="w-3 h-3 text-blue-400" />}
                      <span className="uppercase">{block.language || "CODE"}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyCode(block.content, codeIndex)}
                    className="flex items-center gap-1 px-2 py-0.8 rounded-lg text-[10.5px] font-mono font-semibold transition cursor-pointer active:scale-95 bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Đã Chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-400" />
                        <span>Sao Chép</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Code Block Content */}
                <pre className="p-4 font-mono text-[11px] sm:text-xs overflow-x-auto leading-relaxed text-slate-200">
                  <code>{block.content}</code>
                </pre>
              </div>
            );

          case "hr":
            return (
              <hr key={idx} className={`my-4 border-t ${isLight ? 'border-[#E2DDD5]' : 'border-slate-800'}`} />
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
