import axios from 'axios';
import { GameItem } from '../types';

const API_KEY = '1eadeb1d';
const BASE_URL = 'https://www.omdbapi.com';

// Popular TV shows to search from
const popularTVShows = [
  {
    title: 'Breaking Bad',
    creator: 'Vince Gilligan',
    network: 'AMC',
    runtime: '49 min',
    totalSeasons: '5',
    years: '2008-2013',
    mainCast: 'Bryan Cranston, Aaron Paul',
    themes: 'Crime, Morality, Family',
    awards: '16 Primetime Emmy Awards',
    rating: 'TV-MA',
    genre: 'Crime, Drama, Thriller',
    setting: 'Albuquerque, New Mexico',
    significantEpisodes: 'Ozymandias, Felina'
  },
  {
    title: 'Game of Thrones',
    creator: 'David Benioff, D.B. Weiss',
    network: 'HBO',
    runtime: '57 min',
    totalSeasons: '8',
    years: '2011-2019',
    mainCast: 'Emilia Clarke, Kit Harington',
    themes: 'Power, Politics, Fantasy',
    awards: '59 Primetime Emmy Awards',
    rating: 'TV-MA',
    genre: 'Action, Adventure, Drama',
    setting: 'Westeros and Essos',
    significantEpisodes: 'Battle of the Bastards, The Rains of Castamere'
  },
  {
    title: 'Stranger Things',
    creator: 'The Duffer Brothers',
    network: 'Netflix',
    runtime: '51 min',
    totalSeasons: '4',
    years: '2016-present',
    mainCast: 'Millie Bobby Brown, Finn Wolfhard',
    themes: 'Supernatural, Friendship, 80s Nostalgia',
    awards: '7 Emmy Awards',
    rating: 'TV-14',
    genre: 'Drama, Fantasy, Horror',
    setting: 'Hawkins, Indiana',
    significantEpisodes: 'Chapter One: The Vanishing of Will Byers, Dear Billy'
  }
];

// TV Characters fallback data
const tvCharactersFallback = [
  {
    name: 'Walter White',
    series: 'Breaking Bad',
    actor: 'Bryan Cranston',
    occupation: 'Chemistry Teacher/Meth Manufacturer',
    nickname: 'Heisenberg',
    relationships: 'Skyler White (Wife), Jesse Pinkman (Former Student)',
    significance: 'Main Protagonist',
    character_arc: 'From mild-mannered teacher to drug kingpin',
    memorable_quotes: "I am the one who knocks!",
    first_appearance: 'Season 1, Episode 1',
    last_appearance: 'Series Finale',
    character_development: 'Pride and greed lead to moral decay'
  },
  {
    name: 'Daenerys Targaryen',
    series: 'Game of Thrones',
    actor: 'Emilia Clarke',
    occupation: 'Queen/Khaleesi',
    nickname: 'Mother of Dragons',
    relationships: 'Dragons (Children), Jon Snow (Lover/Nephew)',
    significance: 'Major Protagonist',
    character_arc: 'From exiled princess to powerful queen',
    memorable_quotes: "I will take what is mine with fire and blood",
    first_appearance: 'Season 1, Episode 1',
    last_appearance: 'Series Finale',
    character_development: 'Journey from liberator to destroyer'
  }
];

// TV Actors fallback data
const tvActorsFallback = [
  {
    name: 'Bryan Cranston',
    knownFor: 'Breaking Bad, Malcolm in the Middle',
    birthYear: '1956',
    nationality: 'American',
    awards: '4 Emmy Awards for Breaking Bad',
    notableRole: 'Walter White in Breaking Bad',
    activeYears: '1980-present',
    education: 'Los Angeles Valley College',
    actingStyle: 'Method acting, Dramatic range',
    genreSpecialty: 'Drama, Comedy',
    otherWorks: 'Theater, Voice acting',
    breakthrough: 'Malcolm in the Middle',
    influences: 'Jack Lemmon, Dick Van Dyke'
  },
  {
    name: 'Peter Dinklage',
    knownFor: 'Game of Thrones',
    birthYear: '1969',
    nationality: 'American',
    awards: '4 Emmy Awards, 1 Golden Globe',
    notableRole: 'Tyrion Lannister in Game of Thrones',
    activeYears: '1995-present',
    education: 'Bennington College',
    actingStyle: 'Nuanced character portrayal',
    genreSpecialty: 'Drama, Fantasy',
    otherWorks: 'Theater, Film',
    breakthrough: 'The Station Agent',
    influences: 'Richard Dreyfuss'
  }
];

