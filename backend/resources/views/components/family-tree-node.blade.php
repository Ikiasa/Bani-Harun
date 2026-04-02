@props(['member'])

<li x-data="{ open: true }" class="relative">
    <div class="flex flex-col items-center">
        <a href="{{ \App\Filament\Resources\FamilyMemberResource::getUrl('edit', ['record' => $member]) }}" class="shadow-sm hover:ring-2 hover:ring-amber-500 transition-all overflow-hidden flex flex-col items-center !p-1">
            @if($member->photo)
                <img src="{{ asset('storage/' . $member->photo) }}" class="w-12 h-12 rounded-full object-cover mb-1 border-2 border-amber-200">
            @else
                <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-1 border-2 border-gray-200">
                    <span class="text-xs text-gray-400">Photo</span>
                </div>
            @endif
            <div class="font-bold text-[11px] leading-tight text-center">{{ $member->name }}</div>
            <div class="text-[9px] text-gray-500 uppercase tracking-tighter">{{ $member->role }}</div>
        </a>
        
        @if($member->children->count() > 0)
            <button @click="open = !open" 
                    class="mt-2 w-5 h-5 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900 border border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400 z-10 hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors">
                <span x-show="open" class="text-xs">−</span>
                <span x-show="!open" class="text-xs">+</span>
            </button>
        @endif
    </div>

    @if($member->children->count() > 0)
        <ul x-show="open" x-transition>
            @foreach($member->children as $child)
                <x-family-tree-node :member="$child" />
            @endforeach
        </ul>
    @endif
</li>
