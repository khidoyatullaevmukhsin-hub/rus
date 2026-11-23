import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeftRight,
  Clock,
  RotateCcw,
  ShieldAlert,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  createDefaultBoard,
  DEFAULT_TEAMS,
  TEAM_COLOR_ORDER,
} from './data/defaultQuiz';
import { TRANSLATIONS } from './i18n/translations';
import {
  GameSettings,
  Language,
  QuizBoardData,
  QuizCell,
  Team,
} from './types/quiz';
import { quizAudio } from './utils/sound';
import { TeamSidebar } from './components/TeamSidebar';
import { QuizBoard } from './components/QuizBoard';
import { QuestionModal } from './components/QuestionModal';
import { BoardEditorModal } from './components/BoardEditorModal';
import { FinalRoundModal } from './components/FinalRoundModal';
import { VictoryModal } from './components/VictoryModal';
import { RulesModal } from './components/RulesModal';

const STORAGE_KEY = 'rus_tili_quiz_show_v1';

interface PersistedState {
  board: QuizBoardData;
  teams: Team[];
  activeTeamId: string;
  settings: GameSettings;
}

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  deductOnWrong: false,
  timerSeconds: 0,
  language: 'uz',
  questionDirection: 'ru-uz',
};

function loadInitialState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      if (parsed.board && Array.isArray(parsed.teams) && parsed.teams.length > 0) {
        return {
          board: parsed.board,
          teams: parsed.teams,
          activeTeamId: parsed.activeTeamId || parsed.teams[0].id,
          settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
        };
      }
    }
  } catch {
    // Fallback to clean defaults
  }

  return {
    board: createDefaultBoard(),
    teams: DEFAULT_TEAMS,
    activeTeamId: DEFAULT_TEAMS[0].id,
    settings: DEFAULT_SETTINGS,
  };
}

