import { GameItem, Category } from '../types';
import musicDB from '../Database/MusicDB.json';

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
function formatGenres(genres: string[]): string {
  if (!genres || !Array.isArray(genres)) return 'Unknown';
  return genres.join(', ');
}

// Function to extract video ID from YouTube URL
function getYoutubeVideoId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
}

function getDetailsForCategory(data: any): any[] {
  const allDetails = [
    { label: 'التصنيف', value: formatGenres(data.genre), revealed: false },
    { label: 'الألبوم', value: data.album || 'Unknown', revealed: false },
    { label: 'سنة الإصدار', value: data.release_year?.toString() || 'Unknown', revealed: false },
    { label: 'كلمات مميزة', value: data.main_lyric || 'Unknown', revealed: false }
  ];

  return allDetails;
}

export async function fetchRandomMusic(category: Category): Promise<GameItem> {
  try {
    const randomMusic = musicDB[Math.floor(Math.random() * musicDB.length)];
    if (!randomMusic) {
      throw new Error('No music data available');
    }
    
    const details = getDetailsForCategory(randomMusic);
    const videoId = getYoutubeVideoId(randomMusic.youtube_url);

    return {
      id: randomMusic.id.toString(),
      category,
      name: randomMusic.title,
      details,
      mediaUrl: `https://www.youtube.com/embed/${videoId}?start=30&end=35&autoplay=1`,
      isAudioOnly: true
    };
  } catch (error) {
    console.error('Error fetching music data:', error);
    
    const fallbackMusic = musicDB[0];
    const details = getDetailsForCategory(fallbackMusic);
    const videoId = getYoutubeVideoId(fallbackMusic.youtube_url);
    
    return {
      id: fallbackMusic.id.toString(),
      category,
      name: fallbackMusic.title,
      details,
      mediaUrl: `https://www.youtube.com/embed/${videoId}?start=30&end=35&autoplay=1`,
      isAudioOnly: true
    };
  }
}
