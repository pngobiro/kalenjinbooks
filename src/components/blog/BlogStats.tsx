import { TrendingUp, FileText, Eye, Edit } from 'lucide-react';

interface BlogStatsProps {
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    totalViews: number;
}

export default function BlogStats({
    totalPosts,
    publishedPosts,
    draftPosts,
    totalViews,
}: BlogStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Posts */}
            <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-primary">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-neutral-brown-700 mb-1">Total Posts</p>
                        <p className="text-3xl font-bold text-neutral-brown-900">{totalPosts}</p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <FileText className="text-primary" size={24} />
                    </div>
                </div>
            </div>

            {/* Published */}
            <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-accent-green">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-neutral-brown-700 mb-1">Published</p>
                        <p className="text-3xl font-bold text-neutral-brown-900">{publishedPosts}</p>
                    </div>
                    <div className="w-12 h-12 bg-accent-green/10 rounded-full flex items-center justify-center">
                        <TrendingUp className="text-accent-green" size={24} />
                    </div>
                </div>
            </div>

            {/* Drafts */}
            <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-neutral-brown-500">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-neutral-brown-700 mb-1">Drafts</p>
                        <p className="text-3xl font-bold text-neutral-brown-900">{draftPosts}</p>
                    </div>
                    <div className="w-12 h-12 bg-neutral-brown-500/10 rounded-full flex items-center justify-center">
                        <Edit className="text-neutral-brown-700" size={24} />
                    </div>
                </div>
            </div>

            {/* Total Views */}
            <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-accent-gold">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-neutral-brown-700 mb-1">Total Views</p>
                        <p className="text-3xl font-bold text-neutral-brown-900">{totalViews.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-accent-gold/10 rounded-full flex items-center justify-center">
                        <Eye className="text-accent-gold" size={24} />
                    </div>
                </div>
            </div>
        </div>
    );
}
