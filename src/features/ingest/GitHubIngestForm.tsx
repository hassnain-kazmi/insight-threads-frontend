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
import { Play, Loader2, Plus, X } from "lucide-react";
import type { GitHubParams, GitHubRepo } from "@/types/api";

interface GitHubIngestFormProps {
  onSubmit: (params: GitHubParams) => void | Promise<void>;
  isLoading: boolean;
}

export const GitHubIngestForm = ({
  onSubmit,
  isLoading,
}: GitHubIngestFormProps) => {
  const [repos, setRepos] = useState<GitHubRepo[]>([{ owner: "", repo: "" }]);
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

  const addRepo = () => {
    setRepos([...repos, { owner: "", repo: "" }]);
  };

  const removeRepo = (index: number) => {
    if (repos.length > 1) {
      setRepos(repos.filter((_, i) => i !== index));
    }
  };

  const updateRepo = (
    index: number,
    field: "owner" | "repo",
    value: string
  ) => {
    const updated = [...repos];
    updated[index] = { ...updated[index], [field]: value };
    setRepos(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validRepos = repos.filter(
      (r) => r.owner && r.owner.length > 0 && r.repo && r.repo.length > 0
    );

    if (validRepos.length === 0) {
      return;
    }

    try {
      await Promise.resolve(
        onSubmit({
          repos: validRepos,
          include_commits: includeCommits,
          include_issues: includeIssues,
          include_prs: includePRs,
          include_releases: includeReleases,
          limit_per_type: limitPerType > 0 ? limitPerType : undefined,
          commit_since: commitSince.trim() || undefined,
          issue_state: issueState,
          pr_state: prState,
        })
      );
      setRepos([{ owner: "", repo: "" }]);
      setIncludeCommits(true);
      setIncludeIssues(true);
      setIncludePRs(true);
      setIncludeReleases(true);
      setLimitPerType(50);
      setCommitSince("");
      setIssueState("all");
      setPrState("all");
    } catch {}
  };

  const isValid =
    repos.some((r) => r.owner && r.repo) &&
    repos.every((r) => !r.owner || (r.owner && r.repo));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Repositories *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addRepo}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Repository
          </Button>
        </div>
        <div className="space-y-3">
          {repos.map((repo, index) => (
            <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2">
              <div className="space-y-1.5">
                <Input
                  type="text"
                  placeholder="microsoft"
                  value={repo.owner}
                  onChange={(e) => updateRepo(index, "owner", e.target.value)}
                  required={index === 0}
                />
                <p className="text-xs text-muted-foreground">Owner</p>
              </div>
              <div className="space-y-1.5">
                <Input
                  type="text"
                  placeholder="vscode"
                  value={repo.repo}
                  onChange={(e) => updateRepo(index, "repo", e.target.value)}
                  required={index === 0}
                />
                <p className="text-xs text-muted-foreground">Repository</p>
              </div>
              <div className="flex items-end">
                {repos.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRepo(index)}
                    className="h-10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Add one or more repositories to ingest. Each repository must have both
          owner and repo specified.
        </p>
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
