import Image from 'next/image';
import React from 'react';
import { BookPageData } from '@/lib/family-book-data';

interface BookPageProps {
    data: BookPageData | null;
    pageNumber: number;
    isLeftPage?: boolean;
}

export function BookPage({ data, pageNumber, isLeftPage = false }: BookPageProps) {
    if (!data) {
        return (
            <div className={`flex flex-col h-full w-full bg-[#fcfbfa] relative
                ${isLeftPage ? 'rounded-l-2xl border-r border-black/5' : 'rounded-r-2xl border-l border-black/5'}
            `}>
                <div className="flex-1 flex items-center justify-center opacity-30">
                    <span className="font-serif text-slate-400 italic">Halaman Kosong</span>
                </div>
                <div className={`absolute bottom-6 ${isLeftPage ? 'left-8' : 'right-8'} text-slate-400 text-sm font-serif`}>
                    {pageNumber}
                </div>
            </div>
        );
    }

    const bio = data.bioDetails;
    const [imageError, setImageError] = React.useState(false);

    // Determine the photo to show
    const photoToUse = data.avatar || bio?.gallery?.[0];

    // Initial fallback if no image or error
    const getInitials = (name: string) => {
        return name
            .split(/[\s-]+/) // Split by space or hyphen
            .filter(part => part.length > 0 && /^[a-z0-9]/i.test(part)) // Filter non-alpha parts
            .map(n => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };
    return (
        <div className={`flex flex-col h-full w-full bg-[#fcfbfa] relative group overflow-hidden
            ${isLeftPage ? 'rounded-l-2xl border-r border-black/5' : 'rounded-r-2xl border-l border-black/5'}
            shadow-[inset_0_0_40px_rgba(0,0,0,0.02)]
        `}>
            {/* Book Fold Shadow Gradient */}
            <div className={`absolute inset-y-0 w-8 pointer-events-none 
                ${isLeftPage ? 'right-0 bg-gradient-to-l from-black/[0.04] to-transparent' : 'left-0 bg-gradient-to-r from-black/[0.04] to-transparent'}
            `} />

            <div className="flex-1 overflow-y-auto no-scrollbar p-12 md:p-16 pb-24">
                {/* Profile Header */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-[#f0ece1] shadow-md mb-8 bg-[#f5f2e9] flex items-center justify-center relative">
                        {(!photoToUse || imageError) ? (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#e8e4d9] to-[#d9d5c8] text-slate-400">
                                <span className="text-3xl md:text-4xl font-serif font-black tracking-tighter opacity-40">
                                    {getInitials(data.name)}
                                </span>
                            </div>
                        ) : (
                            <Image
                                src={photoToUse}
                                alt={data.name}
                                fill
                                className="object-cover"
                                onError={() => setImageError(true)}
                                sizes="(max-width: 768px) 128px, 160px"
                            />
                        )}
                    </div>
                    <h2 className="font-serif text-4xl md:text-5xl text-slate-800 tracking-tight font-medium mb-3">
                        {data.name}
                    </h2>
                    <p className="text-base md:text-lg text-slate-500 uppercase tracking-[0.2em] font-medium">
                        {data.role} • Generasi {data.generation}
                    </p>
                </div>

                {/* Info Section */}
                {bio && (
                    <div className="mb-8 p-6 bg-[#f5f2e9]/50 rounded-xl border border-[#e8e4d9]">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="block text-slate-400 mb-1 text-xs uppercase tracking-wider">Lahir</span>
                                <span className="font-medium text-slate-700">{bio.birthPlace}, {bio.birthDate}</span>
                            </div>
                            {bio.partner && (
                                <div>
                                    <span className="block text-slate-400 mb-1 text-xs uppercase tracking-wider">Pasangan</span>
                                    <span className="font-medium text-slate-700">{bio.partner}</span>
                                </div>
                            )}
                        </div>
                        {bio.headOfFamily && (
                            <div className="mt-4 pt-4 border-t border-[#e8e4d9]/50">
                                <span className="block text-slate-400 mb-1 text-xs uppercase tracking-wider">Kepala Keluarga</span>
                                <span className="font-medium text-slate-700">{bio.headOfFamily}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Biography Text */}
                <div className="prose prose-slate prose-p:leading-loose prose-p:text-slate-600 prose-p:text-[17px] md:prose-p:text-lg max-w-none text-justify">
                    {bio?.bio ? (
                        <div dangerouslySetInnerHTML={{ __html: bio.bio }} />
                    ) : (
                        <>
                            <p>Biografi detail untuk {data.name} sedang dalam proses penyusunan arsip.</p>
                            <p className="italic text-slate-400 text-center mt-10">
                                ~ Arsip Keluarga Bani Harun ~
                            </p>
                        </>
                    )}
                </div>

                {/* Achievements List */}
                {bio?.achievements && bio.achievements.length > 0 && (
                    <div className="mt-10">
                        <h4 className="font-serif text-lg text-slate-800 mb-4 border-b border-[#e8e4d9] pb-2">Jejak Karya</h4>
                        <ul className="space-y-3">
                            {bio.achievements.map((ach, idx) => (
                                <li key={idx} className="flex gap-3 text-slate-600 text-[15px] leading-relaxed">
                                    <span className="text-amber-600">✧</span>
                                    <span>{ach}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Page Number */}
            <div className={`absolute bottom-6 md:bottom-8 ${isLeftPage ? 'left-8 md:left-10' : 'right-8 md:right-10'}`}>
                <span className="font-serif text-slate-400 text-sm md:text-base">{pageNumber}</span>
            </div>
        </div>
    );
}
