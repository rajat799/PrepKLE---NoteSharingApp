"use client";

function Shimmer({ className }: { className?: string }) {
  return <div className={`skeleton-warm ${className || ""}`} />;
}

export function NoteCardSkeleton() {
  return (
    <div className="paper-flat rounded-xl overflow-hidden">
      <Shimmer className="h-28 rounded-none" />
      <div className="p-4 space-y-3">
        <Shimmer className="h-5 w-3/4" />
        <Shimmer className="h-4 w-full" />
        <Shimmer className="h-4 w-2/3" />
        <div className="flex gap-2 pt-2">
          <Shimmer className="h-5 w-14 rounded-md" />
          <Shimmer className="h-5 w-18 rounded-md" />
        </div>
        <div className="flex justify-between pt-3 border-t border-[#333333]">
          <Shimmer className="h-4 w-24" />
          <Shimmer className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}

export function NoteDetailSkeleton() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Shimmer className="h-5 w-48 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div className="notebook-frame rounded-xl p-6">
              <Shimmer className="h-[400px] w-full rounded-lg bg-[#1A1A1A]" />
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="paper-flat rounded-xl p-6 space-y-4">
              <Shimmer className="h-8 w-3/4" />
              <div className="flex gap-2">
                <Shimmer className="h-6 w-20 rounded-md" />
                <Shimmer className="h-6 w-24 rounded-md" />
              </div>
              <Shimmer className="h-4 w-full" />
              <Shimmer className="h-4 w-2/3" />
              <div className="flex gap-2 pt-4 border-t border-[#333333]">
                <Shimmer className="h-10 w-24 rounded-lg" />
                <Shimmer className="h-10 w-20 rounded-lg" />
              </div>
            </div>
            <Shimmer className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
