import { ReactNode } from "react";
import { cn, isMobile } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
}

export function PageContainer({ children, className, title, description, actions }: PageContainerProps) {
  const mobile = isMobile();

  return (
    <div className="flex-1 h-full overflow-y-auto bg-zinc-50/50 dark:bg-zinc-950/50 scroll-smooth no-scrollbar">
      <div className={cn(
        "max-w-6xl mx-auto p-4 md:p-8",
        mobile && "pb-24 safe-area-pt"
      )}>
        {(title || description || actions) && (
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 gap-4 md:gap-0">
            <div>
                {title && <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{title}</h1>}
                {description && <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 mt-1">{description}</p>}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
            </div>
        )}
        <div className={cn("animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100", className)}>
          {children}
        </div>
      </div>
    </div>
  );
}
