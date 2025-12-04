'use client';

import { ArrowLeft, BookOpen, Star, Mail, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Mock data - in production this would come from a database
const authorsData = [
    {
        id: 1,
        name: "Dr. Kibet Kitur",
        role: "Author & Thought Leader",
        bio: "Dr. Kibet Kitur delivers powerful messages to the African grassroots, calling for unity, economic freedom, and a mental revolution.",
        fullBio: "Dr. Kibet Kitur is a visionary author and thought leader whose work speaks directly to the African grassroots. His writing blows the trumpet and plays the African drum loud enough for all to hear, calling on Africans to end the dirge and understand their past, present, and future. Dr. Kitur's message emphasizes the need for a new peaceful and harmonious African unity, a treaty canonized for economic freedom, and a mental revolution to change the African world. His work shines light on things known and unknown, providing succinct historical and scientific-based messages to revolutionize thinking and ways of living. He calls on the African grassroots to heed the calling, step forward, and pick up the challenge of essential practice for survival.",
        booksCount: 1,
        rating: 4.9,
        image: "/images/author-kibet-kitur.png",
        location: "Kenya",
        joinedYear: 2024,
        email: "kibet.kitur@afrireads.com",
        books: [
            { id: 1, title: "Immortal Knowledge", price: 1200, cover: "/books/immortalknowledge.jpg" }
        ]
    },
    {
        id: 2,
        name: "Dr. Kiprop Lagat",
        role: "Cultural Historian",
        bio: "Dr. Lagat has spent over 20 years documenting the oral traditions of the Kalenjin people. His work focuses on preserving the wisdom of elders for future generations.",
        fullBio: "Dr. Kiprop Lagat is a renowned cultural historian and anthropologist specializing in the oral traditions of the Kalenjin community. Born in Nandi County, he developed a passion for storytelling from his grandfather, a village elder. After earning his PhD in African Studies from the University of Nairobi, Dr. Lagat dedicated his career to documenting and preserving the rich heritage of his people. His work has been instrumental in creating a comprehensive archive of Kalenjin folklore, proverbs, and historical narratives. He has collaborated with UNESCO on several cultural preservation projects and regularly conducts workshops in schools to pass on traditional knowledge to younger generations.",
        booksCount: 5,
        rating: 4.9,
        image: "/images/author-kiprop.png",
        location: "Eldoret, Kenya",
        joinedYear: 2018,
        email: "kiprop.lagat@afrireads.com",
        books: [
            { id: 2, title: "Kalenjin Folklore Tales", price: 400, cover: "/books/folklore-tales.png" },
            { id: 3, title: "Traditional Wisdom", price: 350, cover: "/books/traditional-wisdom.png" },
            { id: 4, title: "Elders' Stories", price: 450, cover: "https://via.placeholder.com/200x300/D97706/fff?text=Elders+Stories" }
        ]
    },
    {
        id: 3,
        name: "Chebet Rotich",
        role: "Children's Author",
        bio: "Chebet weaves magical tales that introduce young readers to African folklore. Her stories are known for their vibrant characters and moral lessons.",
        fullBio: "Chebet Rotich is an award-winning children's author whose enchanting stories have captivated young readers across East Africa. With a background in early childhood education, Chebet understands the importance of culturally relevant literature in shaping young minds. Her books blend traditional African folklore with contemporary themes, creating narratives that resonate with both children and parents. Each story is carefully crafted to impart moral lessons while celebrating African identity and heritage. Chebet's colorful illustrations and engaging storytelling style have made her books favorites in schools and homes alike.",
        booksCount: 8,
        rating: 4.8,
        image: "/images/author-chebet.png",
        location: "Nairobi, Kenya",
        joinedYear: 2019,
        email: "chebet.rotich@afrireads.com",
        books: [
            { id: 4, title: "Children Stories", price: 300, cover: "/books/children-stories.png" },
            { id: 5, title: "The Brave Little Warrior", price: 320, cover: "https://via.placeholder.com/200x300/059669/fff?text=Brave+Warrior" },
            { id: 6, title: "Tales from the Savanna", price: 280, cover: "https://via.placeholder.com/200x300/DC2626/fff?text=Savanna+Tales" }
        ]
    },
    {
        id: 4,
        name: "Kipchoge Keino",
        role: "Biographer",
        bio: "A legendary athlete turned writer, Kipchoge shares inspiring stories of resilience and triumph from the Rift Valley.",
        fullBio: "Kipchoge Keino brings a unique perspective to biographical writing, drawing from his own experiences as a celebrated athlete and his deep connection to the Rift Valley. His transition from sports to literature has allowed him to capture the spirit of determination and excellence that defines the Kalenjin people. Through his biographies, Kipchoge documents the lives of unsung heroes, community leaders, and everyday people whose stories deserve to be told. His writing style is direct, powerful, and deeply moving, reflecting the resilience of the human spirit.",
        booksCount: 3,
        rating: 4.7,
        image: "https://ui-avatars.com/api/?name=Kipchoge+Keino&background=D97706&color=fff&size=200",
        location: "Iten, Kenya",
        joinedYear: 2020,
        email: "kipchoge.keino@afrireads.com",
        books: [
            { id: 7, title: "Champions of the Rift", price: 500, cover: "https://via.placeholder.com/200x300/D97706/fff?text=Champions" },
            { id: 8, title: "Running with Purpose", price: 450, cover: "https://via.placeholder.com/200x300/059669/fff?text=Running" }
        ]
    },
    {
        id: 5,
        name: "Jepkorir Tanui",
        role: "Poet",
        bio: "Jepkorir's poetry captures the beauty of the Nandi Hills and the spirit of its people. Her verses are a celebration of identity and belonging.",
        fullBio: "Jepkorir Tanui is a contemporary poet whose verses paint vivid pictures of life in the Nandi Hills. Her poetry explores themes of identity, belonging, nature, and the intersection of tradition and modernity. With a master's degree in Creative Writing, Jepkorir has developed a distinctive voice that blends traditional oral poetry forms with contemporary free verse. Her work has been featured in numerous literary journals and anthologies, and she regularly performs at poetry festivals across Kenya. Jepkorir's ability to capture the essence of place and emotion in her words has earned her critical acclaim and a devoted following.",
        booksCount: 4,
        rating: 4.9,
        image: "https://ui-avatars.com/api/?name=Jepkorir+Tanui&background=059669&color=fff&size=200",
        location: "Kapsabet, Kenya",
        joinedYear: 2021,
        email: "jepkorir.tanui@afrireads.com",
        books: [
            { id: 9, title: "Whispers of the Hills", price: 380, cover: "https://via.placeholder.com/200x300/059669/fff?text=Whispers" },
            { id: 10, title: "Verses of Home", price: 350, cover: "https://via.placeholder.com/200x300/DC2626/fff?text=Verses" }
        ]
    }
];

export default function AuthorProfilePage() {
    const params = useParams();
    const authorId = parseInt(params.id as string);
    const author = authorsData.find(a => a.id === authorId);

    if (!author) {
        return (
            <div className="min-h-screen bg-neutral-cream flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-neutral-brown-900 mb-4">Author Not Found</h1>
                    <Link href="/authors" className="text-primary hover:underline">
                        Back to Authors
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-cream pt-8 pb-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Navigation */}
                <div className="mb-8">
                    <Link
                        href="/authors"
                        className="inline-flex items-center gap-2 text-neutral-brown-700 hover:text-primary transition-colors font-medium group"
                    >
                        <div className="w-10 h-10 rounded-full bg-white border border-neutral-brown-200 flex items-center justify-center group-hover:border-primary transition-colors shadow-sm">
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </div>
                        <span>Back to Authors</span>
                    </Link>
                </div>

                {/* Author Header */}
                <div className="bg-white rounded-3xl shadow-lg border border-neutral-brown-500/10 overflow-hidden mb-12">
                    <div className="bg-gradient-to-r from-primary to-orange-600 h-32"></div>
                    <div className="px-8 pb-8">
                        <div className="flex flex-col md:flex-row gap-8 items-start md:items-end -mt-16">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                                <img
                                    src={author.image}
                                    alt={author.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-4xl font-bold text-neutral-brown-900 font-heading mb-2">{author.name}</h1>
                                <p className="text-xl text-primary font-medium mb-4">{author.role}</p>
                                <div className="flex flex-wrap gap-6 text-sm text-neutral-brown-600">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-accent-green" />
                                        <span>{author.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-accent-gold" />
                                        <span>Joined {author.joinedYear}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <BookOpen size={16} className="text-primary" />
                                        <span>{author.booksCount} Books Published</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Star size={16} className="text-accent-gold fill-accent-gold" />
                                        <span>{author.rating} Rating</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <a
                                    href={`mailto:${author.email}`}
                                    className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-full transition-all hover:-translate-y-1 inline-flex items-center gap-2"
                                >
                                    <Mail size={18} />
                                    Contact Author
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Biography */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-neutral-brown-500/10 p-8 mb-8">
                            <h2 className="text-2xl font-bold text-neutral-brown-900 font-heading mb-6">About {author.name.split(' ')[0]}</h2>
                            <p className="text-neutral-brown-700 leading-relaxed mb-4">
                                {author.fullBio}
                            </p>
                        </div>

                        {/* Published Books */}
                        <div className="bg-white rounded-2xl shadow-sm border border-neutral-brown-500/10 p-8">
                            <h2 className="text-2xl font-bold text-neutral-brown-900 font-heading mb-6">Published Books</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {author.books.map((book) => (
                                    <Link
                                        key={book.id}
                                        href={`/books/${book.id}`}
                                        className="group flex gap-4 p-4 rounded-xl hover:bg-neutral-cream transition-all border border-transparent hover:border-primary/20"
                                    >
                                        <div className="w-24 h-32 rounded-lg overflow-hidden shadow-md flex-shrink-0 bg-gradient-to-br from-primary to-orange-600">
                                            <img
                                                src={book.cover}
                                                alt={book.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-neutral-brown-900 group-hover:text-primary transition-colors mb-2 line-clamp-2">
                                                {book.title}
                                            </h3>
                                            <p className="text-primary font-bold text-lg">KES {book.price}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Stats Card */}
                        <div className="bg-neutral-brown-900 text-white rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
                            <div className="relative z-10">
                                <h3 className="text-lg font-bold font-heading mb-6">Author Stats</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-neutral-brown-300">Total Books</span>
                                        <span className="text-2xl font-bold text-primary">{author.booksCount}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-neutral-brown-300">Average Rating</span>
                                        <span className="text-2xl font-bold text-accent-gold">{author.rating}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-neutral-brown-300">Years Active</span>
                                        <span className="text-2xl font-bold text-accent-green">{new Date().getFullYear() - author.joinedYear}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Bio Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-neutral-brown-500/10 p-6">
                            <h3 className="text-lg font-bold text-neutral-brown-900 font-heading mb-4">Quick Bio</h3>
                            <p className="text-neutral-brown-700 text-sm leading-relaxed">
                                {author.bio}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
