import { nanoid } from "nanoid";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { DecisionWheel } from "@/types/decisions";

type WheelEditorProps = {
  wheel: DecisionWheel;
  onChange: (updater: (wheel: DecisionWheel) => DecisionWheel) => void;
};

export default function WheelEditor({ wheel, onChange }: WheelEditorProps) {
  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="wheel-title" className="text-sand-300 text-xs uppercase tracking-wider">
          Question
        </Label>
        <Input
          id="wheel-title"
          value={wheel.title}
          onChange={(e) =>
            onChange((w) => ({ ...w, title: e.target.value }))
          }
          className="mt-1.5 wec-input"
          placeholder="What should we decide?"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Switch
            id="hide-weights"
            checked={wheel.hideWeights}
            onCheckedChange={(checked) =>
              onChange((w) => ({ ...w, hideWeights: checked }))
            }
          />
          <Label htmlFor="hide-weights" className="text-sand-300 text-sm">
            Hide weights
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="no-repeats"
            checked={wheel.noRepeats}
            onCheckedChange={(checked) =>
              onChange((w) => ({ ...w, noRepeats: checked }))
            }
          />
          <Label htmlFor="no-repeats" className="text-sand-300 text-sm">
            No repeats
          </Label>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-sand-300 text-xs uppercase tracking-wider">
            Options
          </Label>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="text-cinnamon-400 hover:text-cinnamon-300 hover:bg-cinnamon-950/40 h-8"
            onClick={() =>
              onChange((w) => ({
                ...w,
                options: [
                  ...w.options,
                  {
                    id: nanoid(),
                    label: `Option ${w.options.length + 1}`,
                    weight: 1,
                  },
                ],
              }))
            }
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>

        <ul className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
          {wheel.options.map((option, index) => (
            <li
              key={option.id}
              className="flex items-center gap-2 rounded-md border border-[#3a2a1f] bg-[#231a14] px-2 py-2"
            >
              <GripVertical className="w-4 h-4 text-sand-700 shrink-0" aria-hidden />
              <Input
                value={option.label}
                onChange={(e) =>
                  onChange((w) => ({
                    ...w,
                    options: w.options.map((o) =>
                      o.id === option.id ? { ...o, label: e.target.value } : o,
                    ),
                  }))
                }
                className="wec-input h-9"
                aria-label={`Option ${index + 1} label`}
              />
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[10px] text-sand-500 uppercase">wt</span>
                <Input
                  type="number"
                  min={1}
                  max={99}
                  value={option.weight}
                  onChange={(e) =>
                    onChange((w) => ({
                      ...w,
                      options: w.options.map((o) =>
                        o.id === option.id
                          ? {
                              ...o,
                              weight: Math.max(1, Number(e.target.value) || 1),
                            }
                          : o,
                      ),
                    }))
                  }
                  className="wec-input h-9 w-16"
                  aria-label={`Option ${index + 1} weight`}
                />
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="text-sand-500 hover:text-red-400 h-8 w-8 shrink-0"
                disabled={wheel.options.length <= 2}
                onClick={() =>
                  onChange((w) => ({
                    ...w,
                    options: w.options.filter((o) => o.id !== option.id),
                  }))
                }
                aria-label={`Remove option ${option.label}`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
