export enum Category {
  anime = 'anime',
  tv = 'tv',
  movies = 'movies',
  games = 'games',
  football = 'football',
  wwe = 'wwe',
  music = 'music',
  sports = 'sports',
  tech = 'tech',
  history = 'history',
  geography = 'geography',
  science = 'science',
  religion = 'religion',
  whoami = 'whoami',
  memories = 'memories',
  playerJourney = 'playerJourney',
  prophets = 'prophets',
  spacetoon = 'spacetoon',
  arabicSeries = 'arabicSeries',
  quran = 'quran',
  cars = 'cars',
  globalBrands = 'globalBrands',
  animals = 'animals'
}

export const CATEGORIES = {
  [Category.anime]: {
    name: "الأنمي",
    icon: "🦁",
    description: "تعرف على الأنمي المختلفة",
    image: "AnimalsCard.webp"
  },
  [Category.tv]: {
    name: "التلفزيون",
    icon: "📺",
    description: "تعرف على البرامج التلفزيونية",
    image: "TvCard.webp"
  },
  [Category.movies]: {
    name: "الأفلام",
    icon: "🎬",
    description: "تعرف على الأفلام المختلفة",
    image: "MoviesCard.webp"
  },
  [Category.games]: {
    name: "الألعاب",
    icon: "🎮",
    description: "تعرف على الألعاب المختلفة",
    image: "GamesCard.webp"
  },
  [Category.football]: {
    name: "كرة القدم",
    icon: "⚽",
    description: "تعرف على أهم المباريات واللاعبين",
    image: "FootballCard.webp"
  },
  [Category.wwe]: {
    name: "وو",
    icon: "🤼",
    description: "تعرف على أهم المباريات واللاعبين",
    image: "WweCard.webp"
  },
  [Category.music]: {
    name: "الموسيقى",
    icon: "🎶",
    description: "تعرف على الموسيقى المختلفة",
    image: "MusicCard.webp"
  },
  [Category.sports]: {
    name: "الرياضة",
    icon: "🏆",
    description: "تعرف على الرياضة المختلفة",
    image: "SportsCard.webp"
  },
  [Category.tech]: {
    name: "التكنولوجيا",
    icon: "��",
    description: "تعرف على التكنولوجيا المختلفة",
    image: "TechCard.webp"
  },
  [Category.history]: {
    name: "التاريخ",
    icon: "📜",
    description: "تعرف على التاريخ المختلف",
    image: "HistoryCard.webp"
  },
  [Category.geography]: {
    name: "الجغرافيا",
    icon: "🌍",
    description: "تعرف على الجغرافيا المختلفة",
    image: "GeographyCard.webp"
  },
  [Category.science]: {
    name: "العلوم",
    icon: "��",
    description: "تعرف على العلوم المختلفة",
    image: "ScienceCard.webp"
  },
  [Category.religion]: {
    name: "الدين",
    icon: "🕌",
    description: "تعرف على الدين المختلف",
    image: "ReligionCard.webp"
  },
  [Category.whoami]: {
    name: "من أنا",
    icon: "��",
    description: "تعرف على من أنت",
    image: "WhoAmICard.webp"
  },
  [Category.memories]: {
    name: "ذكريات",
    icon: "📅",
    description: "تعرف على ذكرياتك",
    image: "MemoriesCard.webp"
  },
  [Category.playerJourney]: {
    name: "رحلة اللاعب",
    icon: "🏆",
    description: "تعرف على رحلة اللاعب المختلفة",
    image: "PlayerJourneyCard.webp"
  },
  [Category.prophets]: {
    name: "الرسولون",
    icon: "🕌",
    description: "تعرف على الرسولون المختلفون",
    image: "ProphetsCard.webp"
  },
  [Category.spacetoon]: {
    name: "السبيتون",
    icon: "🌌",
    description: "تعرف على السبيتون المختلف",
    image: "SpacetoonCard.webp"
  },
  [Category.arabicSeries]: {
    name: "السلسلة العربية",
    icon: "🇸🇦",
    description: "تعرف على السلسلة العربية المختلفة",
    image: "ArabicSeriesCard.webp"
  },
  [Category.quran]: {
    name: "القرآن",
    icon: "📖",
    description: "تعرف على القرآن الكريم",
    image: "QuranCard.webp"
  },
  [Category.cars]: {
    name: "السيارات",
    icon: "��",
    description: "تعرف على السيارات المختلفة",
    image: "CarsCard.webp"
  },
  [Category.globalBrands]: {
    name: "العلامات التجارية العالمية",
    icon: "🌍",
    description: "تعرف على العلامات التجارية العالمية المختلفة",
    image: "GlobalBrandsCard.webp"
  },
  [Category.animals]: {
    name: "الحيوانات",
    icon: "🦁",
    description: "تعرف على الحيوانات المختلفة",
    image: "AnimalsCard.webp"
  }
};

export interface GameItem {
  id: string;
  name: string;
  category: Category;
  details: {
    label: string;
    value: string;
    revealed: boolean;
  }[];
  mediaUrl?: string;
  isAudioOnly?: boolean;
}

export interface Team {
  id: number;
  name: string;
  score: number;
  isActive: boolean;
}

export interface GameState {
  teams: Team[];
  currentItem: GameItem | null;
  selectedCategory: Category | null;
  answerRevealed: boolean;
  isLoading: boolean;
  usedItems: Set<string>;
  categoryUsedItems: Record<Category, Set<string>>;
  gameEnded: boolean;
  categorySelectionCounts: Record<Category, number>;
  isGameActive: boolean;
  winningPoints: number;
  hideHints: boolean;
  selectedCategories: string[];
}

export interface CategoryOption {
  value: Category;
  label: string;
  icon: React.ReactNode;
  bgImage: string;
}