-- First, create a user for the author
INSERT OR IGNORE INTO User (id, email, password, name, role, createdAt, updatedAt)
VALUES 
  ('user-kitur-001', 'kibet.kitur@kaleereads.com', '$2a$10$placeholder', 'Dr. Kibet Kitur', 'AUTHOR', datetime('now'), datetime('now')),
  ('user-kamau-001', 'john.kamau@kaleereads.com', '$2a$10$placeholder', 'John Kamau', 'AUTHOR', datetime('now'), datetime('now')),
  ('user-kiplagat-001', 'jane.kiplagat@kaleereads.com', '$2a$10$placeholder', 'Jane Kiplagat', 'AUTHOR', datetime('now'), datetime('now')),
  ('user-chebet-001', 'sarah.chebet@kaleereads.com', '$2a$10$placeholder', 'Sarah Chebet', 'AUTHOR', datetime('now'), datetime('now')),
  ('user-korir-001', 'mike.korir@kaleereads.com', '$2a$10$placeholder', 'Mike Korir', 'AUTHOR', datetime('now'), datetime('now'));

-- Create author profiles
INSERT OR IGNORE INTO Author (id, userId, bio, profileImage, totalEarnings, createdAt, updatedAt)
VALUES 
  ('author-kitur-001', 'user-kitur-001', 'Dr. Kibet Kitur is a visionary author and thought leader whose work speaks directly to the African grassroots.', '/images/author-kibet-kitur.png', 0, datetime('now'), datetime('now')),
  ('author-kamau-001', 'user-kamau-001', 'John Kamau is a renowned storyteller specializing in traditional Kalenjin folklore.', '/images/author-kiprop.png', 0, datetime('now'), datetime('now')),
  ('author-kiplagat-001', 'user-kiplagat-001', 'Jane Kiplagat explores the philosophical and practical wisdom embedded in Kalenjin traditions.', '/images/author-chebet.png', 0, datetime('now'), datetime('now')),
  ('author-chebet-001', 'user-chebet-001', 'Sarah Chebet writes magical tales that introduce young readers to African folklore.', '/images/author-chebet.png', 0, datetime('now'), datetime('now')),
  ('author-korir-001', 'user-korir-001', 'Mike Korir documents the rich cultural heritage of the Kalenjin people.', NULL, 0, datetime('now'), datetime('now'));

-- Insert books (4 featured)
INSERT OR IGNORE INTO Book (id, title, description, coverImage, fileKey, fileSize, fileType, price, rentalPrice, previewPages, category, language, publishedAt, isPublished, isFeatured, featuredOrder, rating, reviewCount, authorId, createdAt, updatedAt)
VALUES 
  -- Featured Book 1: Immortal Knowledge
  ('book-001', 'Immortal Knowledge', 'Immortal Knowledge is a message to the African Grassroots. It blows the trumpet. It plays the African drum loud enough for all to hear. It calls on the Africans to end the dirge. The African Grassroots need to understand what and where they have been and what they are.', '/books/immortalknowledge.jpg', 'books/immortal-knowledge.pdf', 5242880, 'pdf', 1200, 150, 15, 'Non-Fiction', 'English', datetime('now'), 1, 1, 1, 4.9, 89, 'author-kitur-001', datetime('now'), datetime('now')),
  
  -- Featured Book 2: Kalenjin Folklore Tales
  ('book-002', 'Kalenjin Folklore Tales', 'A captivating collection of traditional Kalenjin stories passed down through generations. These tales feature the wisdom of elders, the cunning of animals, and the beauty of the Rift Valley landscape.', '/books/folklore-tales.png', 'books/folklore-tales.pdf', 3145728, 'pdf', 500, 60, 10, 'Folklore', 'Kalenjin', datetime('now'), 1, 1, 2, 4.5, 156, 'author-kamau-001', datetime('now'), datetime('now')),
  
  -- Featured Book 3: Traditional Wisdom
  ('book-003', 'Traditional Wisdom', 'An exploration of the philosophical and practical wisdom embedded in Kalenjin traditions. From agricultural practices to social customs, this book reveals the deep knowledge systems of the community.', '/books/traditional-wisdom.png', 'books/traditional-wisdom.pdf', 4194304, 'pdf', 750, 90, 12, 'Non-Fiction', 'Bilingual', datetime('now'), 1, 1, 3, 4.8, 203, 'author-kiplagat-001', datetime('now'), datetime('now')),
  
  -- Featured Book 4: Children Stories
  ('book-004', 'Children Stories', 'Immerse your child in the magical world of African storytelling with this delightful collection of fables and adventures featuring beloved characters like the clever hare, the mighty lion, and the wise tortoise.', '/books/children-stories.png', 'books/children-stories.pdf', 2097152, 'pdf', 400, 50, 8, 'Children', 'English & Kalenjin', datetime('now'), 1, 1, 4, 4.7, 128, 'author-chebet-001', datetime('now'), datetime('now')),
  
  -- Non-featured books
  ('book-005', 'Cultural Heritage', 'A comprehensive look at the rich cultural heritage of the Kalenjin people, documenting ceremonies, rituals, and the evolution of traditions over time.', '/books/cultural-heritage.png', 'books/cultural-heritage.pdf', 4718592, 'pdf', 600, 70, 10, 'History', 'English', datetime('now'), 1, 0, NULL, 4.3, 98, 'author-korir-001', datetime('now'), datetime('now')),
  
  ('book-006', 'Modern Kalenjin Poetry', 'A collection of contemporary poetry celebrating Kalenjin identity, landscape, and the intersection of tradition and modernity.', NULL, 'books/poetry.pdf', 1572864, 'pdf', 550, 65, 10, 'Poetry', 'Kalenjin', datetime('now'), 1, 0, NULL, 4.6, 72, 'author-kiplagat-001', datetime('now'), datetime('now')),
  
  ('book-007', 'Educational Guide to Kalenjin History', 'A comprehensive educational resource covering the history, migration patterns, and cultural development of the Kalenjin community.', NULL, 'books/education.pdf', 6291456, 'pdf', 800, 100, 15, 'Education', 'Bilingual', datetime('now'), 1, 0, NULL, 4.9, 45, 'author-kamau-001', datetime('now'), datetime('now')),
  
  ('book-008', 'Historical Narratives of the Rift Valley', 'Stories and accounts from the Rift Valley region, documenting significant events and personalities that shaped the Kalenjin community.', NULL, 'books/history.pdf', 5767168, 'pdf', 650, 80, 12, 'History', 'English', datetime('now'), 1, 0, NULL, 4.4, 67, 'author-korir-001', datetime('now'), datetime('now'));
