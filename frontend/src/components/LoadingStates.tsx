import React from "react";

// Animated Spinner
export const Spinner: React.FC<{ size?: "sm" | "md" | "lg"; color?: string }> = ({
  size = "md",
  color = "#4CAF50",
}) => {
  const sizeMap = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={`${sizeMap[size]} relative`}>
      <div
        className="absolute inset-0 rounded-full border-2 border-gray-200"
        style={{ borderTopColor: color }}
      />
      <div
        className={`absolute inset-0 rounded-full border-2 border-transparent animate-spin`}
        style={{ borderTopColor: color }}
      />
    </div>
  );
};

// Pulse Dot Loader
export const PulseLoader: React.FC<{ color?: string }> = ({ color = "#4CAF50" }) => {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2.5 h-2.5 rounded-full animate-pulse-dot"
          style={{
            backgroundColor: color,
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
};

// Skeleton Box
export const Skeleton: React.FC<{
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full" | "2xl";
}> = ({ className = "", rounded = "md" }) => {
  const roundedMap = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
    "2xl": "rounded-2xl",
  };

  return (
    <div
      className={`bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer ${roundedMap[rounded]} ${className}`}
    />
  );
};

// Full Page Loading
export const PageLoading: React.FC<{ message?: string }> = ({
  message = "Loading...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-gray-100" />
        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-primary animate-spin" />
      </div>
      <p className="text-gray-500 text-base font-medium animate-pulse">{message}</p>
    </div>
  );
};

// Report Card Skeleton
export const ReportCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-4">
        <Skeleton className="w-8 h-8" rounded="full" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="w-6 h-6" rounded="full" />
      </div>
    </div>
  );
};

// Report Detail Skeleton
export const ReportDetailSkeleton: React.FC = () => {
  return (
    <div className="animate-fade-in">
      {/* Header Card Skeleton */}
      <div className="bg-gray-100 rounded-2xl p-5 mb-6">
        <Skeleton className="h-5 w-2/3 mb-3" rounded="lg" />
        <Skeleton className="h-4 w-1/2 mb-2" rounded="lg" />
        <Skeleton className="h-3 w-1/3" rounded="lg" />
      </div>

      {/* Info Lines Skeleton */}
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="py-4 border-b border-gray-200">
            <Skeleton className="h-3 w-16 mb-3" rounded="lg" />
            <Skeleton className="h-4 w-full" rounded="lg" />
          </div>
        ))}
      </div>
    </div>
  );
};

// Reports List Skeleton
export const ReportsListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {Array.from({ length: 2 }).map((_, groupIndex) => (
        <div key={groupIndex}>
          {/* Date Header Skeleton */}
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="w-[18px] h-[18px]" rounded="full" />
            <Skeleton className="h-3 w-24" rounded="lg" />
          </div>

          {/* Report Cards Skeleton */}
          <div className="flex flex-col gap-3">
            {Array.from({ length: Math.ceil(count / 2) }).map((_, i) => (
              <ReportCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Button Loading State
export const ButtonLoading: React.FC<{
  text: string;
  className?: string;
}> = ({ text, className = "" }) => {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <Spinner size="sm" color="currentColor" />
      <span>{text}</span>
    </div>
  );
};

// Processing Overlay
export const ProcessingOverlay: React.FC<{
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}> = ({ title, subtitle, icon }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-scale-in">
        {icon ? (
          <div className="mb-6">{icon}</div>
        ) : (
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
              </div>
            </div>
          </div>
        )}
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
        <div className="mt-6 flex justify-center">
          <PulseLoader />
        </div>
      </div>
    </div>
  );
};

// Home Page Quick Actions Skeleton
export const QuickActionsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col items-center gap-2 p-4">
          <Skeleton className="w-14 h-14" rounded="full" />
          <Skeleton className="h-3 w-12" rounded="lg" />
        </div>
      ))}
    </div>
  );
};
