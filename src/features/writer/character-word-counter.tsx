import { Separator } from '@/components/ui/separator';
import { FileText, Hash } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type CounterItemProps = {
  icon: LucideIcon;
  count: number;
  label: string;
};

type CharacterWordCounterProps = {
  charactersCount: number;
  wordsCount: number;
  className?: string;
};

function CounterItem({ icon: Icon, count, label }: CounterItemProps) {
  return (
    <div className="text-muted-foreground flex items-center gap-2 text-sm">
      <Icon className="size-4" />
      <span className="font-medium tabular-nums">{count}</span>
      <span className="text-xs">{label}</span>
    </div>
  );
}

export default function CharacterWordCounter({
  charactersCount,
  wordsCount,
  className = '',
}: CharacterWordCounterProps) {
  return (
    <div
      className={`bg-background/95 fixed right-4 bottom-4 flex items-center gap-4 rounded-lg border px-4 py-2.5 shadow-lg backdrop-blur-sm transition-all duration-200 hover:shadow-xl ${className}`}
    >
      <CounterItem icon={Hash} count={charactersCount} label="chars" />
      <Separator
        orientation="vertical"
        className="data-[orientation=vertical]:h-4"
      />
      <CounterItem icon={FileText} count={wordsCount} label="words" />
    </div>
  );
}
