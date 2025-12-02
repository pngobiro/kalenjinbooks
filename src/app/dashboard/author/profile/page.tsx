import { User, Mail, Phone, MapPin, Calendar, Edit } from 'lucide-react';

// Mock author data
const author = {
    name: 'John Kamau',
    email: 'john.kamau@example.com',
    phone: '+254712345678',
    location: 'Nairobi, Kenya',
    bio: 'Passionate storyteller preserving Kalenjin culture through literature. Published author with 8 books focusing on traditional folklore and modern narratives.',
    joinedDate: '2024-01-15',
    paymentMethod: 'M-Pesa',
    mpesaNumber: '+254712345678',
    language: 'Kalenjin, English',
};

export default function ProfilePage() {
    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-brown-900">Profile</h1>
                    <p className="text-neutral-brown-700 mt-1">
                        Manage your author profile and settings
                    </p>
                </div>
                <button className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-all">
                    <Edit size={20} />
                    Edit Profile
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                                <User size={48} className="text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold text-neutral-brown-900">{author.name}</h2>
                            <p className="text-neutral-brown-700 mt-1">{author.email}</p>
                            <div className="flex items-center gap-2 text-sm text-neutral-brown-700 mt-2">
                                <Calendar size={14} />
                                <span>Joined {new Date(author.joinedDate).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-neutral-brown-500/10 space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <Phone size={16} className="text-neutral-brown-700" />
                                <span className="text-neutral-brown-900">{author.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <MapPin size={16} className="text-neutral-brown-700" />
                                <span className="text-neutral-brown-900">{author.location}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Bio */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-neutral-brown-900 mb-4">About</h3>
                        <p className="text-neutral-brown-700 leading-relaxed">{author.bio}</p>
                    </div>

                    {/* Author Details */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-neutral-brown-900 mb-4">
                            Author Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-neutral-brown-700 mb-1">Languages</p>
                                <p className="font-medium text-neutral-brown-900">{author.language}</p>
                            </div>
                            <div>
                                <p className="text-sm text-neutral-brown-700 mb-1">Member Since</p>
                                <p className="font-medium text-neutral-brown-900">
                                    {new Date(author.joinedDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Settings */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-neutral-brown-900 mb-4">
                            Payment Settings
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-neutral-brown-700 mb-1">Preferred Method</p>
                                <p className="font-medium text-neutral-brown-900">{author.paymentMethod}</p>
                            </div>
                            <div>
                                <p className="text-sm text-neutral-brown-700 mb-1">M-Pesa Number</p>
                                <p className="font-medium text-neutral-brown-900">{author.mpesaNumber}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
