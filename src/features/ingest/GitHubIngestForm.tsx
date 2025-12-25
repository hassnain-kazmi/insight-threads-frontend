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
import { Checkbox } from "@/components/ui/checkbox";
import { Play, Loader2 } from "lucide-react";
import type { GitHubParams } from "@/types/api";

interface GitHubIngestFormProps {
  onSubmit: (params: GitHubParams) => void | Promise<void>;
  isLoading: boolean;
}

export const GitHubIngestForm = ({
  onSubmit,
  isLoading,
}: GitHubIngestFormProps) => {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [includeCommits, setIncludeCommits] = useState(true);
  const [includeIssues, setIncludeIssues] = useState(true);
  const [includePRs, setIncludePRs] = useState(true);
  const [includeReleases, setIncludeReleases] = useState(true);
  const [limitPerType, setLimitPerType] = useState<number>(50);
  const [commitSince, setCommitSince] = useState("");
  const [issueState, setIssueState] = useState<"open" | "closed" | "all">(
    "all"
  );
  const [prState, setPrState] = useState<"open" | "closed" | "all">("all");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!owner.trim() || !repo.trim()) {
      return;
    }
    try {
      await Promise.resolve(
        onSubmit({
          owner: owner.trim(),
          repo: repo.trim(),
          include_commits: includeCommits,
          include_issues: includeIssues,
          include_prs: includePRs,
          include_releases: includeReleases,
          limit_per_type: limitPerType > 0 ? limitPerType : undefined,
          commit_since: commitSince || undefined,
          issue_state: issueState,
          pr_state: prState,
        })
      );
      setOwner("");
      setRepo("");
      setIncludeCommits(true);
      setIncludeIssues(true);
      setIncludePRs(true);
      setIncludeReleases(true);
      setLimitPerType(50);
      setCommitSince("");
      setIssueState("all");
      setPrState("all");
    } catch {
      // Error handled by parent mutation
    }
  };

  const isValid = owner.trim() !== "" && repo.trim() !== "";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="owner">Owner *</Label>
          <Input
            id="owner"
            type="text"
            placeholder="facebook"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">
            Repository owner (user or organization)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="repo">Repository *</Label>
          <Input
            id="repo"
            type="text"
            placeholder="react"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">Repository name</p>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Include Content Types</Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-commits"
              checked={includeCommits}
              onCheckedChange={(checked) => setIncludeCommits(checked === true)}
            />
            <Label
              htmlFor="include-commits"
              className="font-normal cursor-pointer"
            >
              Commits
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-issues"
              checked={includeIssues}
              onCheckedChange={(checked) => setIncludeIssues(checked === true)}
            />
            <Label
              htmlFor="include-issues"
              className="font-normal cursor-pointer"
            >
              Issues
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-prs"
              checked={includePRs}
              onCheckedChange={(checked) => setIncludePRs(checked === true)}
            />
            <Label htmlFor="include-prs" className="font-normal cursor-pointer">
              Pull Requests
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-releases"
              checked={includeReleases}
              onCheckedChange={(checked) =>
                setIncludeReleases(checked === true)
              }
            />
            <Label
              htmlFor="include-releases"
              className="font-normal cursor-pointer"
            >
              Releases
            </Label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="limit-per-type">Limit per type (optional)</Label>
          <Input
            id="limit-per-type"
            type="number"
            min="1"
            max="500"
            value={limitPerType}
            onChange={(e) => setLimitPerType(parseInt(e.target.value) || 50)}
            placeholder="50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="commit-since">Commits since (optional)</Label>
          <Input
            id="commit-since"
            type="text"
            placeholder="2024-01-01T00:00:00Z"
            value={commitSince}
            onChange={(e) => setCommitSince(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            ISO 8601 timestamp (e.g., 2024-01-01T00:00:00Z)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="issue-state">Issue State</Label>
          <Select
            value={issueState}
            onValueChange={(value) => setIssueState(value as typeof issueState)}
          >
            <SelectTrigger id="issue-state">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pr-state">PR State</Label>
          <Select
            value={prState}
            onValueChange={(value) => setPrState(value as typeof prState)}
          >
            <SelectTrigger id="pr-state">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
