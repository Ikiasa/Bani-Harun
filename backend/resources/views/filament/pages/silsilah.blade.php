<x-filament-panels::page>
    <div class="space-y-6">
        @viteReactRefresh
        @vite(['resources/js/app.jsx'])

        <div class="p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 relative overflow-hidden">
            <div 
                id="family-tree-root" 
                class="w-full"
                style="height: 850px;"
                data-members="{{ json_encode($this->rootMembers) }}"
            >
                <div class="flex items-center justify-center h-full bg-slate-50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <div class="text-center space-y-4">
                        <div class="relative w-12 h-12 mx-auto">
                            <div class="absolute inset-0 rounded-full border-4 border-amber-100 dark:border-amber-900/30"></div>
                            <div class="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
                        </div>
                        <p class="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Menyiapkan Visualisasi Pohon Keluarga...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

</x-filament-panels::page>
