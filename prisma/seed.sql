-- Seed data for Kalenjin Books platform
-- Users and Authors
INSERT INTO User (id, email, password, name, role, createdAt, updatedAt) VALUES
('user-kibet-kitur', 'kibet.kitur@kalenjinbooks.com', '$2a$10$rOJ7FqZxQj3GxM5vYZxZ4.xKqF5xQxQxQxQxQxQxQxQxQxQxQxQxQ', 'Dr. Kibet Kitur', 'AUTHOR', datetime('now'), datetime('now')),
('user-john-kamau', 'john.kamau@kalenjinbooks.com', '$2a$10$rOJ7FqZxQj3GxM5vYZxZ4.xKqF5xQxQxQxQxQxQxQxQxQxQxQxQxQ', 'John Kamau', 'AUTHOR', datetime('now'), datetime('now')),
('user-jane-kiplagat', 'jane.kiplagat@kalenjinbooks.com', '$2a$10$rOJ7FqZxQj3GxM5vYZxZ4.xKqF5xQxQxQxQxQxQxQxQxQxQxQxQxQ', 'Jane Kiplagat', 'AUTHOR', datetime('now'), datetime('now')),
('user-mike-korir', 'mike.korir@kalenjinbooks.com', '$2a$10$rOJ7FqZxQj3GxM5vYZxZ4.xKqF5xQxQxQxQxQxQxQxQxQxQxQxQxQ', 'Mike Korir', 'AUTHOR', datetime('now'), datetime('now')),
('user-sarah-chebet', 'sarah.chebet@kalenjinbooks.com', '$2a$10$rOJ7FqZxQj3GxM5vYZxZ4.xKqF5xQxQxQxQxQxQxQxQxQxQxQxQxQ', 'Sarah Chebet', 'AUTHOR', datetime('now'), datetime('now'));

INSERT INTO Author (id, userId, bio, profileImage, createdAt, updatedAt) VALUES
('author-user-kibet-kitur', 'user-kibet-kitur', 'Author of Immortal Knowledge, passionate about African history and philosophy.', 'https://ui-avatars.com/api/?name=Kibet+Kitur&size=200&background=E07856&color=fff&bold=true', datetime('now'), datetime('now')),
('author-user-john-kamau', 'user-john-kamau', 'Collector and preserver of traditional Kalenjin folklore tales.', 'https://ui-avatars.com/api/?name=John+Kamau&size=200&background=4A90E2&color=fff&bold=true', datetime('now'), datetime('now')),
('author-user-jane-kiplagat', 'user-jane-kiplagat', 'Scholar of Kalenjin traditions and cultural practices.', 'https://ui-avatars.com/api/?name=Jane+Kiplagat&size=200&background=50C878&color=fff&bold=true', datetime('now'), datetime('now')),
('author-user-mike-korir', 'user-mike-korir', 'Historian documenting the rich cultural heritage of the Kalenjin people.', 'https://ui-avatars.com/api/?name=Mike+Korir&size=200&background=9B59B6&color=fff&bold=true', datetime('now'), datetime('now')),
('author-user-sarah-chebet', 'user-sarah-chebet', 'Children''s book author and storyteller preserving Kalenjin culture through words.', 'https://ui-avatars.com/api/?name=Sarah+Chebet&size=200&background=E07856&color=fff&bold=true', datetime('now'), datetime('now'));

-- Books
INSERT INTO Book (id, title, description, coverImage, fileKey, fileSize, fileType, price, previewPages, category, language, isPublished, publishedAt, authorId, createdAt, updatedAt) VALUES
('book-1', 'Immortal Knowledge', 'Immortal Knowledge is a message to the African Grassroots. It blows the trumpet. It plays the African drum loud enough for all to hear.', '/books/immortalknowledge.jpg', 'books/book-1/immortal-knowledge.pdf', 5242880, 'pdf', 1200, 20, 'Non-Fiction', 'English', 1, '2024-01-15', 'author-user-kibet-kitur', datetime('now'), datetime('now')),
('book-2', 'Kalenjin Folklore Tales', 'A captivating collection of traditional Kalenjin stories passed down through generations.', '/books/folklore-tales.png', 'books/book-2/folklore-tales.pdf', 3145728, 'pdf', 500, 15, 'Folklore', 'Kalenjin', 1, '2022-06-20', 'author-user-john-kamau', datetime('now'), datetime('now')),
('book-3', 'Traditional Wisdom', 'An exploration of the philosophical and practical wisdom embedded in Kalenjin traditions.', '/books/traditional-wisdom.png', 'books/book-3/traditional-wisdom.pdf', 4194304, 'pdf', 750, 18, 'Non-Fiction', 'Bilingual', 1, '2023-03-10', 'author-user-jane-kiplagat', datetime('now'), datetime('now')),
('book-4', 'Cultural Heritage', 'A comprehensive look at the rich cultural heritage of the Kalenjin people.', '/books/cultural-heritage.png', 'books/book-4/cultural-heritage.pdf', 4718592, 'pdf', 600, 12, 'History', 'English', 1, '2021-09-05', 'author-user-mike-korir', datetime('now'), datetime('now')),
('book-5', 'Children Stories', 'Immerse your child in the magical world of African storytelling with this delightful collection.', '/books/children-stories.png', 'books/book-5/children-stories.pdf', 2097152, 'pdf', 400, 10, 'Children', 'English & Kalenjin', 1, '2023-11-12', 'author-user-sarah-chebet', datetime('now'), datetime('now'));

-- Blog Posts
INSERT INTO BlogPost (id, title, slug, content, excerpt, coverImage, isPublished, publishedAt, viewCount, authorId, createdAt, updatedAt) VALUES
('blog-1', 'The Rich History of Kalenjin Literature', 'rich-history-kalenjin-literature', '<h2>Introduction to Kalenjin Literary Tradition</h2><p>The Kalenjin people have a rich oral and written literary tradition.</p>', 'Exploring the evolution of Kalenjin literature from oral traditions to modern written works.', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop', 1, '2024-11-15', 245, 'author-user-sarah-chebet', datetime('now'), datetime('now')),
('blog-2', 'How to Write Compelling Folklore Stories', 'how-to-write-compelling-folklore-stories', '<h2>Mastering the Art of Folklore Writing</h2><p>Writing folklore requires a delicate balance between preserving tradition and engaging modern readers.</p>', 'A comprehensive guide for aspiring writers on how to craft authentic folklore stories.', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop', 1, '2024-11-20', 189, 'author-user-sarah-chebet', datetime('now'), datetime('now'));
