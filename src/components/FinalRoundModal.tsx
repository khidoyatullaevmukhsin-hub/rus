import React, { useState } from 'react';
import { Check, Eye, Trophy, X } from 'lucide-react';
import { FinalQuestion, QuestionDirection, Team } from '../types/quiz';
import { Translations } from '../i18n/translations';
import { TEAM_COLOR_STYLES } from '../utils/teamColors';
import { quizAudio } from '../utils/sound';

interface FinalRoundModalProps {
  finalQuestion: FinalQuestion;
  teams: Team[];
  soundEnabled: boolean;
  questionDirection: QuestionDirection;
  onApplyFinalScores: (deltas: Record<string, number>) => void;
  onClose: () => void;
  t: Translations;
}

export const FinalRoundModal: React.FC<FinalRoundModalProps> = ({
  finalQuestion,
  teams,
  soundEnabled,
  questionDirection,
  onApplyFinalScores,
  onClose,
  t,
}) => {
  const [step, setStep] = useState<'wager' | 'question'>('wager');
  const [answerShown, setAnswerShown] = useState(false);

  const isUzToRu = questionDirection === 'uz-ru';
  const displayedQuestion = isUzToRu ? finalQuestion.answer : finalQuestion.question;
  const displayedAnswer = isUzToRu ? finalQuestion.question : finalQuestion.answer;

  const [wagers, setWagers] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    teams.forEach((tm) => {
      init[tm.id] = Math.max(0, Math.min(tm.score, 500));
    });
    return init;
  });

  const [outcomes, setOutcomes] = useState<Record<string, 'correct' | 'wrong' | null>>({});

  const updateWager = (teamId: string, max: number, raw: string) => {
    const num = Math.max(0, parseInt(raw || '0', 10) || 0);
    setWagers((prev) => ({
      ...prev,
      [teamId]: Math.min(num, Math.max(max, 500)),
    }));
  };

  const handleFinish = () => {
    const deltas: Record<string, number> = {};
    teams.forEach((tm) => {
      const wager = wagers[tm.id] || 0;
      const outcome = outcomes[tm.id];
      if (outcome === 'correct') deltas[tm.id] = wager;
      else if (outcome === 'wrong') deltas[tm.id] = -wager;
      else deltas[tm.id] = 0;
    });
    quizAudio.victory(soundEnabled);
    onApplyFinalScores(deltas);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-emerald-950/65 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-3xl bg-white border border-emerald-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 bg-[#065F46] text-white">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-amber-300" />
            <h2 className="font-display font-bold text-xl sm:text-2xl">
              {t.finalRoundTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeModal}
            className="h-10 w-10 inline-flex items-center justify-center rounded-xl text-emerald-100 hover:bg-emerald-800 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto flex-1 flex flex-col gap-6">
          {step === 'wager' ? (
            <>
              <div>
                <h3 className="font-bold text-lg text-emerald-950">
                  {t.wagerStep}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 mt-1">{t.finalRoundSubtitle}</p>
              </div>

              <div className="flex flex-col gap-3">
                {teams.map((team) => {
                  const style = TEAM_COLOR_STYLES[team.color];
                  const maxAllowed = Math.max(team.score, 500);
                  return (
                    <div
                      key={team.id}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4 bg-slate-50/50"
                    >
                      <div className="min-w-0">
                        <span className={`font-bold text-base truncate block ${style.accentText}`}>
                          {team.name}
                        </span>
                        <div className="text-sm text-slate-500 mt-0.5 tabular-nums">
                          {team.score} {t.pointsUnit} · {t.maxWager}: {maxAllowed}
                        </div>
                      </div>

                      <input
                        type="number"
                        min={0}
                        max={maxAllowed}
                        step={50}
                        value={wagers[team.id] ?? 0}
                        onChange={(e) => updateWager(team.id, team.score, e.target.value)}
                        className="w-32 rounded-xl border border-emerald-300 bg-white px-3.5 py-2.5 text-right font-mono font-bold text-lg tabular-nums text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div className="text-center py-8 px-6 rounded-2xl bg-[#F2F8F4] border-2 border-[#D2E6DA]">
                <div className="text-sm font-semibold text-emerald-800/80 mb-2.5">
                  {isUzToRu ? t.questionLabelUz : t.questionLabel}
                </div>
                <p className="font-display text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0F2419] leading-tight text-balance">
                  {displayedQuestion}
                </p>
              </div>

              {!answerShown ? (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setAnswerShown(true);
                      quizAudio.revealAnswer(soundEnabled);
                    }}
                    className="inline-flex items-center gap-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-base sm:text-lg font-bold shadow-sm transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                    <span>{t.revealFinalA}</span>
                  </button>
                </div>
              ) : (
                <div className="text-center py-6 px-6 rounded-2xl bg-emerald-600 text-white shadow-sm">
                  <div className="text-sm font-semibold text-emerald-100 mb-2">
                    {isUzToRu ? t.answerLabelRu : t.answerLabel}
                  </div>
                  <p className="font-display text-3xl sm:text-4xl font-extrabold leading-tight text-balance">
                    {displayedAnswer}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-2.5 border-t border-slate-200 pt-5">
                {teams.map((team) => {
                  const outcome = outcomes[team.id] ?? null;
                  const wager = wagers[team.id] ?? 0;
                  return (
                    <div
                      key={team.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <span className="font-bold text-base text-slate-900">
                          {team.name}
                        </span>
                        <span className="ml-2 text-sm font-mono text-slate-500 tabular-nums">
                          ({wager} {t.pointsUnit})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            quizAudio.correct(soundEnabled);
                            setOutcomes((prev) => ({ ...prev, [team.id]: 'correct' }));
                          }}
                          className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
                            outcome === 'correct'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                          <span>+{wager}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            quizAudio.wrong(soundEnabled);
                            setOutcomes((prev) => ({ ...prev, [team.id]: 'wrong' }));
                          }}
                          className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
                            outcome === 'wrong'
                              ? 'bg-rose-600 text-white'
                              : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                          }`}
                        >
                          <X className="w-4 h-4" />
                          <span>-{wager}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 rounded-xl"
          >
            {t.cancel}
          </button>

          {step === 'wager' ? (
            <button
              type="button"
              onClick={() => {
                quizAudio.openTile(soundEnabled);
                setStep('question');
              }}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 text-sm sm:text-base font-bold transition-colors"
            >
              {t.revealFinalQ}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 text-sm sm:text-base font-bold transition-colors"
            >
              {t.finishGame}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
