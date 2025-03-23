import axios from 'axios';
import { GameItem, Category } from '../types';

const BASE_URL = 'https://api.jikan.moe/v4';

// Helper function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Helper function to format genres
function formatGenres(genres: any[] | undefined): string {
  if (!genres || !Array.isArray(genres)) return 'Unknown';
  return genres.map(genre => typeof genre === 'string' ? genre : genre.name).join(', ');
}

const animeCharactersFallback = [
  {
    id: 'char-1',
    name: 'Monkey D. Luffy',
    anime: 'One Piece',
    gender: 'Male',
    role: 'Protagonist',
    voiceActor: 'Mayumi Tanaka',
    age: '19',
    personality: 'Cheerful, Determined',
    abilities: 'Gomu Gomu no Mi (Rubber powers)',
    affiliation: 'Straw Hat Pirates',
    bounty: '3,000,000,000 Berries',
    birthplace: 'East Blue',
    occupation: 'Pirate Captain',
    goal: 'Become the Pirate King'
  },
  {
    id: 'char-2',
    name: 'Naruto Uzumaki',
    anime: 'Naruto',
    gender: 'Male',
    role: 'Protagonist',
    voiceActor: 'Junko Takeuchi',
    age: '17',
    personality: 'Energetic, Persistent',
    abilities: 'Rasengan, Shadow Clone Jutsu',
    affiliation: 'Hidden Leaf Village',
    rank: 'Seventh Hokage',
    birthplace: 'Hidden Leaf Village',
    occupation: 'Ninja',
    goal: 'Become Hokage'
  },
  {
    id: 'char-3',
    name: 'Mikasa Ackerman',
    anime: 'Attack on Titan',
    gender: 'Female',
    role: 'Main Character',
    voiceActor: 'Yui Ishikawa',
    age: '19',
    personality: 'Strong, Protective',
    abilities: 'Expert in 3D Maneuver Gear',
    affiliation: 'Survey Corps',
    rank: 'Captain',
    birthplace: 'Shiganshina District',
    occupation: 'Soldier',
    specialSkills: 'Combat Expert, Ackerman Power'
  }
];

const animeSeriesFallback = [
  {
    id: 'series-1',
    name: 'Death Note',
    year: '2006',
    studio: 'Madhouse',
    episodes: '37',
    status: 'Finished Airing',
    rating: 'R - 17+',
    genres: ['Psychological', 'Thriller', 'Supernatural'],
    director: 'Tetsurō Araki',
    source: 'Manga',
    duration: '23 min per episode',
    popularity: 'Top-rated anime',
    themes: 'Justice, Morality, Crime',
    mainCharacters: 'Light Yagami, L Lawliet'
  },
  {
    id: 'series-2',
    name: 'Attack on Titan',
    year: '2013',
    studio: 'Wit Studio',
    episodes: '75+',
    status: 'Finished Airing',
    rating: 'R - 17+',
    genres: ['Action', 'Drama', 'Fantasy'],
    director: 'Tetsurō Araki',
    source: 'Manga',
    duration: '24 min per episode',
    popularity: 'Global phenomenon',
    themes: 'Freedom, Survival, War',
    mainCharacters: 'Eren Yeager, Mikasa Ackerman'
  }
];

const animeMoviesFallback = [
  {
    id: 'movie-1',
    name: 'Your Name',
    year: '2016',
    director: 'Makoto Shinkai',
    runtime: '106 minutes',
    studio: 'CoMix Wave Films',
    genres: ['Romance', 'Fantasy', 'Drama'],
    boxOffice: '$358 million',
    awards: 'Japan Academy Prize',
    music: 'RADWIMPS',
    animation: 'Traditional 2D',
    themes: 'Body swap, Time travel',
    setting: 'Tokyo and Rural Japan'
  },
  {
    id: 'movie-2',
    name: 'Spirited Away',
    year: '2001',
    director: 'Hayao Miyazaki',
    runtime: '125 minutes',
    studio: 'Studio Ghibli',
    genres: ['Adventure', 'Fantasy'],
    boxOffice: '$395 million',
    awards: 'Academy Award for Best Animated Feature',
    music: 'Joe Hisaishi',
    animation: 'Hand-drawn',
    themes: 'Coming of age, Japanese folklore',
    setting: 'Spirit World'
  }
];

