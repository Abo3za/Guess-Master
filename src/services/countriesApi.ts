import { GameItem, Category, Difficulty } from '../types';

interface Country {
  id: number;
  country_name: string;
  region: string;
  continent: string;
  official_language: string;
  currency: string;
  famous_for: string;
  area: number;
  capital_population?: number;
  capital_founded?: string;
  capital_landmarks?: string[];
  capital_climate?: string;
  landmark_location?: string;
  landmark_built?: string;
  landmark_type?: string;
  unesco_status?: string;
  annual_visitors?: string;
}

// Define the countries data
const countries: Country[] = [
  {
    id: 1,
    country_name: "United States",
    region: "North America",
    continent: "America",
    official_language: "English",
    currency: "USD",
    famous_for: "Hollywood, Space exploration",
    area: 9833517
  },
  {
    id: 2,
    country_name: "Germany",
    region: "Europe",
    continent: "Europe",
    official_language: "German",
    currency: "EUR",
    famous_for: "Oktoberfest, Beer culture",
    area: 357022
  },
  {
    id: 3,
    country_name: "Japan",
    region: "Asia",
    continent: "Asia",
    official_language: "Japanese",
    currency: "JPY",
    famous_for: "Technology, Cherry Blossoms",
    area: 377975
  },
  {
    id: 4,
    country_name: "Brazil",
    region: "South America",
    continent: "America",
    official_language: "Portuguese",
    currency: "BRL",
    famous_for: "Carnival, Amazon Rainforest",
    area: 8515767
  },
  {
    id: 5,
    country_name: "India",
    region: "Asia",
    continent: "Asia",
    official_language: "Hindi, English",
    currency: "INR",
    famous_for: "Taj Mahal, Bollywood",
    area: 3287263
  },
  {
    id: 6,
    country_name: "France",
    region: "Europe",
    continent: "Europe",
    official_language: "French",
    currency: "EUR",
    famous_for: "Eiffel Tower, Wine",
    area: 643801
  },
  {
    id: 7,
    country_name: "Australia",
    region: "Oceania",
    continent: "Australia",
    official_language: "English",
    currency: "AUD",
    famous_for: "Great Barrier Reef, Kangaroos",
    area: 7692024
  },
  {
    id: 8,
    country_name: "South Africa",
    region: "Africa",
    continent: "Africa",
    official_language: "11 official languages including Afrikaans, English",
    currency: "ZAR",
    famous_for: "Wildlife, Nelson Mandela",
    area: 1219090
  },
  {
    id: 9,
    country_name: "Canada",
    region: "North America",
    continent: "America",
    official_language: "English, French",
    currency: "CAD",
    famous_for: "Maple Syrup, Niagara Falls",
    area: 9984670
  },
  {
    id: 10,
    country_name: "Mexico",
    region: "North America",
    continent: "America",
    official_language: "Spanish",
    currency: "MXN",
    famous_for: "Mayan Ruins, Mexican Food",
    area: 1964375
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

// Helper function to format area
function formatArea(area: number): string {
  if (area < 1000) {
    return `${area} km²`;
  } else if (area < 1000000) {
    return `${(area / 1000).toFixed(1)} thousand km²`;
  } else {
    return `${(area / 1000000).toFixed(2)} million km²`;
  }
}

function getDetailsForCategory(data: Country, category: Category, difficulty: Difficulty = 'normal'): any[] {
  let details: any[] = [];
  
  switch (category) {
    case 'countries-general':
      details = [
        { label: 'Continent', value: data.continent, revealed: false },
        { label: 'Region', value: data.region, revealed: false },
        { label: 'Official Language', value: data.official_language, revealed: false },
        { label: 'Currency', value: data.currency, revealed: false },
        { label: 'Area', value: formatArea(data.area), revealed: false },
        { label: 'Famous For', value: data.famous_for, revealed: false }
      ];
      break;

    case 'countries-capitals':
      details = [
        { label: 'Continent', value: data.continent, revealed: false },
        { label: 'Population', value: data.capital_population?.toString() || 'Unknown', revealed: false },
        { label: 'Founded', value: data.capital_founded || 'Unknown', revealed: false },
        { label: 'Notable Landmarks', value: data.capital_landmarks?.join(', ') || 'Unknown', revealed: false },
        { label: 'Climate', value: data.capital_climate || 'Unknown', revealed: false }
      ];
      break;

    case 'countries-landmarks':
      details = [
        { label: 'Location', value: data.landmark_location || 'Unknown', revealed: false },
        { label: 'Built', value: data.landmark_built || 'Unknown', revealed: false },
        { label: 'Type', value: data.landmark_type || 'Unknown', revealed: false },
        { label: 'UNESCO Status', value: data.unesco_status || 'Unknown', revealed: false },
        { label: 'Visitors/Year', value: data.annual_visitors || 'Unknown', revealed: false }
      ];
      break;

    default:
      details = [
        { label: 'Continent', value: data.continent, revealed: false },
        { label: 'Official Language', value: data.official_language, revealed: false },
        { label: 'Currency', value: data.currency, revealed: false },
        { label: 'Famous For', value: data.famous_for, revealed: false }
      ];
  }

  if (difficulty === 'hard') {
    return shuffleArray(details).slice(0, 3);
  }
  return details;
}

export async function fetchRandomCountry(category: Category): Promise<GameItem> {
  try {
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    if (!randomCountry) {
      throw new Error('No country data available');
    }
    
    const details = getDetailsForCategory(randomCountry, category);
    return {
      id: randomCountry.id.toString(),
      category,
      name: randomCountry.country_name,
      details
    };
  } catch (error) {
    console.error('Error fetching country data:', error);
    return getFallbackCountryData(category);
  }
}

function getFallbackCountryData(category: Category): GameItem {
  const fallbackCountry = countries[0];
  const details = getDetailsForCategory(fallbackCountry, category);
  
  return {
    id: fallbackCountry.id.toString(),
    category,
    name: fallbackCountry.country_name,
    details
  };
}