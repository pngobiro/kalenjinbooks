import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create users and authors for books
  const authors = [
    {
      userId: 'user-kibet-kitur',
      email: 'kibet.kitur@kalenjinbooks.com',
      name: 'Dr. Kibet Kitur',
      bio: 'Author of Immortal Knowledge, passionate about African history and philosophy.',
      profileImage: 'https://ui-avatars.com/api/?name=Kibet+Kitur&size=200&background=E07856&color=fff&bold=true',
    },
    {
      userId: 'user-john-kamau',
      email: 'john.kamau@kalenjinbooks.com',
      name: 'John Kamau',
      bio: 'Collector and preserver of traditional Kalenjin folklore tales.',
      profileImage: 'https://ui-avatars.com/api/?name=John+Kamau&size=200&background=4A90E2&color=fff&bold=true',
    },
    {
      userId: 'user-jane-kiplagat',
      email: 'jane.kiplagat@kalenjinbooks.com',
      name: 'Jane Kiplagat',
      bio: 'Scholar of Kalenjin traditions and cultural practices.',
      profileImage: 'https://ui-avatars.com/api/?name=Jane+Kiplagat&size=200&background=50C878&color=fff&bold=true',
    },
    {
      userId: 'user-mike-korir',
      email: 'mike.korir@kalenjinbooks.com',
      name: 'Mike Korir',
      bio: 'Historian documenting the rich cultural heritage of the Kalenjin people.',
      profileImage: 'https://ui-avatars.com/api/?name=Mike+Korir&size=200&background=9B59B6&color=fff&bold=true',
    },
    {
      userId: 'user-sarah-chebet',
      email: 'sarah.chebet@kalenjinbooks.com',
      name: 'Sarah Chebet',
      bio: 'Children\'s book author and storyteller preserving Kalenjin culture through words.',
      profileImage: 'https://ui-avatars.com/api/?name=Sarah+Chebet&size=200&background=E07856&color=fff&bold=true',
    },
  ];

  // Create users and authors
  const hashedPassword = await bcrypt.hash('password123', 10);

  for (const authorData of authors) {
    const user = await prisma.user.upsert({
      where: { id: authorData.userId },
      update: {},
      create: {
        id: authorData.userId,
        email: authorData.email,
        password: hashedPassword,
        name: authorData.name,
        role: 'AUTHOR',
      },
    });

    await prisma.author.upsert({
      where: { id: `author-${authorData.userId}` },
      update: {},
      create: {
        id: `author-${authorData.userId}`,
        userId: user.id,
        bio: authorData.bio,
        profileImage: authorData.profileImage,
      },
    });

    console.log(`✅ Created author: ${authorData.name}`);
  }

  // Create books
  const books = [
    {
      id: 'book-1',
      title: 'Immortal Knowledge',
      description: `Immortal Knowledge is a message to the African Grassroots. It blows the trumpet. It plays the African drum loud enough for all to hear. It calls on the Africans to end the dirge.

The African Grassroots need to understand what and where they have been and what they are. Most importantly, they must understand what they still must be and where they still must go. They must build a new peaceful and harmonious African unity. They must write a new treaty canonized for economic freedom for themselves in this planet.

They must hold brotherly and sisterly hands in the night in a vigil for the dark hour upon which the red pearly gates are going to open to usher in a revolution time with a whirlwind bringing forth their ancestors back to their distinguished rightful throne.

The African grassroots are rioting and rotting. They are a sitting tranquil dynamite. They need to know themselves; right away. Immortal Knowledge shines the light to things known and unknown to the African. It provides a succinct historical and scientific based message to the grassroots to revolutionize their thinking and ways of living.

Immortal Knowledge calls on them to heed the calling and step forward. They must pick up the challenge of the essential practice of selfishness for survival. They must start a mental revolution to change their African world.`,
      coverImage: '/books/immortalknowledge.jpg',
      fileKey: 'books/book-1/immortal-knowledge.pdf',
      fileSize: 5242880,
      fileType: 'pdf',
      price: 1200,
      previewPages: 20,
      category: 'Non-Fiction',
      language: 'English',
      isPublished: true,
      publishedAt: new Date('2024-01-15'),
      authorId: 'author-user-kibet-kitur',
    },
    {
      id: 'book-2',
      title: 'Kalenjin Folklore Tales',
      description: `A captivating collection of traditional Kalenjin stories passed down through generations. These tales feature the wisdom of elders, the cunning of animals, and the beauty of the Rift Valley landscape.

Each story carries deep cultural significance and moral lessons that have shaped the Kalenjin community for centuries.`,
      coverImage: '/books/folklore-tales.png',
      fileKey: 'books/book-2/folklore-tales.pdf',
      fileSize: 3145728,
      fileType: 'pdf',
      price: 500,
      previewPages: 15,
      category: 'Folklore',
      language: 'Kalenjin',
      isPublished: true,
      publishedAt: new Date('2022-06-20'),
      authorId: 'author-user-john-kamau',
    },
    {
      id: 'book-3',
      title: 'Traditional Wisdom',
      description: `An exploration of the philosophical and practical wisdom embedded in Kalenjin traditions. From agricultural practices to social customs, this book reveals the deep knowledge systems of the community.`,
      coverImage: '/books/traditional-wisdom.png',
      fileKey: 'books/book-3/traditional-wisdom.pdf',
      fileSize: 4194304,
      fileType: 'pdf',
      price: 750,
      previewPages: 18,
      category: 'Non-Fiction',
      language: 'Bilingual',
      isPublished: true,
      publishedAt: new Date('2023-03-10'),
      authorId: 'author-user-jane-kiplagat',
    },
    {
      id: 'book-4',
      title: 'Cultural Heritage',
      description: `A comprehensive look at the rich cultural heritage of the Kalenjin people, documenting ceremonies, rituals, and the evolution of traditions over time.`,
      coverImage: '/books/cultural-heritage.png',
      fileKey: 'books/book-4/cultural-heritage.pdf',
      fileSize: 4718592,
      fileType: 'pdf',
      price: 600,
      previewPages: 12,
      category: 'History',
      language: 'English',
      isPublished: true,
      publishedAt: new Date('2021-09-05'),
      authorId: 'author-user-mike-korir',
    },
    {
      id: 'book-5',
      title: 'Children Stories',
      description: `Immerse your child in the magical world of African storytelling with this delightful collection of fables and adventures. "Children Stories" brings together age-old wisdom and modern narratives, featuring beloved characters like the clever hare, the mighty lion, and the wise tortoise.

Each story is crafted to entertain while imparting valuable life lessons about friendship, courage, and honesty. Perfect for bedtime reading or classroom sessions, this book is beautifully illustrated to capture young imaginations.`,
      coverImage: '/books/children-stories.png',
      fileKey: 'books/book-5/children-stories.pdf',
      fileSize: 2097152,
      fileType: 'pdf',
      price: 400,
      previewPages: 10,
      category: 'Children',
      language: 'English & Kalenjin',
      isPublished: true,
      publishedAt: new Date('2023-11-12'),
      authorId: 'author-user-sarah-chebet',
    },
  ];

  for (const book of books) {
    await prisma.book.upsert({
      where: { id: book.id },
      update: {},
      create: book,
    });
    console.log(`✅ Created book: ${book.title}`);
  }

  // Create blog posts
  const blogPosts = [
    {
      id: 'blog-1',
      title: 'The Rich History of Kalenjin Literature',
      slug: 'rich-history-kalenjin-literature',
      content: `<h2>Introduction to Kalenjin Literary Tradition</h2><p>The Kalenjin people have a rich oral and written literary tradition that spans generations.</p>`,
      excerpt: 'Exploring the evolution of Kalenjin literature from oral traditions to modern written works.',
      coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',
      isPublished: true,
      publishedAt: new Date('2024-11-15'),
      viewCount: 245,
      authorId: 'author-user-sarah-chebet',
    },
    {
      id: 'blog-2',
      title: 'How to Write Compelling Folklore Stories',
      slug: 'how-to-write-compelling-folklore-stories',
      content: `<h2>Mastering the Art of Folklore Writing</h2><p>Writing folklore requires a delicate balance between preserving tradition and engaging modern readers.</p>`,
      excerpt: 'A comprehensive guide for aspiring writers on how to craft authentic and engaging folklore stories.',
      coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop',
      isPublished: true,
      publishedAt: new Date('2024-11-20'),
      viewCount: 189,
      authorId: 'author-user-sarah-chebet',
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { id: post.id },
      update: {},
      create: post,
    });
    console.log(`✅ Created blog post: ${post.title}`);
  }

  console.log('\n✅ Seeding completed successfully!');
  console.log(`📚 Created ${books.length} books`);
  console.log(`✍️  Created ${authors.length} authors`);
  console.log(`📝 Created ${blogPosts.length} blog posts`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