function getDetailsForCategory(data: any, category: Category): any[] {
  switch (category) {
    case 'anime-series':
      return [
        { label: 'Release Year', value: data.year || data.aired?.year || 'Unknown', revealed: false },
        { label: 'Studio', value: data.studio || (data.studios && data.studios.length > 0 ? data.studios[0].name : 'Unknown'), revealed: false },
        { label: 'Episodes', value: data.episodes?.toString() || 'Unknown', revealed: false },
        { label: 'Status', value: data.status || 'Unknown', revealed: false },
        { label: 'Rating', value: data.rating || 'Unknown', revealed: false },
        { label: 'Genres', value: formatGenres(data.genres), revealed: false },
        { label: 'Director', value: data.director || 'Unknown', revealed: false },
        { label: 'Source Material', value: data.source || 'Unknown', revealed: false },
        { label: 'Episode Duration', value: data.duration || 'Unknown', revealed: false },
        { label: 'Main Characters', value: data.mainCharacters || 'Unknown', revealed: false },
        { label: 'Themes', value: data.themes || 'Unknown', revealed: false }
      ];

    case 'anime-characters':
      return [
        { label: 'Anime Series', value: data.anime || 'Unknown', revealed: false },
        { label: 'Gender', value: data.gender || 'Unknown', revealed: false },
        { label: 'Role', value: data.role || 'Unknown', revealed: false },
        { label: 'Voice Actor', value: data.voiceActor || 'Unknown', revealed: false },
        { label: 'Age', value: data.age?.toString() || 'Unknown', revealed: false },
        { label: 'Personality', value: data.personality || 'Unknown', revealed: false },
        { label: 'Abilities', value: data.abilities || 'Unknown', revealed: false },
        { label: 'Affiliation', value: data.affiliation || 'Unknown', revealed: false },
        { label: 'Occupation', value: data.occupation || 'Unknown', revealed: false },
        { label: 'Goal', value: data.goal || 'Unknown', revealed: false },
        { label: 'Birthplace', value: data.birthplace || 'Unknown', revealed: false }
      ];

    case 'anime-movies':
      return [
        { label: 'Release Year', value: data.year || data.aired?.year || 'Unknown', revealed: false },
        { label: 'Director', value: data.director || 'Unknown', revealed: false },
        { label: 'Runtime', value: data.runtime || data.duration || 'Unknown', revealed: false },
        { label: 'Studio', value: data.studio || (data.studios && data.studios.length > 0 ? data.studios[0].name : 'Unknown'), revealed: false },
        { label: 'Genres', value: formatGenres(data.genres), revealed: false },
        { label: 'Box Office', value: data.boxOffice || 'Unknown', revealed: false },
        { label: 'Awards', value: data.awards || 'Unknown', revealed: false },
        { label: 'Music', value: data.music || 'Unknown', revealed: false },
        { label: 'Animation Style', value: data.animation || 'Unknown', revealed: false },
        { label: 'Themes', value: data.themes || 'Unknown', revealed: false },
        { label: 'Setting', value: data.setting || 'Unknown', revealed: false }
      ];

    default:
      return [
        { label: 'Release Year', value: data.year || data.aired?.year || 'Unknown', revealed: false },
        { label: 'Studio', value: data.studio || (data.studios && data.studios.length > 0 ? data.studios[0].name : 'Unknown'), revealed: false },
        { label: 'Genres', value: formatGenres(data.genres), revealed: false },
        { label: 'Rating', value: data.rating || 'Unknown', revealed: false },
        { label: 'Status', value: data.status || 'Unknown', revealed: false },
        { label: 'Director', value: data.director || 'Unknown', revealed: false },
        { label: 'Themes', value: data.themes || 'Unknown', revealed: false }
      ];
  }
}

export async function fetchRandomAnime(category: Category = 'anime-series'): Promise<GameItem> {
  try {
    // For characters, use fallback data since the API doesn't provide good character data
    if (category === 'anime-characters') {
      const randomChar = animeCharactersFallback[Math.floor(Math.random() * animeCharactersFallback.length)];
      const details = getDetailsForCategory(randomChar, category);
      return {
        id: randomChar.id,
        category: category,
        name: randomChar.name,
        details: shuffleArray(details).slice(0, 7) // Show 5-7 details
      };
    }

    // For movies, use fallback data
    if (category === 'anime-movies') {
      const randomMovie = animeMoviesFallback[Math.floor(Math.random() * animeMoviesFallback.length)];
      const details = getDetailsForCategory(randomMovie, category);
      return {
        id: randomMovie.id,
        category: category,
        name: randomMovie.name,
        details: shuffleArray(details).slice(0, 7) // Show 5-7 details
      };
    }

    // For series, try API first, fallback if needed
    const response = await axios.get(`${BASE_URL}/top/anime`, {
      params: {
        page: Math.floor(Math.random() * 5) + 1,
        limit: 25,
        type: category === 'anime-movies' ? 'movie' : 'tv',
        order_by: 'popularity',
        sort: 'desc'
      }
    });

    if (!response.data.data.length) {
      throw new Error('No anime data available');
    }

    const randomAnime = response.data.data[Math.floor(Math.random() * response.data.data.length)];
    const details = getDetailsForCategory(randomAnime, category);

    return {
      id: randomAnime.mal_id.toString(),
      category: category,
      name: randomAnime.title,
      details: shuffleArray(details).slice(0, 7) // Show 5-7 details
    };

  } catch (error) {
    console.error('Error fetching anime data:', error);
    
    // Use appropriate fallback based on category
    const fallbackData = category === 'anime-characters' 
      ? animeCharactersFallback[0]
      : category === 'anime-movies'
      ? animeMoviesFallback[0]
      : animeSeriesFallback[0];

    const details = getDetailsForCategory(fallbackData, category);
    
    return {
      id: fallbackData.id,
      category: category,
      name: fallbackData.name,
      details: shuffleArray(details).slice(0, 7) // Show 5-7 details
    };
  }
}