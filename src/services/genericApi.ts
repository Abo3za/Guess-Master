import { GameItem, Category } from '../types';

interface Detail {
  label: string;
  value: string;
  revealed: boolean;
}

interface DatabaseItem {
  id: number | string;
  name: string;
  details?: Detail[];
  [key: string]: string | number | boolean | Detail[] | undefined;
}

interface Database {
  items: DatabaseItem[];
}

// Arabic labels mapping for all categories
const labelMapping: Record<string, string> = {
  // Cars
  manufacturer: 'الشركة المصنعة',
  year: 'سنة الإنتاج',
  engineType: 'نوع المحرك',
  horsepower: 'القوة الحصانية',
  type: 'النوع',
  origin: 'بلد المنشأ',
  class: 'الفئة',
  
  // Global Brands
  country: 'البلد',
  foundedYear: 'سنة التأسيس',
  industry: 'المجال',
  products: 'المنتجات',
  
  // TV Shows & Series
  director: 'المخرج',
  startYear: 'سنة البداية',
  endYear: 'سنة النهاية',
  genre: 'النوع',
  network: 'القناة',
  seasons: 'عدد المواسم',
  
  // Spacetoon
  title: 'العنوان',
  mainCharacter: 'الشخصية الرئيسية',
  studio: 'ستوديو الإنتاج',
  episodes: 'عدد الحلقات',
  channel: 'القناة',
  releaseYear: 'سنة العرض',
  
  // Arabic Series
  mainActor: 'البطل الرئيسي',
  writer: 'الكاتب',
  productionYear: 'سنة الإنتاج',
  productionCountry: 'بلد الإنتاج',
  numberOfEpisodes: 'عدد الحلقات',
  
  // Prophets
  era: 'العصر',
  role: 'الدور',
  related_event: 'الحدث المرتبط',
  mentioned_in: 'مذكور في',
  famous_for: 'مشهور بـ',
  
  // Quran
  surahNumber: 'رقم السورة',
  verses: 'عدد الآيات',
  revelation: 'مكان النزول',
  meaning: 'المعنى',
  
  // Common fields
  highlight: 'معلومة مميزة',
  description: 'الوصف',
  category: 'التصنيف',
  location: 'الموقع',
  
  // Add more category-specific mappings as needed
  
};

export const createGenericApi = (data: Database) => {
  const getItems = () => {
    return data.items;
  };

  const getRandomItem = async (category: Category): Promise<GameItem> => {
    try {
      const items = data.items;
      if (!items || items.length === 0) {
        throw new Error('No data available');
      }

      const randomItem = items[Math.floor(Math.random() * items.length)];
      
      let details: Detail[];

      // If the item has pre-formatted details, use them
      if (Array.isArray(randomItem.details)) {
        details = randomItem.details;
      } else {
        // Otherwise, create details from object properties
        details = Object.entries(randomItem)
          .filter(([key]) => !['id', 'name', 'category', 'details'].includes(key))
          .map(([key, value]) => {
            // Format the value based on its type
            let formattedValue = 'غير معروف';
            if (value !== null && value !== undefined) {
              if (typeof value === 'object') {
                formattedValue = Array.isArray(value) ? value.join(', ') : Object.values(value).join(', ');
              } else {
                formattedValue = value.toString();
              }
            }

            return {
              label: labelMapping[key] || key,
              value: formattedValue,
              revealed: false
            };
          });
      }

      return {
        id: randomItem.id.toString(),
        category,
        name: randomItem.name,
        details: details.map(detail => ({
          ...detail,
          revealed: false // Ensure revealed is set to false initially
        }))
      };
    } catch (error) {
      console.error('Error fetching item:', error);
      throw new Error('Failed to fetch item');
    }
  };

  return {
    getItems,
    getRandomItem
  };
}; 