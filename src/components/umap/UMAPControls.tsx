import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface UMAPControlsProps {
  onReset?: () => void;
  showGrid?: boolean;
  onGridToggle?: (show: boolean) => void;
  className?: string;
}

export const UMAPControls = ({
  onReset,
  showGrid = true,
  onGridToggle,
  className,
}: UMAPControlsProps) => {
  return (
    <Card className={cn("border-border/50", className)}>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="show-grid" className="text-sm cursor-pointer">
              Show Grid
            </Label>
            <Switch
              id="show-grid"
              checked={showGrid}
              onCheckedChange={onGridToggle}
            />
          </div>

          {onReset && (
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                className="h-8 px-3"
                title="Reset View"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

