import { Language } from '../types/quiz';

export interface Translations {
  brandTitle: string;
  navBoard: string;
  navEdit: string;
  navFinal: string;
  navRules: string;
  newGame: string;
  confirmNewGame: string;
  confirmResetYes: string;
  cancel: string;
  teamsTitle: string;
  addTeam: string;
  removeTeam: string;
  activeTurn: string;
  renameHint: string;
  progressLabel: string;
  soundOn: string;
  soundOff: string;
  timerOff: string;
  timerLabel: string;
  deductWrongOn: string;
  deductWrongOff: string;
  pointsUnit: string;
  answeredLabel: string;
  bonusBadge: string;
  bonusHeading: string;
  bonusDescription: string;
  claimBonusFor: string;
  revealAnswer: string;
  questionLabel: string;
  answerLabel: string;
  questionLabelUz: string;
  answerLabelRu: string;
  directionRuToUz: string;
  directionUzToRu: string;
  correctBtn: string;
  wrongBtn: string;
  nobodyAnswered: string;
  undoTile: string;
  closeModal: string;
  finalRoundTitle: string;
  finalRoundSubtitle: string;
  wagerStep: string;
  questionStep: string;
  revealFinalQ: string;
  revealFinalA: string;
  maxWager: string;
  finishGame: string;
  victoryTitle: string;
  victorySubtitle: string;
  winnerBadge: string;
  playAgain: string;
  editorTitle: string;
  editorSubtitle: string;
  tabGrid: string;
  tabImport: string;
  boardNameLabel: string;
  categoriesLabel: string;
  isBonusLabel: string;
  finalQuestionEnable: string;
  pasteTsvHelp: string;
  applyTsv: string;
  copyTsv: string;
  copied: string;
  resetDefaultBoard: string;
  saveChanges: string;
  rulesTitle: string;
  rulesItems: { title: string; desc: string }[];
  shortcutsTitle: string;
  shortcuts: { key: string; desc: string }[];
  timeUp: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  uz: {
    brandTitle: 'Rus-tili Viktorina',
    navBoard: 'Taxta',
    navEdit: 'Tahrirlash',
    navFinal: 'Yakuniy bosqich',
    navRules: 'Qoidalar',
    newGame: 'Yangi o‘yin',
    confirmNewGame: 'Barcha ballar va ochilgan kataklar nolga tushirilsinmi?',
    confirmResetYes: 'Ha, yangilash',
    cancel: 'Bekor qilish',
    teamsTitle: 'Jamoalar',
    addTeam: 'Jamoa qo‘shish',
    removeTeam: 'Oxirgi jamoani o‘chirish',
    activeTurn: 'Navbat',
    renameHint: 'Nomini o‘zgartirish uchun bosing',
    progressLabel: 'Ochilgan savollar',
    soundOn: 'Ovoz yoniq',
    soundOff: 'Ovoz o‘chiq',
    timerOff: 'Taymer: o‘chiq',
    timerLabel: 'soniya',
    deductWrongOn: 'Xato javobda ball ayiriladi',
    deductWrongOff: 'Xato javobda ball ayirilmaydi',
    pointsUnit: 'ball',
    answeredLabel: 'O‘ynaldi',
    bonusBadge: 'Bonus katak',
    bonusHeading: 'Omadli Bonus!',
    bonusDescription: 'Ushbu katakda savol yo‘q — tanlangan jamoa to‘g‘ridan-to‘g‘ri bonus ballarini qo‘lga kiritadi.',
    claimBonusFor: 'Bonus ballini berish',
    revealAnswer: 'Javobni ko‘rish',
    questionLabel: 'Savol (Rus tilida)',
    answerLabel: 'Javob (O‘zbek tilida)',
    questionLabelUz: 'Savol (O‘zbek tilida)',
    answerLabelRu: 'Javob (Rus tilida)',
    directionRuToUz: 'Savol: Rus → O‘zb',
    directionUzToRu: 'Savol: O‘zb → Rus',
    correctBtn: 'To‘g‘ri',
    wrongBtn: 'Xato',
    nobodyAnswered: 'Hech kim topmadi (yopish)',
    undoTile: 'Katakni qayta ochish',
    closeModal: 'Yopish',
    finalRoundTitle: 'Yakuniy bosqich',
    finalRoundSubtitle: 'Har bir jamoa o‘z ballari hisobidan tikish (garov) qo‘yadi.',
    wagerStep: '1-qadam: Garov miqdorini kiriting',
    questionStep: '2-qadam: Yakuniy savol',
    revealFinalQ: 'Savolni ochish',
    revealFinalA: 'Javobni ko‘rish',
    maxWager: 'Maksimal',
    finishGame: 'Natijalarni ko‘rish',
    victoryTitle: 'O‘yin yakunlandi!',
    victorySubtitle: 'Barcha savollar yakunlandi. Jamoalarning yakuniy natijalari:',
    winnerBadge: 'G‘olib',
    playAgain: 'Qayta o‘ynash',
    editorTitle: 'Viktorinani tahrirlash',
    editorSubtitle: 'Savollarni qo‘lda o‘zgartiring yoki Excel / Google Sheets jadvalidan nusxalab joylashtiring.',
    tabGrid: 'Kataklar bo‘yicha',
    tabImport: 'Jadvaldan yuklash (TSV)',
    boardNameLabel: 'Viktorina nomi',
    categoriesLabel: 'Bo‘limlar (6 ta ustun)',
    isBonusLabel: 'Bonus katak',
    finalQuestionEnable: 'Yakuniy savolni yoqish',
    pasteTsvHelp: 'Flippity, Excel yoki Google Sheets jadvalingizdagi matnni quyiga joylashtiring (Tab bilan ajratilgan format):',
    applyTsv: 'Jadvalni yuklash',
    copyTsv: 'Nusxa olish',
    copied: 'Nusxa olindi',
    resetDefaultBoard: 'Asl «Rus-tili» holatiga qaytarish',
    saveChanges: 'Saqlash',
    rulesTitle: 'O‘yin qoidalari',
    rulesItems: [
      {
        title: '1. Navbat va katak tanlash',
        desc: 'Chap tarafdan navbati kelgan jamoani belgilang va taxtadan 100 dan 500 gacha bo‘lgan katakni tanlang.',
      },
      {
        title: '2. Savol va javob',
        desc: 'Rus tilidagi savol ekranga chiqadi. O‘quvchi o‘zbekcha tarjima yoki javobni aytgach, «Javobni ko‘rish» tugmasini bosing.',
      },
      {
        title: '3. Baholash va Bonus',
        desc: 'To‘g‘ri javob uchun jamoaga katak ballari qo‘shiladi. Bonus katak tushsa, jamoa savolsiz bonus ball oladi.',
      },
      {
        title: '4. Moslashuvchan sozlash',
        desc: '«Tahrirlash» bo‘limida yangi bo‘lim nomlari, ruscha-o‘zbekcha savollar yozishingiz yoki jadvaldan nusxalab yuklashingiz mumkin.',
      },
    ],
    shortcutsTitle: 'Klaviatura tugmalari',
    shortcuts: [
      { key: 'Space', desc: 'Javobni ko‘rish' },
      { key: 'Esc', desc: 'Oynani yopish' },
    ],
    timeUp: 'Vaqt tugadi!',
  },
  ru: {
    brandTitle: 'Русский язык — Викторина',
    navBoard: 'Доска',
    navEdit: 'Редактор',
    navFinal: 'Финал',
    navRules: 'Правила',
    newGame: 'Новая игра',
    confirmNewGame: 'Сбросить все очки команд и открыть все ячейки заново?',
    confirmResetYes: 'Да, сбросить',
    cancel: 'Отмена',
    teamsTitle: 'Команды',
    addTeam: 'Добавить команду',
    removeTeam: 'Удалить последнюю',
    activeTurn: 'Ход',
    renameHint: 'Нажмите, чтобы переименовать',
    progressLabel: 'Открыто вопросов',
    soundOn: 'Звук вкл.',
    soundOff: 'Звук выкл.',
    timerOff: 'Таймер: выкл.',
    timerLabel: 'сек',
    deductWrongOn: 'Штраф за ошибку вкл.',
    deductWrongOff: 'Штраф за ошибку выкл.',
    pointsUnit: 'баллов',
    answeredLabel: 'Сыграно',
    bonusBadge: 'Бонус',
    bonusHeading: 'Счастливый бонус!',
    bonusDescription: 'В этой ячейке нет вопроса — выбранная команда сразу получает бонусные баллы.',
    claimBonusFor: 'Начислить бонус команде',
    revealAnswer: 'Показать ответ',
    questionLabel: 'Вопрос (на русском)',
    answerLabel: 'Ответ (на узбекском)',
    questionLabelUz: 'Вопрос (на узбекском)',
    answerLabelRu: 'Ответ (на русском)',
    directionRuToUz: 'Вопрос: Рус → Узб',
    directionUzToRu: 'Вопрос: Узб → Рус',
    correctBtn: 'Верно',
    wrongBtn: 'Ошибка',
    nobodyAnswered: 'Никто не ответил (закрыть)',
    undoTile: 'Вернуть ячейку в игру',
    closeModal: 'Закрыть',
    finalRoundTitle: 'Финальный раунд',
    finalRoundSubtitle: 'Каждая команда делает ставку из своих заработанных баллов.',
    wagerStep: 'Шаг 1: Введите ставки',
    questionStep: 'Шаг 2: Финальный вопрос',
    revealFinalQ: 'Открыть вопрос',
    revealFinalA: 'Показать ответ',
    maxWager: 'Макс.',
    finishGame: 'Итоги игры',
    victoryTitle: 'Игра завершена!',
    victorySubtitle: 'Все вопросы сыграны. Итоговая таблица команд:',
    winnerBadge: 'Победитель',
    playAgain: 'Играть снова',
    editorTitle: 'Редактор викторины',
    editorSubtitle: 'Редактируйте ячейки вручную или вставьте таблицу из Excel / Google Sheets.',
    tabGrid: 'По ячейкам',
    tabImport: 'Импорт из таблицы (TSV)',
    boardNameLabel: 'Название викторины',
    categoriesLabel: 'Категории (6 столбцов)',
    isBonusLabel: 'Бонусная ячейка',
    finalQuestionEnable: 'Включить финальный вопрос',
    pasteTsvHelp: 'Вставьте данные из Flippity, Excel или Google Таблиц (разделитель — Tab):',
    applyTsv: 'Загрузить таблицу',
    copyTsv: 'Копировать',
    copied: 'Скопировано',
    resetDefaultBoard: 'Сбросить к исходной «Rus-tili»',
    saveChanges: 'Сохранить',
    rulesTitle: 'Правила игры',
    rulesItems: [
      {
        title: '1. Ход команды',
        desc: 'Выберите активную команду слева и откройте любую ячейку от 100 до 500 баллов.',
      },
      {
        title: '2. Вопрос и перевод',
        desc: 'На экране появляется вопрос на русском языке. После ответа ученика нажмите «Показать ответ».',
      },
      {
        title: '3. Очки и бонусы',
        desc: 'За верный ответ команда получает очки ячейки. Бонусная ячейка начисляет баллы сразу.',
      },
      {
        title: '4. Редактирование',
        desc: 'В разделе «Редактор» можно менять названия категорий, вопросы и импортировать новые таблицы.',
      },
    ],
    shortcutsTitle: 'Горячие клавиши',
    shortcuts: [
      { key: 'Space', desc: 'Показать ответ' },
      { key: 'Esc', desc: 'Закрыть окно' },
    ],
    timeUp: 'Время вышло!',
  },
  en: {
    brandTitle: 'Rus-tili Quiz Show',
    navBoard: 'Board',
    navEdit: 'Editor',
    navFinal: 'Final Round',
    navRules: 'Rules',
    newGame: 'New Game',
    confirmNewGame: 'Reset all team scores and reopen every board tile?',
    confirmResetYes: 'Yes, Reset',
    cancel: 'Cancel',
    teamsTitle: 'Teams',
    addTeam: 'Add team',
    removeTeam: 'Remove last team',
    activeTurn: 'Turn',
    renameHint: 'Click to rename',
    progressLabel: 'Completed',
    soundOn: 'Sound On',
    soundOff: 'Sound Off',
    timerOff: 'Timer: Off',
    timerLabel: 'sec',
    deductWrongOn: 'Deduct on wrong: On',
    deductWrongOff: 'Deduct on wrong: Off',
    pointsUnit: 'pts',
    answeredLabel: 'Played',
    bonusBadge: 'Bonus Tile',
    bonusHeading: 'Lucky Bonus!',
    bonusDescription: 'No question here — award the bonus points directly to the chosen team.',
    claimBonusFor: 'Award bonus to',
    revealAnswer: 'Reveal Answer',
    questionLabel: 'Question (Russian)',
    answerLabel: 'Answer (Uzbek)',
    questionLabelUz: 'Question (Uzbek)',
    answerLabelRu: 'Answer (Russian)',
    directionRuToUz: 'Prompt: RU → UZ',
    directionUzToRu: 'Prompt: UZ → RU',
    correctBtn: 'Correct',
    wrongBtn: 'Wrong',
    nobodyAnswered: 'No correct answer (close)',
    undoTile: 'Reopen this tile',
    closeModal: 'Close',
    finalRoundTitle: 'Final Round',
    finalRoundSubtitle: 'Each team places a wager from their current score.',
    wagerStep: 'Step 1: Enter wagers',
    questionStep: 'Step 2: Final question',
    revealFinalQ: 'Reveal Question',
    revealFinalA: 'Reveal Answer',
    maxWager: 'Max',
    finishGame: 'View Standings',
    victoryTitle: 'Game Complete!',
    victorySubtitle: 'All questions have been played. Final team standings:',
    winnerBadge: 'Winner',
    playAgain: 'Play Again',
    editorTitle: 'Quiz Board Editor',
    editorSubtitle: 'Edit tiles directly or paste a spreadsheet from Excel / Google Sheets.',
    tabGrid: 'Grid Editor',
    tabImport: 'Spreadsheet Paste (TSV)',
    boardNameLabel: 'Quiz Title',
    categoriesLabel: 'Categories (6 columns)',
    isBonusLabel: 'Bonus tile',
    finalQuestionEnable: 'Enable Final Round question',
    pasteTsvHelp: 'Paste your Flippity, Excel, or Google Sheets tab-separated data below:',
    applyTsv: 'Load Spreadsheet',
    copyTsv: 'Copy TSV',
    copied: 'Copied',
    resetDefaultBoard: 'Restore default "Rus-tili" board',
    saveChanges: 'Save Changes',
    rulesTitle: 'How to Play',
    rulesItems: [
      {
        title: '1. Select a Team & Tile',
        desc: 'Pick the active team on the left rail, then choose any point tile from 100 to 500.',
      },
      {
        title: '2. Read & Translate',
        desc: 'The Russian prompt appears in large type. Press Reveal Answer once the student responds.',
      },
      {
        title: '3. Score & Bonus Tiles',
        desc: 'Award points for correct answers or deduct for misses. Bonus tiles grant instant points.',
      },
      {
        title: '4. Customize Anytime',
        desc: 'Open the Editor to rename categories, modify questions, or paste a new spreadsheet.',
      },
    ],
    shortcutsTitle: 'Keyboard Shortcuts',
    shortcuts: [
      { key: 'Space', desc: 'Reveal answer' },
      { key: 'Esc', desc: 'Close modal' },
    ],
    timeUp: 'Time is up!',
  },
};