// Popular movie titles to search from
const popularMovies = [
  {
    title: 'The Shawshank Redemption',
    director: 'Frank Darabont',
    year: '1994',
    runtime: '142 min',
    cast: 'Tim Robbins, Morgan Freeman',
    boxOffice: '$58.8 million',
    awards: '7 Academy Award nominations',
    genre: 'Drama',
    rating: 'R',
    themes: 'Hope, Friendship, Justice',
    adaptation: 'Based on Stephen King novella',
    cinematographer: 'Roger Deakins',
    composer: 'Thomas Newman',
    productionCompany: 'Castle Rock Entertainment'
  },
  {
    title: 'Inception',
    director: 'Christopher Nolan',
    year: '2010',
    runtime: '148 min',
    cast: 'Leonardo DiCaprio, Joseph Gordon-Levitt',
    boxOffice: '$836.8 million',
    awards: '4 Academy Awards',
    genre: 'Action, Sci-Fi, Thriller',
    rating: 'PG-13',
    themes: 'Dreams, Reality, Memory',
    visualEffects: 'Double Negative, New Deal Studios',
    cinematographer: 'Wally Pfister',
    composer: 'Hans Zimmer',
    productionCompany: 'Warner Bros. Pictures'
  },
  {
    title: 'The Dark Knight',
    director: 'Christopher Nolan',
    year: '2008',
    runtime: '152 min',
    cast: 'Christian Bale, Heath Ledger',
    boxOffice: '$1.005 billion',
    awards: '2 Academy Awards',
    genre: 'Action, Crime, Drama',
    rating: 'PG-13',
    themes: 'Justice, Chaos, Morality',
    visualEffects: 'Double Negative',
    cinematographer: 'Wally Pfister',
    composer: 'Hans Zimmer',
    productionCompany: 'Warner Bros. Pictures'
  }
];

// Helper function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function getDetailsForCategory(data: any, category: Category): any[] {
  switch (category) {
    case 'movie-titles':
      return [
        { label: 'Release Year', value: data.Year || data.year || 'Unknown', revealed: false },
        { label: 'Director', value: data.Director || data.director || 'Unknown', revealed: false },
        { label: 'Genre', value: data.Genre || data.genre || 'Unknown', revealed: false },
        { label: 'Runtime', value: data.Runtime || data.runtime || 'Unknown', revealed: false },
        { label: 'Rating', value: data.Rated || data.rating || 'Unknown', revealed: false },
        { label: 'Cast', value: data.Actors || data.cast || 'Unknown', revealed: false },
        { label: 'Box Office', value: data.BoxOffice || data.boxOffice || 'Unknown', revealed: false },
        { label: 'Awards', value: data.Awards || data.awards || 'Unknown', revealed: false },
        { label: 'Themes', value: data.themes || 'Unknown', revealed: false },
        { label: 'Cinematographer', value: data.cinematographer || 'Unknown', revealed: false },
        { label: 'Composer', value: data.composer || 'Unknown', revealed: false },
        { label: 'Production Company', value: data.productionCompany || 'Unknown', revealed: false }
      ];

    case 'tv-series':
      return [
        { label: 'Years', value: data.Years || data.years || 'Unknown', revealed: false },
        { label: 'Creator', value: data.Creator || data.creator || 'Unknown', revealed: false },
        { label: 'Network', value: data.network || 'Unknown', revealed: false },
        { label: 'Genre', value: data.Genre || data.genre || 'Unknown', revealed: false },
        { label: 'Runtime', value: data.Runtime || data.runtime || 'Unknown', revealed: false },
        { label: 'Total Seasons', value: data.totalSeasons || 'Unknown', revealed: false },
        { label: 'Main Cast', value: data.Actors || data.mainCast || 'Unknown', revealed: false },
        { label: 'Rating', value: data.Rated || data.rating || 'Unknown', revealed: false },
        { label: 'Awards', value: data.Awards || data.awards || 'Unknown', revealed: false },
        { label: 'Themes', value: data.themes || 'Unknown', revealed: false },
        { label: 'Setting', value: data.setting || 'Unknown', revealed: false },
        { label: 'Notable Episodes', value: data.significantEpisodes || 'Unknown', revealed: false }
      ];

    case 'tv-characters':
      return [
        { label: 'TV Series', value: data.series || 'Unknown', revealed: false },
        { label: 'Played By', value: data.actor || 'Unknown', revealed: false },
        { label: 'Occupation', value: data.occupation || 'Unknown', revealed: false },
        { label: 'Nickname', value: data.nickname || 'Unknown', revealed: false },
        { label: 'Relationships', value: data.relationships || 'Unknown', revealed: false },
        { label: 'Role', value: data.significance || 'Unknown', revealed: false },
        { label: 'Character Arc', value: data.character_arc || 'Unknown', revealed: false },
        { label: 'Memorable Quote', value: data.memorable_quotes || 'Unknown', revealed: false },
        { label: 'First Appearance', value: data.first_appearance || 'Unknown', revealed: false },
        { label: 'Character Development', value: data.character_development || 'Unknown', revealed: false }
      ];

    case 'tv-actors':
      return [
        { label: 'Known For', value: data.knownFor || 'Unknown', revealed: false },
        { label: 'Birth Year', value: data.birthYear || 'Unknown', revealed: false },
        { label: 'Nationality', value: data.nationality || 'Unknown', revealed: false },
        { label: 'Awards', value: data.awards || 'Unknown', revealed: false },
        { label: 'Notable Role', value: data.notableRole || 'Unknown', revealed: false },
        { label: 'Active Years', value: data.activeYears || 'Unknown', revealed: false },
        { label: 'Education', value: data.education || 'Unknown', revealed: false },
        { label: 'Acting Style', value: data.actingStyle || 'Unknown', revealed: false },
        { label: 'Genre Specialty', value: data.genreSpecialty || 'Unknown', revealed: false },
        { label: 'Other Works', value: data.otherWorks || 'Unknown', revealed: false },
        { label: 'Breakthrough Role', value: data.breakthrough || 'Unknown', revealed: false },
        { label: 'Influences', value: data.influences || 'Unknown', revealed: false }
      ];

    case 'movie-directors':
      return [
        { label: 'Notable Films', value: data.notableFilms || 'Unknown', revealed: false },
        { label: 'Style', value: data.style || 'Unknown', revealed: false },
        { label: 'Awards', value: data.Awards || 'Unknown', revealed: false },
        { label: 'Active Years', value: data.activeYears || 'Unknown', revealed: false },
        { label: 'Nationality', value: data.nationality || 'Unknown', revealed: false },
        { label: 'Genre Focus', value: data.genreFocus || 'Unknown', revealed: false },
        { label: 'Education', value: data.education || 'Unknown', revealed: false },
        { label: 'Influences', value: data.influences || 'Unknown', revealed: false },
        { label: 'Collaborators', value: data.collaborators || 'Unknown', revealed: false }
      ];

    default:
      return [
        { label: 'Release Year', value: data.Year || data.year || 'Unknown', revealed: false },
        { label: 'Director/Creator', value: data.Director || data.creator || 'Unknown', revealed: false },
        { label: 'Genre', value: data.Genre || data.genre || 'Unknown', revealed: false },
        { label: 'Rating', value: data.Rated || data.rating || 'Unknown', revealed: false },
        { label: 'Cast', value: data.Actors || data.cast || 'Unknown', revealed: false },
        { label: 'Awards', value: data.Awards || data.awards || 'Unknown', revealed: false },
        { label: 'Themes', value: data.themes || 'Unknown', revealed: false }
      ];
  }
}

