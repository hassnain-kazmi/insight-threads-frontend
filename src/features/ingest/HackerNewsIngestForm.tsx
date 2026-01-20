import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Loader2 } from "lucide-react";
import type { HackerNewsParams } from "@/types/api";

interface HackerNewsIngestFormProps {
  onSubmit: (params: HackerNewsParams) => void | Promise<void>;
  isLoading: boolean;
}

export const HackerNewsIngestForm = ({
  onSubmit,
  isLoading,
}: HackerNewsIngestFormProps) => {
  const [endpoint, setEndpoint] = useState<
    "topstories" | "newstories" | "beststories"
  >("topstories");
  const [limit, setLimit] = useState<number>(50);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit({
        endpoint,
        limit: limit > 0 ? limit : undefined,
      });
      setEndpoint("topstories");
      setLimit(50);
    } catch (error) {
      console.error("Failed to submit Hacker News ingestion:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="endpoint">Endpoint Type</Label>
        <Select
          value={endpoint}
          onValueChange={(value) => setEndpoint(value as typeof endpoint)}
        >
          <SelectTrigger id="endpoint">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="topstories">Top Stories</SelectItem>
            <SelectItem value="newstories">New Stories</SelectItem>
            <SelectItem value="beststories">Best Stories</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Select the Hacker News feed type to fetch
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="limit">Limit (optional)</Label>
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
          Maximum number of posts to fetch (default: 50)
        </p>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
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
