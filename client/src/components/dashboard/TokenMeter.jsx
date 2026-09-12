const TokenMeter = ({ used = 0, limit = 100 }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const safeLimit = limit > 0 ? limit : 1; // Prevent div by 0
  const percent = Math.min(100, Math.max(0, (used / safeLimit) * 100));
  const offset = circumference - (percent / 100) * circumference;

  let colorClass = "text-brand-500";
  if (percent > 80) colorClass = "text-red-500";
  else if (percent > 50) colorClass = "text-amber-500";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            className="text-slate-100 stroke-current"
            strokeWidth="8"
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
          />
          {/* Progress Circle */}
          <circle
            className={`${colorClass} stroke-current transition-all duration-1000 ease-out`}
            strokeWidth="8"
            strokeLinecap="round"
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold text-slate-800 leading-none">{Math.round(percent)}%</span>
        </div>
      </div>
      <div className="mt-3 text-center">
        <div className="text-sm font-medium text-slate-700">{used.toLocaleString()} / {limit.toLocaleString()}</div>
        <div className="text-xs text-slate-500">Tokens Used</div>
      </div>
    </div>
  );
};

export default TokenMeter;