export default function App() {
  const [initial] = useState<PersistedState>(() => loadInitialState());
  const [board, setBoard] = useState<QuizBoardData>(initial.board);
  const [teams, setTeams] = useState<Team[]>(initial.teams);
  const [activeTeamId, setActiveTeamId] = useState<string>(initial.activeTeamId);
  const [settings, setSettings] = useState<GameSettings>(initial.settings);

  const [activeCellId, setActiveCellId] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const t = TRANSLATIONS[settings.language];

  useEffect(() => {
    try {
      const payload: PersistedState = { board, teams, activeTeamId, settings };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage quota errors
    }
  }, [board, teams, activeTeamId, settings]);

  const activeCell = useMemo(
    () => board.cells.find((c) => c.id === activeCellId) ?? null,
    [board.cells, activeCellId]
  );

  const answeredCount = useMemo(
    () => board.cells.filter((c) => c.isAnswered).length,
    [board.cells]
  );
  const totalCells = board.cells.length;

  const advanceTurn = () => {
    setTeams((currentTeams) => {
      if (currentTeams.length <= 1) return currentTeams;
      const idx = currentTeams.findIndex((tm) => tm.id === activeTeamId);
      const next = currentTeams[(idx + 1) % currentTeams.length];
      if (next) setActiveTeamId(next.id);
      return currentTeams;
    });
  };

  const handleSelectCell = (cell: QuizCell) => {
    quizAudio.openTile(settings.soundEnabled);
    setActiveCellId(cell.id);
  };

  const checkAllCompleted = (updatedCells: QuizCell[]) => {
    if (updatedCells.length > 0 && updatedCells.every((c) => c.isAnswered)) {
      window.setTimeout(() => {
        quizAudio.victory(settings.soundEnabled);
        setShowVictory(true);
      }, 250);
    }
  };

  const handleAwardTeam = (
    cellId: string,
    teamId: string,
    delta: number,
    markAnswered: boolean
  ) => {
    setTeams((prev) =>
      prev.map((tm) =>
        tm.id === teamId ? { ...tm, score: tm.score + delta } : tm
      )
    );

    if (markAnswered) {
      const nextCells = board.cells.map((c) =>
        c.id === cellId
          ? { ...c, isAnswered: true, answeredByTeamId: teamId }
          : c
      );
      setBoard((prev) => ({ ...prev, cells: nextCells }));
      setActiveCellId(null);
      advanceTurn();
      checkAllCompleted(nextCells);
    }
  };

  const handleCloseWithoutAnswer = (cellId: string, markAnswered: boolean) => {
    if (markAnswered) {
      const nextCells = board.cells.map((c) =>
        c.id === cellId
          ? { ...c, isAnswered: true, answeredByTeamId: null }
          : c
      );
      setBoard((prev) => ({ ...prev, cells: nextCells }));
      advanceTurn();
      checkAllCompleted(nextCells);
    }
    setActiveCellId(null);
  };

  const handleReopenCell = (cellId: string) => {
    setBoard((prev) => ({
      ...prev,
      cells: prev.cells.map((c) =>
        c.id === cellId
          ? { ...c, isAnswered: false, answeredByTeamId: null }
          : c
      ),
    }));
    setActiveCellId(null);
  };

  const handleRenameTeam = (teamId: string, name: string) => {
    setTeams((prev) =>
      prev.map((tm) => (tm.id === teamId ? { ...tm, name } : tm))
    );
  };

  const handleAdjustScore = (teamId: string, delta: number) => {
    setTeams((prev) =>
      prev.map((tm) =>
        tm.id === teamId ? { ...tm, score: tm.score + delta } : tm
      )
    );
  };

  const handleAddTeam = () => {
    if (teams.length >= 6) return;
    const nextIndex = teams.length + 1;
    const color = TEAM_COLOR_ORDER[(nextIndex - 1) % TEAM_COLOR_ORDER.length];
    const label =
      settings.language === 'ru'
        ? `Команда ${nextIndex}`
        : settings.language === 'en'
        ? `Team ${nextIndex}`
        : `${nextIndex}-jamoa`;
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: label,
      score: 0,
      color,
    };
    setTeams((prev) => [...prev, newTeam]);
  };

  const handleRemoveLastTeam = () => {
    if (teams.length <= 1) return;
    setTeams((prev) => {
      const updated = prev.slice(0, -1);
      if (!updated.some((tm) => tm.id === activeTeamId)) {
        setActiveTeamId(updated[0].id);
      }
      return updated;
    });
  };

  const executeResetGame = () => {
    setTeams((prev) => prev.map((tm) => ({ ...tm, score: 0 })));
    setBoard((prev) => ({
      ...prev,
      cells: prev.cells.map((c) => ({
        ...c,
        isAnswered: false,
        answeredByTeamId: null,
      })),
    }));
    setActiveTeamId(teams[0]?.id || DEFAULT_TEAMS[0].id);
    setConfirmResetOpen(false);
    setShowVictory(false);
  };

  const handleNewGameRequest = () => {
    const hasProgress =
      answeredCount > 0 || teams.some((tm) => tm.score !== 0);
    if (hasProgress) {
      setConfirmResetOpen(true);
    } else {
      executeResetGame();
    }
  };

  const cycleTimer = () => {
    const options = [0, 15, 20, 30];
    const next =
      options[(options.indexOf(settings.timerSeconds) + 1) % options.length];
    setSettings((prev) => ({ ...prev, timerSeconds: next }));
  };

  const toggleQuestionDirection = () => {
    setSettings((prev) => ({
      ...prev,
      questionDirection: prev.questionDirection === 'ru-uz' ? 'uz-ru' : 'ru-uz',
    }));
  };

  const handleApplyFinalScores = (deltas: Record<string, number>) => {
    setTeams((prev) =>
      prev.map((tm) => ({
        ...tm,
        score: tm.score + (deltas[tm.id] || 0),
      }))
    );
    setShowFinal(false);
    setShowVictory(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F8F5] text-[#0F2419]">
      {/* Strict 3-Zone Top Bar */}
      <header className="bg-white border-b border-[#D5E4DC]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <span className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-[#064E3B] whitespace-nowrap shrink-0">
            {board.title || t.brandTitle}
          </span>

          {/* Zone 2: 4 Single-line Navigation Actions */}
          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600"
          >
            <button
              type="button"
              onClick={() => {
                setShowEditor(false);
                setShowFinal(false);
                setShowRules(false);
              }}
              className="text-[#065F46] hover:underline underline-offset-4 whitespace-nowrap shrink-0"
            >
              {t.navBoard}
            </button>
            <button
              type="button"
              onClick={() => setShowEditor(true)}
              className="hover:text-[#065F46] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t.navEdit}
            </button>
            <button
              type="button"
              onClick={() => setShowFinal(true)}
              className="hover:text-[#065F46] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t.navFinal}
            </button>
            <button
              type="button"
              onClick={() => setShowRules(true)}
              className="hover:text-[#065F46] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t.navRules}
            </button>
          </nav>

          {/* Zone 3: 1 Primary CTA */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={handleNewGameRequest}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-sm font-bold shadow-2xs transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.newGame}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Workspace Control Strip */}
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 flex flex-wrap items-center justify-between gap-3">
        {/* Clean Unboxed Metadata + Mobile Quick Links */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <span className="font-semibold text-emerald-950">
            {t.progressLabel}:{' '}
            <strong className="font-mono tabular-nums text-emerald-700">
              {answeredCount}/{totalCells}
            </strong>
          </span>

          <div className="flex md:hidden items-center gap-3 text-xs font-semibold text-emerald-800">
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <button
              type="button"
              onClick={() => setShowEditor(true)}
              className="hover:underline"
            >
              {t.navEdit}
            </button>
            <button
              type="button"
              onClick={() => setShowFinal(true)}
              className="hover:underline"
            >
              {t.navFinal}
            </button>
            <button
              type="button"
              onClick={() => setShowRules(true)}
              className="hover:underline"
            >
              {t.navRules}
            </button>
          </div>
        </div>

        {/* Game Controls: Question Direction, Sound, Timer, Penalty Toggle, Language Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <div
            role="group"
            aria-label="Question direction"
            className="h-10 flex items-center gap-0.5 p-1 bg-white border border-[#CFE2D7] rounded-xl"
          >
            <button
              type="button"
              onClick={() =>
                setSettings((prev) => ({ ...prev, questionDirection: 'ru-uz' }))
              }
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                settings.questionDirection === 'ru-uz'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 hover:text-emerald-950'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>{t.directionRuToUz}</span>
            </button>
            <button
              type="button"
              onClick={() =>
                setSettings((prev) => ({ ...prev, questionDirection: 'uz-ru' }))
              }
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                settings.questionDirection === 'uz-ru'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 hover:text-emerald-950'
              }`}
            >
              <span>{t.directionUzToRu}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() =>
              setSettings((prev) => ({
                ...prev,
                soundEnabled: !prev.soundEnabled,
              }))
            }
            className="h-10 inline-flex items-center gap-1.5 rounded-xl border border-[#CFE2D7] bg-white px-3.5 text-xs font-semibold text-emerald-950 hover:bg-emerald-50 transition-colors whitespace-nowrap"
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-700" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
            <span>{settings.soundEnabled ? t.soundOn : t.soundOff}</span>
          </button>

          <button
            type="button"
            onClick={cycleTimer}
            className="h-10 inline-flex items-center gap-1.5 rounded-xl border border-[#CFE2D7] bg-white px-3.5 text-xs font-semibold text-emerald-950 hover:bg-emerald-50 transition-colors whitespace-nowrap"
          >
            <Clock className="w-4 h-4 text-emerald-700" />
            <span className="tabular-nums">
              {settings.timerSeconds === 0
                ? t.timerOff
                : `${settings.timerSeconds} ${t.timerLabel}`}
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              setSettings((prev) => ({
                ...prev,
                deductOnWrong: !prev.deductOnWrong,
              }))
            }
            className={`h-10 inline-flex items-center gap-1.5 rounded-xl border px-3.5 text-xs font-semibold transition-colors whitespace-nowrap ${
              settings.deductOnWrong
                ? 'border-amber-300 bg-amber-50 text-amber-900'
                : 'border-[#CFE2D7] bg-white text-slate-700 hover:bg-emerald-50'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>
              {settings.deductOnWrong ? t.deductWrongOn : t.deductWrongOff}
            </span>
          </button>

          <div
            role="group"
            aria-label="Language"
            className="h-10 flex items-center gap-0.5 p-1 bg-white border border-[#CFE2D7] rounded-xl"
          >
            {(['uz', 'ru', 'en'] as Language[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() =>
                  setSettings((prev) => ({ ...prev, language: lang }))
                }
                className={`px-2.5 py-1.5 text-xs font-bold rounded-lg uppercase transition-colors ${
                  settings.language === lang
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 hover:text-emerald-950'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main 2-Zone Classroom Stage */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col lg:flex-row items-stretch gap-6">
        <TeamSidebar
          teams={teams}
          activeTeamId={activeTeamId}
          onSelectTeam={setActiveTeamId}
          onRenameTeam={handleRenameTeam}
          onAdjustScore={handleAdjustScore}
          onAddTeam={handleAddTeam}
          onRemoveLastTeam={handleRemoveLastTeam}
          t={t}
        />

        <QuizBoard
          board={board}
          teams={teams}
          onSelectCell={handleSelectCell}
          t={t}
        />
      </main>

      {/* Modals */}
      {activeCell && (
        <QuestionModal
          cell={activeCell}
          categoryName={
            board.categories[activeCell.categoryIndex] ||
            `Category ${activeCell.categoryIndex + 1}`
          }
          teams={teams}
          activeTeamId={activeTeamId}
          settings={settings}
          onToggleDirection={toggleQuestionDirection}
          onAwardTeam={handleAwardTeam}
          onCloseWithoutAnswer={handleCloseWithoutAnswer}
          onReopenCell={handleReopenCell}
          onDismiss={() => setActiveCellId(null)}
          t={t}
        />
      )}

      {showEditor && (
        <BoardEditorModal
          board={board}
          onSaveBoard={(updated) => {
            setBoard(updated);
            setShowEditor(false);
          }}
          onClose={() => setShowEditor(false)}
          t={t}
        />
      )}

      {showFinal && (
        <FinalRoundModal
          finalQuestion={board.finalQuestion}
          teams={teams}
          soundEnabled={settings.soundEnabled}
          questionDirection={settings.questionDirection}
          onApplyFinalScores={handleApplyFinalScores}
          onClose={() => setShowFinal(false)}
          t={t}
        />
      )}

      {showVictory && (
        <VictoryModal
          teams={teams}
          onPlayAgain={executeResetGame}
          onClose={() => setShowVictory(false)}
          t={t}
        />
      )}

      {showRules && (
        <RulesModal onClose={() => setShowRules(false)} t={t} />
      )}

      {/* Confirmation Dialog for Resetting Active Game */}
      {confirmResetOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          onClick={() => setConfirmResetOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white border border-emerald-200 shadow-2xl p-6 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display font-bold text-lg text-emerald-950">
              {t.newGame}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t.confirmNewGame}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmResetOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={executeResetGame}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm font-bold transition-colors"
              >
                {t.confirmResetYes}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
