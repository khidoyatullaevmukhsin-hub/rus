import React from 'react';
import { RotateCcw, Trophy, X } from 'lucide-react';
import { Team } from '../types/quiz';
import { Translations } from '../i18n/translations';
import { TEAM_COLOR_STYLES } from '../utils/teamColors';

interface VictoryModalProps {
  teams: Team[];
  onPlayAgain: () => void;
  onClose: () => void;
  t: Translations;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  teams,
  onPlayAgain,
  onClose,
  t,
}) => {
  const sorted = [...teams].sort((a, b) => b.score - a.score);
  const topScore = sorted[0]?.score ?? 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-3xl bg-white border border-emerald-200 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 py-7 bg-[#065F46] text-white text-center relative">
          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeModal}
            className="absolute right-4 top-4 h-9 w-9 inline-flex items-center justify-center rounded-xl text-emerald-100 hover:bg-emerald-800"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mx-auto mb-3.5 h-16 w-16 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center shadow-sm">
            <Trophy className="w-8 h-8" />
          </div>
          <h2 className="font-display text-3xl font-extrabold">{t.victoryTitle}</h2>
          <p className="text-base text-emerald-100 mt-1.5">{t.victorySubtitle}</p>
        </div>

        <div className="p-6 sm:p-8 flex flex-col gap-3.5">
          {sorted.map((team, idx) => {
            const style = TEAM_COLOR_STYLES[team.color];
            const isWinner = team.score === topScore;
            return (
              <div
                key={team.id}
                className={`flex items-center justify-between gap-4 rounded-2xl border-2 px-5 py-4 ${
                  isWinner
                    ? 'border-emerald-500 bg-emerald-50/70'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono font-bold text-base text-slate-400 w-6">
                    {idx + 1}.
                  </span>
                  <span className={`font-bold text-lg truncate ${style.accentText}`}>
                    {team.name}
                  </span>
                  {isWinner && (
                    <span className="text-sm font-bold text-emerald-700">
                      · {t.winnerBadge}
                    </span>
                  )}
                </div>
                <span className="font-mono text-3xl font-bold tabular-nums text-emerald-950">
                  {team.score}
                </span>
              </div>
            );
          })}
        </div>

        <div className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
          >
            {t.closeModal}
          </button>
          <button
            type="button"
            onClick={onPlayAgain}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 text-sm sm:text-base font-bold transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.playAgain}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
