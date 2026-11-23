import React, { useState } from 'react';
import { Check, Copy, FileSpreadsheet, Grid3X3, RotateCcw, Sparkles, X } from 'lucide-react';
import {
  boardToTsv,
  createDefaultBoard,
  parseTsvToBoard,
  POINT_VALUES,
} from '../data/defaultQuiz';
import { QuizBoardData } from '../types/quiz';
import { Translations } from '../i18n/translations';

interface BoardEditorModalProps {
  board: QuizBoardData;
  onSaveBoard: (updated: QuizBoardData) => void;
  onClose: () => void;
  t: Translations;
}

export const BoardEditorModal: React.FC<BoardEditorModalProps> = ({
  board,
  onSaveBoard,
  onClose,
  t,
}) => {
  const [draft, setDraft] = useState<QuizBoardData>(() =>
    JSON.parse(JSON.stringify(board))
  );
  const [activeTab, setActiveTab] = useState<'grid' | 'import'>('grid');
  const [selectedCat, setSelectedCat] = useState(0);
  const [tsvText, setTsvText] = useState(() => boardToTsv(board));
  const [copied, setCopied] = useState(false);

  const updateCategoryName = (idx: number, value: string) => {
    setDraft((prev) => {
      const categories = [...prev.categories];
      categories[idx] = value;
      return { ...prev, categories };
    });
  };

  const updateCell = (
    catIndex: number,
    rowIndex: number,
    patch: Partial<{ question: string; answer: string; isBonus: boolean }>
  ) => {
    setDraft((prev) => ({
      ...prev,
      cells: prev.cells.map((c) =>
        c.categoryIndex === catIndex && c.rowIndex === rowIndex
          ? { ...c, ...patch }
          : c
      ),
    }));
  };

  const handleApplyTsv = () => {
    const parsed = parseTsvToBoard(tsvText);
    // Preserve answered flags if cell ids match? Usually new import resets board cleanly.
    setDraft(parsed);
    setActiveTab('grid');
  };

  const handleCopyTsv = async () => {
    const content = activeTab === 'import' ? tsvText : boardToTsv(draft);
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback ignored if clipboard blocked
    }
  };

  const handleRestoreDefault = () => {
    const fresh = createDefaultBoard();
    setDraft(fresh);
    setTsvText(boardToTsv(fresh));
  };

  const handleSwitchTab = (tab: 'grid' | 'import') => {
    if (tab === 'import') {
      setTsvText(boardToTsv(draft));
    }
    setActiveTab(tab);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl rounded-2xl bg-white border border-emerald-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 bg-[#065F46] text-white">
          <div className="min-w-0">
            <h2 className="font-display font-bold text-lg sm:text-xl truncate">
              {t.editorTitle}
            </h2>
            <p className="text-xs text-emerald-100 mt-0.5 truncate">
              {t.editorSubtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeModal}
            className="h-9 w-9 shrink-0 inline-flex items-center justify-center rounded-lg text-emerald-100 hover:bg-emerald-800 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-toolbar */}
        <div className="px-6 py-3 bg-emerald-50/70 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-white border border-emerald-200 rounded-lg">
            <button
              type="button"
              onClick={() => handleSwitchTab('grid')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'grid'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-emerald-900'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>{t.tabGrid}</span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchTab('import')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'import'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-emerald-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{t.tabImport}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleRestoreDefault}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800 hover:text-emerald-950 px-3 py-1.5 rounded-lg hover:bg-emerald-100/70 transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetDefaultBoard}</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-5">
          {activeTab === 'grid' ? (
            <>
              {/* Title + Category Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    {t.boardNameLabel}
                  </label>
                  <input
                    type="text"
                    value={draft.title}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    {t.categoriesLabel}
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {draft.categories.map((cat, idx) => (
                      <button
                        key={`tab-${idx}`}
                        type="button"
                        onClick={() => setSelectedCat(idx)}
                        className={`px-2.5 py-2 rounded-lg text-xs font-semibold border transition-colors truncate ${
                          selectedCat === idx
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'
                        }`}
                        title={cat}
                      >
                        {cat || `Category ${idx + 1}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Category Rename + 5 Rows */}
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-emerald-900 shrink-0">
                    #{selectedCat + 1}
                  </span>
                  <input
                    type="text"
                    value={draft.categories[selectedCat] || ''}
                    onChange={(e) => updateCategoryName(selectedCat, e.target.value)}
                    placeholder={`Category ${selectedCat + 1}`}
                    className="flex-1 rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="flex flex-col gap-2.5">
                  {POINT_VALUES.map((pts, rowIndex) => {
                    const cell = draft.cells.find(
                      (c) =>
                        c.categoryIndex === selectedCat && c.rowIndex === rowIndex
                    );
                    if (!cell) return null;

                    return (
                      <div
                        key={cell.id}
                        className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center rounded-xl border border-slate-200 bg-white p-3"
                      >
                        <div className="md:col-span-1 font-mono font-bold text-sm text-emerald-800 tabular-nums">
                          {pts}
                        </div>

                        <div className="md:col-span-5">
                          <input
                            type="text"
                            value={cell.question}
                            disabled={cell.isBonus}
                            onChange={(e) =>
                              updateCell(selectedCat, rowIndex, {
                                question: e.target.value,
                              })
                            }
                            placeholder={t.questionLabel}
                            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-900 disabled:bg-slate-100 disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                          />
                        </div>

                        <div className="md:col-span-4">
                          <input
                            type="text"
                            value={cell.answer}
                            disabled={cell.isBonus}
                            onChange={(e) =>
                              updateCell(selectedCat, rowIndex, {
                                answer: e.target.value,
                              })
                            }
                            placeholder={t.answerLabel}
                            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-900 disabled:bg-slate-100 disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                          />
                        </div>

                        <div className="md:col-span-2 flex justify-end">
                          <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-medium text-slate-700 select-none">
                            <input
                              type="checkbox"
                              checked={cell.isBonus}
                              onChange={(e) =>
                                updateCell(selectedCat, rowIndex, {
                                  isBonus: e.target.checked,
                                  question: e.target.checked
                                    ? String(pts)
                                    : cell.question === String(pts)
                                    ? ''
                                    : cell.question,
                                  answer: e.target.checked
                                    ? 'Bonus'
                                    : cell.answer.toLowerCase() === 'bonus'
                                    ? ''
                                    : cell.answer,
                                })
                              }
                              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
                            />
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>Bonus</span>
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Final Question Section */}
              <div className="rounded-xl border border-slate-200 p-4 flex flex-col gap-3">
                <label className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-950 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.finalQuestion.enabled}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        finalQuestion: {
                          ...prev.finalQuestion,
                          enabled: e.target.checked,
                        },
                      }))
                    }
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
                  />
                  <span>{t.finalQuestionEnable}</span>
                </label>

                {draft.finalQuestion.enabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={draft.finalQuestion.question}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          finalQuestion: {
                            ...prev.finalQuestion,
                            question: e.target.value,
                          },
                        }))
                      }
                      placeholder={t.questionLabel}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                    <input
                      type="text"
                      value={draft.finalQuestion.answer}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          finalQuestion: {
                            ...prev.finalQuestion,
                            answer: e.target.value,
                          },
                        }))
                      }
                      placeholder={t.answerLabel}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-slate-600">{t.pasteTsvHelp}</p>
                <button
                  type="button"
                  onClick={handleCopyTsv}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t.copyTsv}</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                value={tsvText}
                onChange={(e) => setTsvText(e.target.value)}
                rows={13}
                spellCheck={false}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3.5 font-mono text-xs text-slate-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleApplyTsv}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-sm font-bold transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>{t.applyTsv}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg"
          >
            {t.cancel}
          </button>
          <button
            type="button"
            onClick={() => onSaveBoard(draft)}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 text-sm font-bold transition-colors"
          >
            {t.saveChanges}
          </button>
        </div>
      </div>
    </div>
  );
};
