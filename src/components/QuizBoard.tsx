import React from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { POINT_VALUES } from '../data/defaultQuiz';
import { QuizBoardData, QuizCell, Team } from '../types/quiz';
import { Translations } from '../i18n/translations';

interface QuizBoardProps {
  board: QuizBoardData;
  teams: Team[];
  onSelectCell: (cell: QuizCell) => void;
  t: Translations;
}

export const QuizBoard: React.FC<QuizBoardProps> = ({
  board,
  teams,
  onSelectCell,
  t,
}) => {
  const getTeamName = (teamId?: string | null) => {
    if (!teamId) return null;
    return teams.find((tm) => tm.id === teamId)?.name ?? null;
  };

  return (
    <section
      aria-label={board.title}
      className="flex-1 min-w-0 bg-white rounded-2xl border border-[#CFE2D7] p-4 sm:p-5 lg:p-6 shadow-sm flex flex-col justify-center"
    >
      <div className="overflow-x-auto">
        <div className="min-w-[680px] grid grid-cols-6 gap-3 sm:gap-3.5 lg:gap-4">
          {/* Row 1: Category Headers */}
          {board.categories.map((category, idx) => (
            <div
              key={`cat-${idx}`}
              className="min-h-[78px] sm:min-h-[88px] lg:min-h-[96px] rounded-2xl bg-[#065F46] text-white px-3 py-2.5 flex flex-col items-center justify-center text-center shadow-xs border border-[#044734]"
            >
              <span className="font-display font-bold text-base sm:text-lg xl:text-xl leading-snug line-clamp-2">
                {category}
              </span>
            </div>
          ))}

          {/* Rows 2-6: Point Tiles (100 - 500) */}
          {POINT_VALUES.map((points, rowIndex) =>
            board.categories.map((_, catIndex) => {
              const cell = board.cells.find(
                (c) => c.categoryIndex === catIndex && c.rowIndex === rowIndex
              );
              if (!cell) return null;

              const winnerName = getTeamName(cell.answeredByTeamId);

              if (cell.isAnswered) {
                return (
                  <button
                    key={cell.id}
                    type="button"
                    onClick={() => onSelectCell(cell)}
                    title={`${categoryLabel(board.categories, catIndex)} · ${points}`}
                    className="group min-h-[88px] sm:min-h-[104px] lg:min-h-[116px] rounded-2xl border border-[#DCE8E1] bg-[#F1F6F3] px-2.5 py-2.5 flex flex-col items-center justify-center text-center transition-all duration-150 hover:border-emerald-300 hover:bg-[#E7F2EC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                  >
                    <span className="font-display font-bold text-3xl sm:text-4xl lg:text-[42px] tabular-nums text-[#A0B6AA] group-hover:text-emerald-700 transition-colors">
                      {cell.points}
                    </span>
                    <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#6C8577] truncate max-w-full">
                      {cell.isBonus ? (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="truncate">{winnerName || 'Bonus'}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600/70 shrink-0" />
                          <span className="truncate">{winnerName || t.answeredLabel}</span>
                        </>
                      )}
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={cell.id}
                  type="button"
                  onClick={() => onSelectCell(cell)}
                  className="group min-h-[88px] sm:min-h-[104px] lg:min-h-[116px] rounded-2xl border-2 border-[#CBE0D4] bg-white px-2.5 py-2.5 flex flex-col items-center justify-center text-center shadow-[0_3px_0_0_#CBE0D4] transition-all duration-150 hover:-translate-y-0.5 hover:border-emerald-600 hover:bg-emerald-50/70 hover:shadow-[0_5px_0_0_#059669] active:translate-y-0 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                >
                  <span className="font-display font-extrabold text-3xl sm:text-4xl lg:text-[46px] tabular-nums text-[#064E3B] group-hover:text-emerald-700 transition-colors">
                    {cell.points}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

function categoryLabel(categories: string[], idx: number): string {
  return categories[idx] || `Category ${idx + 1}`;
}
