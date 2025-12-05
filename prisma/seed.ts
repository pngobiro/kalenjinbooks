import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with sample blog posts...');

  // First, create a sample user and author if not exists
  const user = await prisma.user.upsert({
    where: { id: 'sample-user-1' },
    update: {},
    create: {
      id: 'sample-user-1',
      email: 'author@kalenjinbooks.com',
      password: 'hashed_password_here',
      name: 'Sarah Chebet',
      role: 'AUTHOR',
    },
  });

  const author = await prisma.author.upsert({
    where: { id: 'sample-author-1' },
    update: {},
    create: {
      id: 'sample-author-1',
      userId: user.id,
      bio: 'Passionate writer and storyteller preserving Kalenjin culture through words.',
      profileImage: 'https://ui-avatars.com/api/?name=Sarah+Chebet&size=200&background=E07856&color=fff&bold=true',
    },
  });

  // Create blog posts with different content types
  const blogPosts = [
    {
      id: 'blog-1',
      title: 'The Rich History of Kalenjin Literature',
      slug: 'rich-history-kalenjin-literature',
      content: `
        <h2>Introduction to Kalenjin Literary Tradition</h2>
        <p>The Kalenjin people have a rich oral and written literary tradition that spans generations. From ancient folklore passed down through storytelling to modern written works, our literature reflects the values, wisdom, and experiences of our community.</p>
        
        <h3>Oral Traditions</h3>
        <p>Before the written word, our ancestors preserved knowledge through oral narratives. Elders would gather the community around fires to share:</p>
        <ul>
          <li>Folklore and legends</li>
          <li>Historical accounts</li>
          <li>Moral teachings</li>
          <li>Cultural practices</li>
        </ul>
        
        <h3>Modern Literary Movement</h3>
        <p>Today, Kalenjin authors are bridging the gap between traditional storytelling and contemporary literature. We're seeing a renaissance of cultural preservation through books, poetry, and digital media.</p>
        
        <blockquote>
          "Literature is the mirror of society, reflecting our past while illuminating our future." - Kalenjin Proverb
        </blockquote>
        
        <p>As we move forward, it's crucial to support local authors and ensure our stories continue to be told for generations to come.</p>
      `,
      excerpt: 'Exploring the evolution of Kalenjin literature from oral traditions to modern written works, and the importance of preserving our cultural heritage.',
      coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',
      isPublished: true,
      publishedAt: new Date('2024-11-15'),
      viewCount: 245,
      authorId: 'sample-author-1',
    },
    {
      id: 'blog-2',
      title: 'How to Write Compelling Folklore Stories',
      slug: 'how-to-write-compelling-folklore-stories',
      content: `
        <h2>Mastering the Art of Folklore Writing</h2>
        <p>Writing folklore requires a delicate balance between preserving tradition and engaging modern readers. Here's my guide to crafting compelling folklore stories.</p>
        
        <h3>1. Research Your Roots</h3>
        <p>Start by immersing yourself in traditional stories. Talk to elders, read historical accounts, and understand the cultural context behind each tale.</p>
        
        <h3>2. Identify Universal Themes</h3>
        <p>The best folklore stories contain themes that resonate across cultures:</p>
        <ul>
          <li>Good vs. Evil</li>
          <li>Coming of age</li>
          <li>Wisdom and foolishness</li>
          <li>Love and sacrifice</li>
        </ul>
        
        <h3>3. Add Authentic Details</h3>
        <p>Include specific cultural elements that make your story uniquely Kalenjin - traditional names, places, customs, and language phrases.</p>
        
        <h3>4. Structure Your Narrative</h3>
        <p>Follow the classic storytelling arc:</p>
        <ol>
          <li>Introduction - Set the scene</li>
          <li>Rising action - Build tension</li>
          <li>Climax - The turning point</li>
          <li>Resolution - Tie up loose ends</li>
          <li>Moral - The lesson learned</li>
        </ol>
        
        <p>Remember, the goal is not just to entertain but to educate and preserve our cultural heritage for future generations.</p>
      `,
      excerpt: 'A comprehensive guide for aspiring writers on how to craft authentic and engaging folklore stories that preserve cultural heritage.',
      coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop',
      isPublished: true,
      publishedAt: new Date('2024-11-20'),
      viewCount: 189,
      authorId: 'sample-author-1',
    },
    {
      id: 'blog-3',
      title: 'Traditional Kalenjin Music and Storytelling',
      slug: 'traditional-kalenjin-music-storytelling',
      content: `
        <h2>The Power of Music in Kalenjin Storytelling</h2>
        <p>Music and storytelling have always been intertwined in Kalenjin culture. Let me share how traditional songs enhance our narratives.</p>
        
        <h3>Watch: Traditional Kalenjin Performance</h3>
        <p>Here's a beautiful example of traditional Kalenjin music and dance:</p>
        
        <div class="youtube-embed">
          <iframe width="640" height="360" src="https://www.youtube.com/embed/2vjPBrBU-TM" frameborder="0" allowfullscreen></iframe>
        </div>
        
        <h3>The Role of Music</h3>
        <p>In our tradition, music serves multiple purposes:</p>
        <ul>
          <li><strong>Memory Aid:</strong> Rhythms and melodies help people remember stories</li>
          <li><strong>Emotional Connection:</strong> Music evokes feelings that words alone cannot</li>
          <li><strong>Community Building:</strong> Group singing creates shared experiences</li>
          <li><strong>Cultural Identity:</strong> Unique musical styles distinguish our heritage</li>
        </ul>
        
        <h3>Integrating Music into Modern Writing</h3>
        <p>Contemporary authors can incorporate musical elements by:</p>
        <ol>
          <li>Describing traditional songs within narratives</li>
          <li>Using rhythmic language that mimics musical patterns</li>
          <li>Including lyrics as chapter epigraphs</li>
          <li>Creating multimedia experiences with audio components</li>
        </ol>
        
        <blockquote>
          "A story without music is like a bird without wings - it may survive, but it will never soar."
        </blockquote>
      `,
      excerpt: 'Discover how traditional Kalenjin music enhances storytelling and learn ways to incorporate musical elements into modern writing.',
      coverImage: 'https://img.youtube.com/vi/2vjPBrBU-TM/maxresdefault.jpg',
      isPublished: true,
      publishedAt: new Date('2024-11-25'),
      viewCount: 312,
      authorId: 'sample-author-1',
    },
    content: `
        <h2>The Power of Music in Kalenjin Storytelling</h2>
        <p>Music and storytelling have always been intertwined in Kalenjin culture. Let me share how traditional songs enhance our narratives.</p>
        
        <h3>Watch: Traditional Kalenjin Performance</h3>
        <p>Here's a beautiful example of traditional Kalenjin music and dance:</p>
        
        <div class="youtube-embed">
          <iframe width="640" height="360" src="https://www.youtube.com/embed/2vjPBrBU-TM" frameborder="0" allowfullscreen></iframe>
        </div>
        
        <h3>The Role of Music</h3>
        <p>In our tradition, music serves multiple purposes:</p>
        <ul>
          <li><strong>Memory Aid:</strong> Rhythms and melodies help people remember stories</li>
          <li><strong>Emotional Connection:</strong> Music evokes feelings that words alone cannot</li>
          <li><strong>Community Building:</strong> Group singing creates shared experiences</li>
          <li><strong>Cultural Identity:</strong> Unique musical styles distinguish our heritage</li>
        </ul>
        
        <h3>Integrating Music into Modern Writing</h3>
        <p>Contemporary authors can incorporate musical elements by:</p>
        <ol>
          <li>Describing traditional songs within narratives</li>
          <li>Using rhythmic language that mimics musical patterns</li>
          <li>Including lyrics as chapter epigraphs</li>
          <li>Creating multimedia experiences with audio components</li>
        </ol>
        
        <blockquote>
          "A story without music is like a bird without wings - it may survive, but it will never soar."
        </blockquote>
      `,
    excerpt: 'Discover how traditional Kalenjin music enhances storytelling and learn ways to incorporate musical elements into modern writing.',
    coverImage: '/blog/music-storytelling.jpg',
    isPublished: true,
    publishedAt: new Date('2024-11-25'),
    viewCount: 312,
    authorId: 'sample-author-1',
    },
{
  id: 'blog-4',
    title: '5 Essential Books Every Kalenjin Reader Should Own',
      slug: 'essential-kalenjin-books',
        content: `
        <h2>Must-Read Kalenjin Literature</h2>
        <p>Building a personal library of Kalenjin literature? Here are five essential books that every reader should have on their shelf.</p>
        
        <h3>1. "Voices of Our Ancestors" by John Kiplagat</h3>
        <p>This comprehensive collection of traditional folklore brings together stories passed down through generations. Each tale is presented in both Kalenjin and English, making it accessible to all readers.</p>
        <p><strong>Why it's essential:</strong> It serves as a foundational text for understanding our oral traditions.</p>
        
        <h3>2. "The Runner's Spirit" by Mary Chepkemoi</h3>
        <p>A powerful novel exploring the connection between Kalenjin running culture and spiritual beliefs. This book beautifully weaves together sports, tradition, and personal growth.</p>
        <p><strong>Why it's essential:</strong> It captures a unique aspect of Kalenjin identity that resonates globally.</p>
        
        <h3>3. "Wisdom of the Elders" compiled by Samuel Koech</h3>
        <p>A collection of proverbs, sayings, and life lessons from Kalenjin elders. Each entry includes context and modern applications.</p>
        <p><strong>Why it's essential:</strong> Practical wisdom that remains relevant in contemporary life.</p>
        
        <h3>4. "Children of the Highlands" by Grace Jepkosgei</h3>
        <p>A coming-of-age story set in the Kalenjin highlands, exploring themes of identity, education, and cultural change.</p>
        <p><strong>Why it's essential:</strong> It addresses the challenges of balancing tradition with modernity.</p>
        
        <h3>5. "Our Language, Our Pride" by David Kiprotich</h3>
        <p>An in-depth exploration of the Kalenjin language, including grammar, vocabulary, and cultural significance.</p>
        <p><strong>Why it's essential:</strong> Language preservation is crucial for cultural survival.</p>
        
        <hr>
        
        <p>These books form the foundation of a well-rounded Kalenjin library. Each offers unique insights into our culture, history, and values.</p>
        
        <p><a href="/books" target="_blank">Browse our collection</a> to find these titles and many more!</p>
      `,
          excerpt: 'A curated list of five must-read books that form the foundation of Kalenjin literature, from folklore to contemporary fiction.',
            coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop',
              isPublished: true,
                publishedAt: new Date('2024-11-28'),
                  viewCount: 428,
                    authorId: 'sample-author-1',
    },
{
  id: 'blog-5',
    title: 'Preserving Kalenjin Language Through Literature',
      slug: 'preserving-kalenjin-language-literature',
        content: `
        <h2>The Urgent Need for Language Preservation</h2>
        <p>Language is the soul of culture. As globalization spreads, indigenous languages face unprecedented challenges. Here's how literature can help preserve the Kalenjin language.</p>
        
        <h3>The Current State</h3>
        <p>According to UNESCO, many indigenous languages are at risk of extinction. While Kalenjin remains vibrant, we must be proactive in preservation efforts.</p>
        
        <h3>Literature as a Preservation Tool</h3>
        <p>Books serve multiple preservation functions:</p>
        <ul>
          <li><strong>Documentation:</strong> Written records preserve vocabulary and grammar</li>
          <li><strong>Education:</strong> Books teach younger generations their mother tongue</li>
          <li><strong>Standardization:</strong> Published works establish spelling and usage norms</li>
          <li><strong>Cultural Context:</strong> Stories show how language reflects worldview</li>
        </ul>
        
        <h3>Bilingual Approach</h3>
        <p>Many modern Kalenjin books use a bilingual format, presenting text in both Kalenjin and English. This approach:</p>
        <ol>
          <li>Makes content accessible to diaspora communities</li>
          <li>Helps language learners</li>
          <li>Preserves nuances that might be lost in translation</li>
          <li>Bridges generational gaps</li>
        </ol>
        
        <h3>Digital Resources</h3>
        <p>Technology offers new preservation opportunities. Check out these resources:</p>
        <ul>
          <li><a href="https://kalenjinlanguage.org" target="_blank">Kalenjin Language Portal</a></li>
          <li><a href="https://youtube.com/kalenjinlessons" target="_blank">YouTube Language Lessons</a></li>
          <li>Mobile apps for vocabulary building</li>
          <li>Online dictionaries and translation tools</li>
        </ul>
        
        <blockquote>
          "When we lose a language, we lose a unique way of understanding the world."
        </blockquote>
        
        <h3>How You Can Help</h3>
        <p>Everyone can contribute to language preservation:</p>
        <ul>
          <li>Buy and read books in Kalenjin</li>
          <li>Speak the language at home with children</li>
          <li>Support local authors writing in Kalenjin</li>
          <li>Share stories and recordings with younger generations</li>
          <li>Participate in language learning communities</li>
        </ul>
        
        <p>Together, we can ensure that the Kalenjin language thrives for centuries to come.</p>
      `,
          excerpt: 'Exploring the critical role of literature in preserving the Kalenjin language and practical ways everyone can contribute to this important mission.',
            coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&h=600&fit=crop',
              isPublished: true,
                publishedAt: new Date('2024-12-01'),
                  viewCount: 156,
                    authorId: 'sample-author-1',
    },
  ];

// Create all blog posts
for (const post of blogPosts) {
  await prisma.blogPost.upsert({
    where: { id: post.id },
    update: {},
    create: post,
  });
  console.log(`Created blog post: ${post.title}`);
}

console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
