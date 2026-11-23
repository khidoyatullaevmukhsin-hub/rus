import { QuizBoardData, QuizCell, Team } from '../types/quiz';

export const POINT_VALUES = [100, 200, 300, 400, 500] as const;

export const DEFAULT_RAW_TSV = `Rus-tili
Category1\tCategory2\tCategory3\tCategory4\tCategory5\tCategory6\tFinal
100Q\tЧто это?\tКто это?\tУ тебя есть телефон?\tУ тебя есть ручка?\tЧто у тебя в сумке?\tЭто твоя книга?\t
100A\tBu nima?\tBu kim?\tTelefon bormi?\tRuchka bormi?\tSumkada nima bor?\tBu kitobing mi?\t
200Q\tЭто твоя тетрадь?\tУ тебя есть кошка?\t200\tЧто это такое?\tКто твой друг?\tЭто твой стол?\t
200A\tBu daftaring mi?\tMushuging bormi?\tbonus\tBu nima o'zi?\tDo'sting kim?\tBu stoling mi?\t
300Q\tЭто твой стул?\tУ тебя есть сумка?\tЭто твой телефон?\tКто твоя мама?\tКто твой папа?\tЧто это за книга?\t
300A\tBu stuling mi?\tSumkang bormi?\tBu telefoning mi?\tOnang kim?\tOtang kim?\tBu qanaqa kitob?\t
400Q\tЭто твой дом?\tУ тебя есть брат?\tЭто твои часы?\tЭто твоё зеркало?\tЭто твоя кровать?\t400\t
400A\tBu uying mi?\tAkang/uking bormi?\tBu soatlaring mi?\tBu ko'zguing mi?\tBu kravating mi?\tBonus\t
500Q\tУ тебя есть часы?\tЧьё это пальто?\tУ тебя есть велосипед?\tКакой у тебя дом?\t500\tУ тебя есть собака?\t
500A\tSoating bormi?\tBu kimning palьtosi?\tVelosiping bormi?\tSening uying qanday?\tBonus\tIting bormi?`;

export const DEFAULT_TEAMS: Team[] = [
  { id: 'team-1', name: '1-jamoa', score: 0, color: 'emerald' },
  { id: 'team-2', name: '2-jamoa', score: 0, color: 'amber' },
  { id: 'team-3', name: '3-jamoa', score: 0, color: 'rose' },
];

export const TEAM_COLOR_ORDER: Team['color'][] = [
  'emerald',
  'amber',
  'rose',
  'sky',
  'violet',
  'teal',
];

function detectIsBonus(question: string, answer: string): boolean {
  const qNorm = question.trim().toLowerCase();
  const aNorm = answer.trim().toLowerCase();
  if (aNorm === 'bonus' || qNorm === 'bonus') return true;
  if (/^\d{3,4}$/.test(qNorm) && aNorm.includes('bonus')) return true;
  return false;
}

export function createDefaultBoard(): QuizBoardData {
  return parseTsvToBoard(DEFAULT_RAW_TSV);
}

/**
 * Parses Flippity-style TSV (or simple 6-column Q/A paste) into a structured QuizBoardData.
 */
export function parseTsvToBoard(raw: string): QuizBoardData {
  const lines = raw
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.split('\t'));

  // Remove trailing completely empty lines
  while (lines.length > 0 && lines[lines.length - 1].every((c) => !c.trim())) {
    lines.pop();
  }

  let title = 'Rus-tili';
  let cursor = 0;

  // Detect optional single-cell title row at top (like "Rus-tili")
  if (lines.length >= 12) {
    const firstNonEmpty = lines[0].filter((c) => c.trim().length > 0);
    if (firstNonEmpty.length === 1) {
      title = firstNonEmpty[0].trim();
      cursor = 1;
    }
  }

  // Category header row
  const headerRow = lines[cursor] || [];
  // Check if first cell is blank or "Category1"
  const hasRowLabelColumn =
    (lines[cursor + 1]?.[0]?.trim().match(/^\d+Q$/i) !== null) ||
    headerRow[0]?.trim() === '';

  const colOffset = hasRowLabelColumn && headerRow[0]?.trim() === '' ? 1 : 0;

  // In user's paste: Category1\tCategory2\t...\tCategory6\tFinal (no leading blank cell on header row!)
  // Whereas 100Q\tЧто это?... HAS a leading label column!
  const categoryCandidates: string[] = [];
  for (let i = colOffset; i < colOffset + 6; i++) {
    const val = headerRow[i]?.trim();
    categoryCandidates.push(val || `Category ${i - colOffset + 1}`);
  }
  cursor += 1;

  const cells: QuizCell[] = [];
  for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
    const points = POINT_VALUES[rowIndex];
    const qRow = lines[cursor + rowIndex * 2] || [];
    const aRow = lines[cursor + rowIndex * 2 + 1] || [];

    // Determine if qRow has leading "100Q" label
    const qHasPrefix = /^\d+Q$/i.test((qRow[0] || '').trim());
    const aHasPrefix = /^\d+A$/i.test((aRow[0] || '').trim());
    const qStart = qHasPrefix ? 1 : 0;
    const aStart = aHasPrefix ? 1 : 0;

    for (let catIndex = 0; catIndex < 6; catIndex++) {
      const q = (qRow[qStart + catIndex] || '').trim();
      const a = (aRow[aStart + catIndex] || '').trim();
      const isBonus = detectIsBonus(q, a);

      cells.push({
        id: `cell-${catIndex}-${rowIndex}`,
        categoryIndex: catIndex,
        rowIndex,
        points,
        question: q || `${points}`,
        answer: a || (isBonus ? 'Bonus' : '—'),
        isBonus,
        isAnswered: false,
        answeredByTeamId: null,
      });
    }
  }

  // Optional final question in column 7 of 100Q/100A or after rows
  const finalQ = (lines[cursor]?.[7] || '').trim();
  const finalA = (lines[cursor + 1]?.[7] || '').trim();

  return {
    title,
    categories: categoryCandidates,
    cells,
    finalQuestion: {
      question: finalQ || 'Какой у тебя любимый предмет в школе?',
      answer: finalA || 'Maktabda eng yoqtirgan faning qaysi?',
      enabled: Boolean(finalQ && finalA),
    },
  };
}

export function boardToTsv(board: QuizBoardData): string {
  const lines: string[] = [];
  lines.push(board.title || 'Rus-tili');
  lines.push([...board.categories, 'Final'].join('\t'));

  for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
    const points = POINT_VALUES[rowIndex];
    const qCells: string[] = [`${points}Q`];
    const aCells: string[] = [`${points}A`];
    for (let catIndex = 0; catIndex < 6; catIndex++) {
      const cell = board.cells.find(
        (c) => c.categoryIndex === catIndex && c.rowIndex === rowIndex
      );
      if (cell?.isBonus) {
        qCells.push(String(points));
        aCells.push('Bonus');
      } else {
        qCells.push(cell?.question || '');
        aCells.push(cell?.answer || '');
      }
    }
    qCells.push(rowIndex === 0 && board.finalQuestion.enabled ? board.finalQuestion.question : '');
    aCells.push(rowIndex === 0 && board.finalQuestion.enabled ? board.finalQuestion.answer : '');
    lines.push(qCells.join('\t'));
    lines.push(aCells.join('\t'));
  }

  return lines.join('\n');
}
