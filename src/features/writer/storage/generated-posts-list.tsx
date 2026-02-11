import { Button } from '@/components/ui/button';
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2Icon } from 'lucide-react';

type GeneratedPost = {
  _id: string;
  title: string;
  content: string;
  wordCount: number;
  domain: string;
};

export default function GeneratedPostsList({
  posts,
  onSelect,
  onDelete,
}: {
  posts: GeneratedPost[];
  onSelect: (post: { title: string; content: string }) => void;
  onDelete: (e: React.MouseEvent, postId: string) => void;
}) {
  if (posts.length === 0) return null;

  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuLabel>Generated Posts ({posts.length})</DropdownMenuLabel>
      <ScrollArea className="max-h-64">
        <div className="grid gap-1 p-2">
          {posts.map((post) => (
            <DropdownMenuItem
              key={post._id}
              className="flex-col items-start gap-1 p-3"
              onSelect={() =>
                onSelect({
                  title: post.title,
                  content: post.content,
                })
              }
            >
              <div className="flex w-full items-start justify-between gap-2">
                <span className="text-sm font-medium">{post.title}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-destructive size-6 shrink-0 opacity-50 hover:opacity-100"
                  onClick={(e) => onDelete(e, post._id)}
                >
                  <Trash2Icon className="size-3.5" />
                </Button>
              </div>
              <span className="text-muted-foreground text-xs">
                {post.wordCount} words &bull; {post.domain}
              </span>
            </DropdownMenuItem>
          ))}
        </div>
      </ScrollArea>
    </>
  );
}