async function fetchOMDBItem(title: string, type: 'movie' | 'series', category: Category): Promise<GameItem> {
  try {
    // For TV characters and actors, use fallback data
    if (category === 'tv-characters') {
      const randomChar = tvCharactersFallback[Math.floor(Math.random() * tvCharactersFallback.length)];
      const details = getDetailsForCategory(randomChar, category);
      return {
        id: `char-${Math.random()}`,
        category: category,
        name: randomChar.name,
        details: shuffleArray(details).slice(0, 7)
      };
    }

    if (category === 'tv-actors') {
      const randomActor = tvActorsFallback[Math.floor(Math.random() * tvActorsFallback.length)];
      const details = getDetailsForCategory(randomActor, category);
      return {
        id: `actor-${Math.random()}`,
        category: category,
        name: randomActor.name,
        details: shuffleArray(details).slice(0, 7)
      };
    }

    const response = await axios.get(BASE_URL, {
      params: {
        apikey: API_KEY,
        t: title,
        type,
        plot: 'full',
        r: 'json'
      }
    });

    const item = response.data;

    if (item.Response === 'False') {
      throw new Error(item.Error || 'Failed to fetch data');
    }

    const details = getDetailsForCategory(item, category);
    const numberOfDetails = Math.floor(Math.random() * 3) + 5; // 5-7 details
    const shuffledDetails = shuffleArray(details);
    const finalDetails = shuffledDetails.slice(0, numberOfDetails);

    return {
      id: item.imdbID,
      category: category,
      name: item.Title,
      details: finalDetails
    };
  } catch (error) {
    console.error(`Error fetching ${type} data:`, error);
    
    // Use appropriate fallback data based on category
    let fallbackData;
    if (category === 'tv-characters') {
      fallbackData = tvCharactersFallback[0];
    } else if (category === 'tv-actors') {
      fallbackData = tvActorsFallback[0];
    } else {
      fallbackData = type === 'series' 
        ? popularTVShows[Math.floor(Math.random() * popularTVShows.length)]
        : popularMovies[Math.floor(Math.random() * popularMovies.length)];
    }

    const details = getDetailsForCategory(fallbackData, category);
    const shuffledDetails = shuffleArray(details);
    const numberOfDetails = Math.floor(Math.random() * 3) + 5; // 5-7 details
    
    return {
      id: `${type}-fallback-${Math.random()}`,
      category: category,
      name: fallbackData.title || fallbackData.name,
      details: shuffledDetails.slice(0, numberOfDetails)
    };
  }
}

export async function fetchRandomMovie(category: Category = 'movie-titles'): Promise<GameItem> {
  const randomTitle = popularMovies[Math.floor(Math.random() * popularMovies.length)].title;
  return fetchOMDBItem(randomTitle, 'movie', category);
}

export async function fetchRandomTVShow(category: Category = 'tv-series'): Promise<GameItem> {
  const randomTitle = popularTVShows[Math.floor(Math.random() * popularTVShows.length)].title;
  return fetchOMDBItem(randomTitle, 'series', category);
}