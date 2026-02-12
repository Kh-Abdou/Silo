export function MasonryGrid({ children }: { children: React.ReactNode }) {
    return (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 space-y-3 p-2 pb-32 w-full max-w-[1600px] mx-auto">
            {children}
        </div>
    )
}
