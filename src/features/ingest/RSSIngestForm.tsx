import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, Play, Loader2 } from "lucide-react";
import type { RSSParams } from "@/types/api";

interface RSSIngestFormProps {
  onSubmit: (params: RSSParams) => void | Promise<void>;
  isLoading: boolean;
}

export const RSSIngestForm = ({ onSubmit, isLoading }: RSSIngestFormProps) => {
  const [feedUrls, setFeedUrls] = useState<string[]>([""]);
  const [limit, setLimit] = useState<number>(50);

  const addFeedUrl = () => {
    setFeedUrls([...feedUrls, ""]);
  };

  const removeFeedUrl = (index: number) => {
    if (feedUrls.length > 1) {
      setFeedUrls(feedUrls.filter((_, i) => i !== index));
    }
  };

  const updateFeedUrl = (index: number, value: string) => {
    const updated = [...feedUrls];
    updated[index] = value;
    setFeedUrls(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validUrls = feedUrls.filter((url) => url.trim() !== "");
    if (validUrls.length === 0) {
      return;
    }
    try {
      await onSubmit({
        feed_urls: validUrls,
        limit: limit > 0 ? limit : undefined,
      });
      setFeedUrls([""]);
      setLimit(50);
    } catch (error) {
      console.error("Failed to submit RSS ingestion:", error);
    }
  };

  const isValid = feedUrls.some((url) => url.trim() !== "");

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="feed-urls">RSS Feed URLs</Label>
        <div className="space-y-2">
          {feedUrls.map((url, index) => (
            <div key={index} className="flex gap-2">
              <Input
                id={`feed-url-${index}`}
                type="url"
                placeholder="https://example.com/feed.xml"
                value={url}
                onChange={(e) => updateFeedUrl(index, e.target.value)}
                className="flex-1"
              />
              {feedUrls.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeFeedUrl(index)}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addFeedUrl}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Feed URL
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="limit">Limit per feed (optional)</Label>
        <Input
          id="limit"
          type="number"
          min="1"
          max="500"
          value={limit}
          onChange={(e) => setLimit(parseInt(e.target.value) || 50)}
          placeholder="50"
        />
        <p className="text-xs text-muted-foreground">
          Maximum number of entries to fetch per feed (default: 50)
        </p>
      </div>

      <Button type="submit" disabled={!isValid || isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Triggering...
          </>
        ) : (
          <>
            <Play className="h-4 w-4 mr-2" />
            Trigger Ingestion
          </>
        )}
      </Button>
    </form>
  );
};
