import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
}

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="bg-white/5 border border-white/10 p-6 hover:border-lime-400/40 transition-colors">
      
      <div className="flex items-start justify-between mb-6">
        
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
            {title}
          </p>

          <h3 className="text-4xl font-black text-white mt-2">
            {value}
          </h3>
        </div>

        <div className="w-11 h-11 bg-lime-400 text-black flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </div>

      </div>

      <p className="text-sm text-zinc-500">
        {description}
      </p>

    </div>
  );
}