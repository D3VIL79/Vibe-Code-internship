import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ label = "Loading...", size = "md" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3 p-4">
      <Loader2 className={`animate-spin text-brand-500 ${sizeClasses[size]}`} />
      {label && <p className="text-slate-500 font-medium text-sm animate-pulse">{label}</p>}
    </div>
  );
};

export default LoadingSpinner;
