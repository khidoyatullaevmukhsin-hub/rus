import React, { useEffect, useState } from 'react';
import { ArrowLeftRight, Check, Clock, Eye, RotateCcw, Sparkles, X } from 'lucide-react';
import { GameSettings, QuizCell, Team } from '../types/quiz';
import { Translations } from '../i18n/translations';
import { TEAM_COLOR_STYLES } from '../utils/teamColors';
import { quizAudio } from '../utils/sound';

interface QuestionModalProps {
  cell: QuizCell;
  categoryName: string;
  teams: Team[];
  activeTeamId: string;
  settings: GameSettings;
  onToggleDirection: () => void;
  onAwardTeam: (cellId: string, teamId: string, delta: number, markAnswered: boolean) => void;
  onCloseWithoutAnswer: (cellId: string, markAnswered: boolean) => void;
  onReopenCell: (cellId: string) => void;
  onDismiss: () => void;
  t: Translations;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  cell,
  categoryName,
  teams,
  activeTeamId,
  settings,
  onToggleDirection,
  onAwardTeam,
  onCloseWithoutAnswer,
  onReopenCell,
  onDismiss,
  t,
}) => {
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(settings.timerSeconds);
  const [wrongTeamIds, setWrongTeamIds] = useState<string[]>([]);

  const isUzToRu = settings.questionDirection === 'uz-ru';
  const displayedQuestion = isUzToRu ? cell.answer : cell.question;
  const displayedAnswer = isUzToRu ? cell.question : cell.answer;
  const displayedQuestionLabel = isUzToRu ? t.questionLabelUz : t.questionLabel;
  const displayedAnswerLabel = isUzToRu ? t.answerLabelRu : t.answerLabel;

  useEffect(() => {
    setAnswerRevealed(false);
    setSecondsLeft(settings.timerSeconds);
    setWrongTeamIds([]);
  }, [cell.id, settings.timerSeconds]);

  // Countdown timer when enabled and not bonus and answer not yet revealed
  useEffect(() => {
    if (
      settings.timerSeconds <= 0 ||
      cell.isBonus ||
      answerRevealed ||
      cell.isAnswered
    ) {
      return;
    }
    if (secondsLeft <= 0) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [settings.timerSeconds, cell.isBonus, answerRevealed, cell.isAnswered, secondsLeft]);

  // Keyboard shortcuts: Space reveals answer, Esc closes modal
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onDismiss();
      } else if (e.key === ' ' && !cell.isBonus && !answerRevealed) {
        e.preventDefault();
        setAnswerRevealed(true);
        quizAudio.revealAnswer(settings.soundEnabled);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [answerRevealed, cell.isBonus, onDismiss, settings.soundEnabled]);

  const handleReveal = () => {
    setAnswerRevealed(true);
    quizAudio.revealAnswer(settings.soundEnabled);
  };

  const handleCorrect = (teamId: string) => {
    quizAudio.correct(settings.soundEnabled);
    onAwardTeam(cell.id, teamId, cell.points, true);
  };

  const handleWrong = (teamId: string) => {
    if (wrongTeamIds.includes(teamId)) return;
    quizAudio.wrong(settings.soundEnabled);
    setWrongTeamIds((prev) => [...prev, teamId]);
    if (settings.deductOnWrong) {
      onAwardTeam(cell.id, teamId, -cell.points, false);
    }
  };

  const handleClaimBonus = (teamId: string) => {
    quizAudio.bonus(settings.soundEnabled);
    onAwardTeam(cell.id, teamId, cell.points, true);
  };

  const timerProgress =
    settings.timerSeconds > 0 ? (secondsLeft / settings.timerSeconds) * 100 : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-emerald-950/65 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="question-modal-title"
      onClick={onDismiss}
    >
      <div
        className="w-full max-w-5xl rounded-3xl bg-white border border-emerald-200 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-4 px-6 sm:px-8 py-5 bg-[#065F46] text-white">
          <div className="flex items-center gap-3 min-w-0">
            <h2
              id="question-modal-title"
              className="font-display font-bold text-xl sm:text-2xl truncate"
            >
              {categoryName}
            </h2>
            <span aria-hidden="true" className="text-emerald-300">
              ·
            </span>
            <span className="font-mono font-bold text-lg sm:text-2xl tabular-nums text-emerald-100 shrink-0">
              {cell.points} {t.pointsUnit}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!cell.isBonus && (
              <button
                type="button"
                onClick={onToggleDirection}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 px-3.5 py-2 text-xs sm:text-sm font-semibold text-emerald-50 transition-colors whitespace-nowrap"
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span>{isUzToRu ? t.directionUzToRu : t.directionRuToUz}</span>
              </button>
            )}
            {cell.isAnswered && (
              <button
                type="button"
                onClick={() => onReopenCell(cell.id)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 px-3.5 py-2 text-xs sm:text-sm font-semibold text-emerald-50 transition-colors whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t.undoTile}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onDismiss}
              aria-label={t.closeModal}
              className="h-10 w-10 inline-flex items-center justify-center rounded-xl text-emerald-100 hover:bg-emerald-800 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Optional Timer Strip */}
        {settings.timerSeconds > 0 && !cell.isBonus && !cell.isAnswered && (
          <div className="bg-emerald-50 border-b border-emerald-100 px-6 sm:px-8 py-2.5 flex items-center gap-3">
            <Clock
              className={`w-5 h-5 shrink-0 ${
                secondsLeft <= 5 ? 'text-rose-600' : 'text-emerald-700'
              }`}
            />
            <div className="flex-1 h-2.5 rounded-full bg-emerald-200/70 overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ease-linear ${
                  secondsLeft <= 5 ? 'bg-rose-500' : 'bg-emerald-600'
                }`}
                style={{ width: `${timerProgress}%` }}
              />
            </div>
            <span
              className={`font-mono text-sm font-bold tabular-nums w-20 text-right ${
                secondsLeft === 0
                  ? 'text-rose-700'
                  : secondsLeft <= 5
                  ? 'text-rose-600'
                  : 'text-emerald-900'
              }`}
            >
              {secondsLeft === 0 ? t.timeUp : `${secondsLeft} ${t.timerLabel}`}
            </span>
          </div>
        )}

        {/* Body */}
        <div className="p-6 sm:p-8 lg:p-10 overflow-y-auto flex-1 flex flex-col gap-6">
          {cell.isBonus ? (
            <div className="py-8 px-6 sm:px-10 rounded-3xl bg-gradient-to-br from-emerald-50 to-amber-50/70 border-2 border-emerald-200 text-center flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="text-sm font-bold tracking-wide text-emerald-700">
                {t.bonusBadge} · +{cell.points} {t.pointsUnit}
              </div>
              <h3 className="font-display text-4xl sm:text-5xl font-extrabold text-emerald-950">
                {t.bonusHeading}
              </h3>
              <p className="text-base sm:text-lg text-slate-600 max-w-lg leading-relaxed">
                {t.bonusDescription}
              </p>

              <div className="mt-4 w-full">
                <div className="text-sm font-semibold text-slate-500 mb-3">
                  {t.claimBonusFor}:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {teams.map((team) => {
                    const style = TEAM_COLOR_STYLES[team.color];
                    const isTurn = team.id === activeTeamId;
                    return (
                      <button
                        key={team.id}
                        type="button"
                        onClick={() => handleClaimBonus(team.id)}
                        className={`rounded-2xl border-2 px-5 py-4 text-base font-bold transition-all flex items-center justify-center gap-2 ${
                          isTurn
                            ? `${style.button} border-transparent shadow-sm`
                            : 'bg-white border-emerald-200 text-emerald-950 hover:border-emerald-500 hover:bg-emerald-50'
                        }`}
                      >
                        <Sparkles className="w-5 h-5 shrink-0" />
                        <span className="truncate">{team.name}</span>
                        <span className="font-mono tabular-nums">+{cell.points}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Primary Question Card */}
              <div className="text-center py-8 sm:py-12 px-6 sm:px-10 rounded-2xl bg-[#F2F8F4] border-2 border-[#D2E6DA]">
                <div className="text-sm font-semibold text-emerald-800/80 mb-3">
                  {displayedQuestionLabel}
                </div>
                <p className="font-display text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#0F2419] leading-tight text-balance">
                  {displayedQuestion}
                </p>
              </div>

              {/* Answer Reveal Zone */}
              {!answerRevealed ? (
                <div className="flex justify-center py-2">
                  <button
                    type="button"
                    onClick={handleReveal}
                    className="inline-flex items-center gap-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 sm:py-5 text-lg sm:text-xl font-bold shadow-md transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                  >
                    <Eye className="w-6 h-6" />
                    <span>{t.revealAnswer}</span>
                  </button>
                </div>
              ) : (
                <div className="text-center py-7 sm:py-10 px-6 sm:px-10 rounded-2xl bg-emerald-600 text-white shadow-md">
                  <div className="text-sm font-semibold text-emerald-100 mb-2.5">
                    {displayedAnswerLabel}
                  </div>
                  <p className="font-display text-3xl sm:text-4xl lg:text-[46px] font-extrabold leading-tight text-balance">
                    {displayedAnswer}
                  </p>
                </div>
              )}

              {/* Team Scoring Controls */}
              <div className="border-t border-slate-200 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {teams.map((team) => {
                    const style = TEAM_COLOR_STYLES[team.color];
                    const isTurn = team.id === activeTeamId;
                    const alreadyMissed = wrongTeamIds.includes(team.id);

                    return (
                      <div
                        key={team.id}
                        className={`rounded-2xl border-2 p-4 flex flex-col gap-3 ${
                          isTurn
                            ? 'border-emerald-500 bg-emerald-50/50'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`font-bold text-base truncate ${style.accentText}`}>
                            {team.name}
                          </span>
                          <span className="font-mono text-sm font-bold tabular-nums text-slate-600">
                            {team.score}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleCorrect(team.id)}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2.5 text-sm font-bold transition-colors whitespace-nowrap"
                          >
                            <Check className="w-4 h-4" />
                            <span>+{cell.points}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleWrong(team.id)}
                            disabled={alreadyMissed}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-2.5 text-sm font-bold transition-colors disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap"
                          >
                            <X className="w-4 h-4" />
                            <span>
                              {settings.deductOnWrong ? `-${cell.points}` : t.wrongBtn}
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onDismiss}
            className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 rounded-xl hover:bg-slate-200/60 transition-colors whitespace-nowrap"
          >
            {t.cancel}
          </button>

          {!cell.isBonus && (
            <button
              type="button"
              onClick={() => onCloseWithoutAnswer(cell.id, true)}
              className="text-sm font-bold text-emerald-900 bg-white border border-emerald-300 hover:bg-emerald-50 px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap"
            >
              {t.nobodyAnswered}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
