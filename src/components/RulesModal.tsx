import React from 'react';
import { BookOpen, X } from 'lucide-react';
import { Translations } from '../i18n/translations';

interface RulesModalProps {
  onClose: () => void;
  t: Translations;
}

export const RulesModal: React.FC<RulesModalProps> = ({ onClose, t }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-white border border-emerald-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 bg-[#065F46] text-white">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-emerald-200" />
            <h2 className="font-display font-bold text-lg">{t.rulesTitle}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeModal}
            className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-emerald-100 hover:bg-emerald-800 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex flex-col gap-5">
          <div className="flex flex-col gap-4">
            {t.rulesItems.map((item) => (
              <div
                key={item.title}
                className="pb-4 border-b border-slate-100 last:border-b-0 last:pb-0"
              >
                <h3 className="font-semibold text-sm text-emerald-950">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-emerald-50/70 border border-emerald-200 p-4">
            <h4 className="text-xs font-semibold text-emerald-900 mb-2.5">
              {t.shortcutsTitle}
            </h4>
            <div className="flex flex-wrap gap-4">
              {t.shortcuts.map((sc) => (
                <div key={sc.key} className="flex items-center gap-2 text-xs text-slate-700">
                  <kbd className="rounded-md border border-emerald-300 bg-white px-2 py-1 font-mono font-semibold text-emerald-900 shadow-2xs">
                    {sc.key}
                  </kbd>
                  <span>{sc.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 text-sm font-semibold transition-colors"
          >
            {t.closeModal}
          </button>
        </div>
      </div>
    </div>
  );
};
