import React from "react";

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
}) => (
  <div
    className={`group relative bg-white/90 backdrop-blur-sm border border-slate-200 
      rounded-md shadow-md p-0 transition-all duration-300 ease-out 
      hover:-translate-y-1 hover:shadow-lg hover:border-slate-300 cursor-pointer ${className}`}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
}) => <div className={`p-5 pb-2 ${className}`}>{children}</div>;

export const CardTitle: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
}) => (
  <h3
    className={`text-lg font-semibold text-slate-800 group-hover:text-slate-900 transition-colors ${className}`}
  >
    {children}
  </h3>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
}) => (
  <div className={`p-5 pt-0 text-sm text-slate-600 ${className}`}>
    {children}
  </div>
);
