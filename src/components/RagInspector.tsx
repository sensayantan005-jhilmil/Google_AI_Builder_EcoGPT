/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Database, Search, Award, BookOpen, Sparkles, ExternalLink } from 'lucide-react';
import { KnowledgeDoc, KNOWLEDGE_DOCS, defaultRetriever } from '../lib/environmentalEngine';

interface RagInspectorProps {
  currentEvidence: { doc: KnowledgeDoc; score: number }[];
}

export const RagInspector: React.FC<RagInspectorProps> = ({ currentEvidence }) => {
  const [testQuery, setTestQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ doc: KnowledgeDoc; score: number }[] | null>(null);

  const handleTestSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testQuery.trim()) {
      setSearchResults(null);
      return;
    }
    const res = defaultRetriever.retrieve(testQuery, 5);
    setSearchResults(res);
  };

  const displayList = searchResults !== null ? searchResults : currentEvidence;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-800 gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            Hybrid RAG Knowledge Base &amp; BM25 Okapi Engine
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent citation audit trail grounding Gemini 3.8 Flash in peer-reviewed environmental literature
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            {KNOWLEDGE_DOCS.length} Grounded Documents
          </span>
        </div>
      </div>

      {/* RAG Query Sandbox */}
      <form onSubmit={handleTestSearch} className="mt-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Test BM25 search in knowledge base (e.g. 'Miyawaki micro-forest', 'WHO PM2.5 standards', 'runoff coefficient')..."
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            className="w-full bg-slate-950 text-slate-200 text-xs rounded-lg pl-9 pr-3 py-2 border border-slate-800 focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
          />
        </div>
        <button
          type="submit"
          className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-semibold transition-colors flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Rank BM25
        </button>
        {searchResults !== null && (
          <button
            type="button"
            onClick={() => {
              setTestQuery('');
              setSearchResults(null);
            }}
            className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Reset
          </button>
        )}
      </form>

      {/* Retrieved Documents List */}
      <div className="mt-4 space-y-3 overflow-y-auto max-h-[500px] pr-1 custom-scrollbar">
        {displayList.map(({ doc, score }, idx) => (
          <div
            key={doc.id}
            className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <span className="text-xs font-semibold text-slate-200">
                  {doc.source}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                  {doc.topic}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 font-semibold">
                  BM25: {score.toFixed(2)}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-900/60 p-2.5 rounded border border-slate-800/60">
              "{doc.text}"
            </p>
          </div>
        ))}

        {displayList.length === 0 && (
          <div className="py-12 text-center text-slate-500 text-xs">
            No matching documents found in knowledge base.
          </div>
        )}
      </div>
    </div>
  );
};
