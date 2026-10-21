export default function EventLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 rounded-2xl border border-[rgba(197,160,89,0.15)] bg-[#121216]/60 backdrop-blur-sm"
          />
        ))}
      </div>
      <div className="h-64 rounded-3xl border border-[rgba(197,160,89,0.15)] bg-[#121216]/60 backdrop-blur-sm" />
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="h-44 rounded-2xl border border-[rgba(197,160,89,0.15)] bg-[#121216]/60 backdrop-blur-sm" />
        <div className="h-44 rounded-2xl border border-[rgba(197,160,89,0.15)] bg-[#121216]/60 backdrop-blur-sm" />
      </div>
    </div>
  );
}
