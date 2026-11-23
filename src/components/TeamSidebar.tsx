import React, { useState } from 'react';
import { Check, Minus, Pencil, Plus, UserMinus, UserPlus } from 'lucide-react';
import { Team } from '../types/quiz';
import { Translations } from '../i18n/translations';
import { TEAM_COLOR_STYLES } from '../utils/teamColors';

interface TeamSidebarProps {
  teams: Team[];
  activeTeamId: string;
  onSelectTeam: (teamId: string) => void;
  onRenameTeam: (teamId: string, name: string) => void;
  onAdjustScore: (teamId: string, delta: number) => void;
  onAddTeam: () => void;
  onRemoveLastTeam: () => void;
  t: Translations;
}

export const TeamSidebar: React.FC<TeamSidebarProps> = ({
  teams,
  activeTeamId,
  onSelectTeam,
  onRenameTeam,
  onAdjustScore,
  onAddTeam,
  onRemoveLastTeam,
  t,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');

  const startRename = (team: Team, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(team.id);
    setDraftName(team.name);
  };

  const commitRename = (teamId: string) => {
    const trimmed = draftName.trim();
    if (trimmed) {
      onRenameTeam(teamId, trimmed);
    }
    setEditingId(null);
  };

  return (
    <aside className="w-full lg:w-72 xl:w-80 shrink-0 flex flex-col gap-3.5">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-base font-bold text-emerald-950 tracking-tight">
          {t.teamsTitle}
        </h2>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onRemoveLastTeam}
            disabled={teams.length <= 1}
            title={t.removeTeam}
            aria-label={t.removeTeam}
            className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-emerald-200 bg-white text-emerald-900 hover:bg-emerald-50 disabled:opacity-40 disabled:pointer-events-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
          >
            <UserMinus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onAddTeam}
            disabled={teams.length >= 6}
            title={t.addTeam}
            aria-label={t.addTeam}
            className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-emerald-200 bg-white text-emerald-900 hover:bg-emerald-50 disabled:opacity-40 disabled:pointer-events-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
          >
            <UserPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3.5">
        {teams.map((team) => {
          const style = TEAM_COLOR_STYLES[team.color];
          const isActive = team.id === activeTeamId;
          const isEditing = editingId === team.id;

          return (
            <div
              key={team.id}
              onClick={() => !isEditing && onSelectTeam(team.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (!isEditing && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onSelectTeam(team.id);
                }
              }}
              className={`group relative rounded-2xl border-2 p-5 transition-all duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                isActive
                  ? `${style.activeBorder} ${style.activeBg} shadow-sm`
                  : `${style.border} ${style.bg} hover:border-emerald-400`
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                {isEditing ? (
                  <div
                    className="flex items-center gap-1.5 w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="text"
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') commitRename(team.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      onBlur={() => commitRename(team.id)}
                      autoFocus
                      maxLength={24}
                      className="w-full rounded-lg border border-emerald-400 bg-white px-2.5 py-1.5 text-base font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => commitRename(team.id)}
                      aria-label={t.saveChanges}
                      className="h-8 w-8 shrink-0 inline-flex items-center justify-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`font-bold text-base sm:text-lg truncate ${style.accentText}`}
                        title={team.name}
                      >
                        {team.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {isActive && (
                        <span className="text-xs font-bold text-emerald-700">
                          {t.activeTurn}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => startRename(team, e)}
                        title={t.renameHint}
                        aria-label={t.renameHint}
                        className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-emerald-800 hover:bg-white/80 opacity-75 group-hover:opacity-100 transition-opacity"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-end justify-between gap-2 mt-2.5">
                <div className="font-mono text-4xl xl:text-5xl font-bold tracking-tight tabular-nums text-emerald-950">
                  {team.score}
                </div>
                <div
                  className="flex items-center gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => onAdjustScore(team.id, -100)}
                    aria-label={`${team.name} -100`}
                    title="-100"
                    className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onAdjustScore(team.id, 100)}
                    aria-label={`${team.name} +100`}
                    title="+100"
                    className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
