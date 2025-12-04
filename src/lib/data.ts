export interface BookData {
  id: string;
  title: string;
  author: string;
  price: number;
  rentalPrice: number;
  rating: number;
  reviewCount: number;
  category: string;
  description: string;
  image?: string;
  pages: number;
  language: string;
  published: string;
  tags: string[];
}

export const booksData: Record<string, BookData> = {
  '1': {
    id: '1',
    title: 'Immortal Knowledge',
    author: 'Dr. Kibet Kitur',
    price: 1200,
    rentalPrice: 150,
    rating: 4.9,
    reviewCount: 89,
    category: 'Non-Fiction',
    description: `Immortal Knowledge is a message to the African Grassroots. It blows the trumpet. It plays the African drum loud enough for all to hear. It calls on the Africans to end the dirge.

The African Grassroots need to understand what and where they have been and what they are. Most importantly, they must understand what they still must be and where they still must go. They must build a new peaceful and harmonious African unity. They must write a new treaty canonized for economic freedom for themselves in this planet.

They must hold brotherly and sisterly hands in the night in a vigil for the dark hour upon which the red pearly gates are going to open to usher in a revolution time with a whirlwind bringing forth their ancestors back to their distinguished rightful throne.

The African grassroots are rioting and rotting. They are a sitting tranquil dynamite. They need to know themselves; right away. Immortal Knowledge shines the light to things known and unknown to the African. It provides a succinct historical and scientific based message to the grassroots to revolutionize their thinking and ways of living.

Immortal Knowledge calls on them to heed the calling and step forward. They must pick up the challenge of the essential practice of selfishness for survival. They must start a mental revolution to change their African world.`,
    image: '/books/immortalknowledge.jpg',
    pages: 280,
    language: 'English',
    published: '2024',
    tags: ['African History', 'Philosophy', 'Revolution', 'Unity'],
  },
  '2': {
    id: '2',
    title: 'Kalenjin Folklore Tales',
    author: 'John Kamau',
    price: 500,
    rentalPrice: 60,
    rating: 4.5,
    reviewCount: 156,
    category: 'Folklore',
    description: `A captivating collection of traditional Kalenjin stories passed down through generations. These tales feature the wisdom of elders, the cunning of animals, and the beauty of the Rift Valley landscape.

Each story carries deep cultural significance and moral lessons that have shaped the Kalenjin community for centuries.`,
    image: '/books/folklore-tales.png',
    pages: 180,
    language: 'Kalenjin',
    published: '2022',
    tags: ['Folklore', 'Traditional', 'Stories', 'Culture'],
  },
  '3': {
    id: '3',
    title: 'Traditional Wisdom',
    author: 'Jane Kiplagat',
    price: 750,
    rentalPrice: 90,
    rating: 4.8,
    reviewCount: 203,
    category: 'Non-Fiction',
    description: `An exploration of the philosophical and practical wisdom embedded in Kalenjin traditions. From agricultural practices to social customs, this book reveals the deep knowledge systems of the community.`,
    image: '/books/traditional-wisdom.png',
    pages: 220,
    language: 'Bilingual',
    published: '2023',
    tags: ['Wisdom', 'Traditions', 'Philosophy', 'Culture'],
  },
  '4': {
    id: '4',
    title: 'Cultural Heritage',
    author: 'Mike Korir',
    price: 600,
    rentalPrice: 70,
    rating: 4.3,
    reviewCount: 98,
    category: 'History',
    description: `A comprehensive look at the rich cultural heritage of the Kalenjin people, documenting ceremonies, rituals, and the evolution of traditions over time.`,
    image: '/books/cultural-heritage.png',
    pages: 250,
    language: 'English',
    published: '2021',
    tags: ['Heritage', 'History', 'Ceremonies', 'Rituals'],
  },
  '5': {
    id: '5',
    title: 'Children Stories',
    author: 'Sarah Chebet',
    price: 400,
    rentalPrice: 50,
    rating: 4.7,
    reviewCount: 128,
    category: 'Children',
    description: `Immerse your child in the magical world of African storytelling with this delightful collection of fables and adventures. "Children Stories" brings together age-old wisdom and modern narratives, featuring beloved characters like the clever hare, the mighty lion, and the wise tortoise.

Each story is crafted to entertain while imparting valuable life lessons about friendship, courage, and honesty. Perfect for bedtime reading or classroom sessions, this book is beautifully illustrated to capture young imaginations.`,
    image: '/books/children-stories.png',
    pages: 120,
    language: 'English & Kalenjin',
    published: '2023',
    tags: ['Folklore', 'Animals', 'Education', 'Bilingual'],
  },
};

export const getBookById = (id: string): BookData | undefined => {
  return booksData[id];
};

export const getAllBooks = (): BookData[] => {
  return Object.values(booksData);
};
