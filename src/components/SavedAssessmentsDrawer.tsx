/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Saved Assessments Drawer with Real-Time Cloud Firestore Sync
 */

import React, { useState } from 'react';
import {
  X,
  Bookmark,
  Trash2,
  Calendar,
  CloudSun,
  TreePine,
  ExternalLink,
  Droplets,
  Wind
} from 'lucide-react';
import { SavedAssessmentRecord, deleteSavedAssessment } from '../lib/firebase';

interface SavedAssessmentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedList: SavedAssessmentRecord[];
  onSelectAssessment: (city: string) => void;
  currentUserId: string | null;
}

export const SavedAssessmentsDrawer: React.FC<SavedAssessmentsDrawerProps> = ({
  isOpen,
  onClose,
  savedList,
  onSelectAssessment,
  currentUserId
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await deleteSavedAssessment(id);
    } catch (err) {
      console.error('Error deleting saved assessment:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Saved Masterplans
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {savedList.length}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Synchronized with Cloud Firestore
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {!currentUserId ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="inline-flex p-3 rounded-full bg-slate-800/80 text-slate-400 mb-1">
                <Bookmark className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-300">
                Sign in to save and access your assessments
              </p>
              <p className="text-xs text-slate-500">
                Your saved environmental diagnostics and masterplans will sync across all your devices securely.
              </p>
            </div>
          ) : savedList.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="inline-flex p-3 rounded-full bg-slate-800/80 text-emerald-400 mb-1">
                <Bookmark className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-300">
                No saved masterplans yet
              </p>
              <p className="text-xs text-slate-500">
                Click &ldquo;Save to Firebase&rdquo; on any active diagnostic report to store and retrieve your urban masterplans anytime.
              </p>
            </div>
          ) : (
            savedList.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectAssessment(item.city);
                  onClose();
                }}
                className="group relative bg-slate-950/70 hover:bg-slate-800/50 border border-slate-800 hover:border-emerald-500/40 rounded-xl p-3.5 transition-all cursor-pointer space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                      {item.city}, {item.country}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                      AQI {item.aqiScore}
                    </span>
                    <button
                      onClick={(e) => handleDelete(e, item.id)}
                      disabled={deletingId === item.id}
                      className="p-1 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-colors opacity-70 group-hover:opacity-100 cursor-pointer"
                      title="Delete assessment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Key Metrics Chips */}
                <div className="grid grid-cols-3 gap-1.5 pt-1 text-center text-[10px]">
                  <div className="bg-slate-900/80 rounded-lg p-1.5 border border-slate-800/60">
                    <div className="text-slate-400 flex items-center justify-center gap-1">
                      <TreePine className="w-2.5 h-2.5 text-emerald-400" />
                      Trees
                    </div>
                    <div className="font-semibold text-emerald-300 mt-0.5">
                      {item.treeTarget.toLocaleString()}
                    </div>
                  </div>

                  <div className="bg-slate-900/80 rounded-lg p-1.5 border border-slate-800/60">
                    <div className="text-slate-400 flex items-center justify-center gap-1">
                      <Wind className="w-2.5 h-2.5 text-cyan-400" />
                      CO2/yr
                    </div>
                    <div className="font-semibold text-cyan-300 mt-0.5">
                      {item.co2AbsorbedTons ? `${item.co2AbsorbedTons} t` : '—'}
                    </div>
                  </div>

                  <div className="bg-slate-900/80 rounded-lg p-1.5 border border-slate-800/60">
                    <div className="text-slate-400 flex items-center justify-center gap-1">
                      <Droplets className="w-2.5 h-2.5 text-blue-400" />
                      Cooling
                    </div>
                    <div className="font-semibold text-blue-300 mt-0.5">
                      {item.uhiCoolingC ? `-${item.uhiCoolingC}°C` : '—'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end text-[11px] text-emerald-400 font-medium group-hover:translate-x-0.5 transition-transform">
                  <span className="flex items-center gap-1">
                    Load Diagnostic
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/70 text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
          <CloudSun className="w-3.5 h-3.5 text-emerald-400" />
          <span>Realtime Firestore Database: {currentUserId ? 'Connected & Active' : 'Waiting for Sign-in'}</span>
        </div>
      </div>
    </div>
  );
};
