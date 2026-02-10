import { useAction, useQuery } from 'convex/react';
import { Loader2, Sparkles, X } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { api } from '../../convex/_generated/api';

type Topic = {
  name: string;
  searchVolume: string;
  trend: string;
  reason: string;
};

type GeneratedPost = {
  _id: string;
  title: string;
  content: string;
  wordCount: number;
};

type Step = 'input' | 'topics' | 'generating' | 'done';

export default function AIGenerate() {
  const [open, setOpen] = React.useState(false);
  const [domain, setDomain] = React.useState('');
  const [step, setStep] = React.useState<Step>('input');
  const [topics, setTopics] = React.useState<Topic[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [generatedPost, setGeneratedPost] =
    React.useState<GeneratedPost | null>(null);
  const [loading, setLoading] = React.useState(false);

  const findTrendingTopics = useAction(api.ai.findTrendingTopics);
  const generatePost = useAction(api.ai.generatePost);
  const allTopics = useQuery(api.topics.list);

  const recentDomains = React.useMemo(() => {
    if (!allTopics) return [];
    const seen = new Set<string>();
    return allTopics
      .filter((t) => {
        if (seen.has(t.domain)) return false;
        seen.add(t.domain);
        return true;
      })
      .slice(0, 5)
      .map((t) => t.domain);
  }, [allTopics]);

  const reset = () => {
    setDomain('');
    setStep('input');
    setTopics([]);
    setError(null);
    setGeneratedPost(null);
    setLoading(false);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const handleFindTopics = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await findTrendingTopics({ domain: domain.trim() });
      setTopics(result);
      setStep('topics');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to find topics');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePost = async (topic: Topic) => {
    setStep('generating');
    setError(null);

    try {
      const result = await generatePost({
        topic: topic.name,
        domain: domain.trim(),
      });
      setGeneratedPost(result);
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate post');
      setStep('topics');
    }
  };

  if (!open) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="fixed right-4 bottom-4 z-50 gap-1.5"
      >
        <Sparkles className="size-4" />
        AI Generate
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background border-border w-full max-w-lg rounded-lg border shadow-lg">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">AI Blog Generator</h2>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="p-4">
          {error && (
            <div className="bg-destructive/10 text-destructive mb-4 rounded-md p-3 text-sm">
              {error}
            </div>
          )}

          {step === 'input' && (
            <form onSubmit={handleFindTopics} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="domain-input" className="text-sm font-medium">
                  Enter a domain or niche
                </label>
                <Input
                  id="domain-input"
                  placeholder='e.g., "AI and Technology"'
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button type="submit" disabled={loading || !domain.trim()}>
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Finding topics...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    Find Trending Topics
                  </>
                )}
              </Button>
              {recentDomains.length > 0 && (
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs">
                    Recent searches
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {recentDomains.map((d) => (
                      <Button
                        key={d}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setDomain(d)}
                        disabled={loading}
                      >
                        {d}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </form>
          )}

          {step === 'topics' && (
            <div className="space-y-3">
              <p className="text-muted-foreground text-sm">
                Select a topic to generate a blog post:
              </p>
              {topics.map((topic, i) => (
                <button
                  key={i}
                  onClick={() => handleGeneratePost(topic)}
                  className={cn(
                    'hover:bg-accent border-border w-full rounded-md border p-3 text-left transition-colors',
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium">{topic.name}</span>
                    <span className="text-muted-foreground shrink-0 text-xs">
                      {topic.searchVolume}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {topic.reason}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {topic.trend}
                  </p>
                </button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={reset}
                className="mt-2"
              >
                Start over
              </Button>
            </div>
          )}

          {step === 'generating' && (
            <div className="flex flex-col items-center gap-3 py-8">
              <Loader2 className="text-muted-foreground size-8 animate-spin" />
              <p className="text-muted-foreground text-sm">
                Researching and writing your blog post...
              </p>
              <p className="text-muted-foreground text-xs">
                This may take up to a minute.
              </p>
            </div>
          )}

          {step === 'done' && generatedPost && (
            <div className="space-y-3">
              <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">
                Post generated successfully!
              </div>
              <div className="space-y-1">
                <p className="font-medium">{generatedPost.title}</p>
                <p className="text-muted-foreground text-sm">
                  {generatedPost.wordCount.toLocaleString()} words
                </p>
              </div>
              <p className="text-muted-foreground text-xs">
                Saved to Convex database.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={reset}>
                  Generate Another
                </Button>
                <Button variant="ghost" size="sm" onClick={handleClose}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
