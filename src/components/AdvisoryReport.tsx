/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Copy, Check, Download, Sparkles, RefreshCw, FileText } from 'lucide-react';

interface AdvisoryReportProps {
  reportText: string;
  source: 'gemini-3.8-flash' | 'analytical-engine' | string;
  cityName: string;
  isGenerating: boolean;
  onRegenerate: () => void;
}

export const AdvisoryReport: React.FC<AdvisoryReportProps> = ({
  reportText,
  source,
  cityName,
  isGenerating,
  onRegenerate
}) => {
  const [copied, setCopied] = useState(false);

  // Helper to remove any LaTeX math formatting ($100\,\text{m}^2$, $52,000\,\text{L}$, etc.)
  const cleanLatex = (raw: string): string => {
    if (!raw) return '';
    let str = raw;

    // Convert $...$ blocks cleanly
    str = str.replace(/\$([^$]+)\$/g, (_, inner) => {
      return inner
        .replace(/\\text\{([^}]+)\}/g, '$1')
        .replace(/\\,/g, ' ')
        .replace(/\\ /g, ' ')
        .replace(/\\cdot/g, '·')
        .replace(/\\times/g, '×')
        .replace(/\^2/g, '²')
        .replace(/\^3/g, '³')
        .replace(/_2/g, '₂')
        .replace(/\\mu/g, 'µ')
        .replace(/\\Delta/g, 'Δ')
        .replace(/\\%/g, '%')
        .replace(/[{}]/g, '')
        .trim();
    });

    // Clean standalone LaTeX tokens
    str = str
      .replace(/\\text\{([^}]+)\}/g, '$1')
      .replace(/\\,/g, ' ')
      .replace(/\\ /g, ' ')
      .replace(/\^2/g, '²')
      .replace(/\^3/g, '³')
      .replace(/_2/g, '₂')
      .replace(/\\mu/g, 'µ')
      .replace(/\\Delta/g, 'Δ');

    return str;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanLatex(reportText));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const cleaned = cleanLatex(reportText);
    const blob = new Blob([cleaned], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EcoGPT_Advisory_${cityName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseInlineStyles = (text: string): string => {
    const cleaned = cleanLatex(text);
    // Bold: **text**
    let formatted = cleaned.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
    // Italics: *text*
    formatted = formatted.replace(/\*([^*]+)\*/g, '<em class="text-emerald-200/90">$1</em>');
    // Code: `code`
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>');
    return formatted;
  };

  const renderFormattedMarkdown = (markdown: string) => {
    if (!markdown) return null;

    const sanitized = cleanLatex(markdown);
    const lines = sanitized.split('\n');

    return lines.map((line, idx) => {
      const trimmed = line.trim();

      // Heading 3
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-base sm:text-lg font-bold text-emerald-300 mt-5 mb-2.5 flex items-center gap-2">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }

      // Heading 2
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-lg sm:text-xl font-extrabold text-white mt-6 mb-3 border-b border-slate-800 pb-1.5 flex items-center gap-2">
            {trimmed.replace('## ', '')}
          </h2>
        );
      }

      // Heading 1
      if (trimmed.startsWith('# ')) {
        return (
          <h1 key={idx} className="text-xl sm:text-2xl font-black text-white mt-6 mb-4">
            {trimmed.replace('# ', '')}
          </h1>
        );
      }

      // Horizontal rule
      if (trimmed === '---') {
        return <hr key={idx} className="my-4 border-slate-800" />;
      }

      // Bullet points
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const content = trimmed.substring(2);
        return (
          <li key={idx} className="ml-4 list-disc text-slate-300 text-sm leading-relaxed mb-1.5 marker:text-emerald-500">
            <span dangerouslySetInnerHTML={{ __html: parseInlineStyles(content) }} />
          </li>
        );
      }

      // Numbered lists
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        return (
          <div key={idx} className="flex gap-2 text-slate-300 text-sm leading-relaxed mb-2 ml-1">
            <span className="font-bold text-emerald-400 font-mono text-xs mt-0.5">{numMatch[1]}.</span>
            <span dangerouslySetInnerHTML={{ __html: parseInlineStyles(numMatch[2]) }} />
          </div>
        );
      }

      // Empty line
      if (!trimmed) {
        return <div key={idx} className="h-2" />;
      }

      // Standard paragraph
      return (
        <p key={idx} className="text-slate-300 text-sm leading-relaxed mb-2.5" dangerouslySetInnerHTML={{ __html: parseInlineStyles(line) }} />
      );
    });
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg relative flex flex-col h-full">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Synthesized Environmental Masterplan
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-slate-400">Target Area:</span>
              <span className="text-xs font-semibold text-emerald-300">{cityName}</span>
              <span className="text-slate-600">•</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60 flex items-center gap-1">
                {source.includes('3.1-flash-lite')
                  ? 'Gemini 3.1 Flash Lite'
                  : source.includes('3.8-flash')
                  ? 'Gemini 3.8 Flash'
                  : source.includes('gemini')
                  ? `Gemini AI (${source})`
                  : 'RAG Analytical Engine'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onRegenerate}
            disabled={isGenerating}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            title="Regenerate Report with Gemini"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isGenerating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Copy Report to Clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm shadow-emerald-600/30 cursor-pointer"
            title="Download as Markdown"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export .MD</span>
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="mt-4 overflow-y-auto max-h-[620px] pr-2 custom-scrollbar">
        {isGenerating ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Synthesizing Environmental Intelligence...</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Evaluating biophysical parameters, cross-referencing IPCC AR6 coefficients, and generating recommendations.
              </p>
            </div>
          </div>
        ) : (
          <div className="prose prose-invert max-w-none text-slate-300">
            {renderFormattedMarkdown(reportText)}
          </div>
        )}
      </div>
    </div>
  );
};
