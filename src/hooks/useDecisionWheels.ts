import { useCallback, useEffect, useState } from "react";
import { nanoid } from "nanoid";
import type { DecisionOption, DecisionWheel } from "@/types/decisions";
import { DEFAULT_TEMPLATES } from "@/types/decisions";

const STORAGE_KEY = "wec-decisions-wheels-v1";

function createWheel(
  partial?: Partial<Omit<DecisionWheel, "id" | "createdAt" | "updatedAt">> & {
    options?: DecisionOption[];
  },
): DecisionWheel {
  const now = Date.now();
  return {
    id: nanoid(),
    title: partial?.title ?? "New Decision",
    options:
      partial?.options?.map((o) => ({
        ...o,
        id: o.id || nanoid(),
        weight: Math.max(1, o.weight || 1),
      })) ?? [
        { id: nanoid(), label: "Option A", weight: 1 },
        { id: nanoid(), label: "Option B", weight: 1 },
        { id: nanoid(), label: "Option C", weight: 1 },
      ],
    hideWeights: partial?.hideWeights ?? false,
    noRepeats: partial?.noRepeats ?? false,
    createdAt: now,
    updatedAt: now,
  };
}

function loadWheels(): DecisionWheel[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [createWheel(DEFAULT_TEMPLATES[0])];
    const parsed = JSON.parse(raw) as DecisionWheel[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [createWheel(DEFAULT_TEMPLATES[0])];
    }
    return parsed;
  } catch {
    return [createWheel(DEFAULT_TEMPLATES[0])];
  }
}

export function useDecisionWheels() {
  const [wheels, setWheels] = useState<DecisionWheel[]>(() => {
    if (typeof window === "undefined") return [];
    return loadWheels();
  });
  const [activeId, setActiveId] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return loadWheels()[0]?.id ?? "";
  });
  const [excludedIds, setExcludedIds] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wheels));
  }, [wheels]);

  const activeWheel = wheels.find((w) => w.id === activeId) ?? wheels[0];

  const updateActive = useCallback(
    (updater: (wheel: DecisionWheel) => DecisionWheel) => {
      setWheels((prev) =>
        prev.map((w) => {
          if (w.id !== (activeId || prev[0]?.id)) return w;
          return { ...updater(w), updatedAt: Date.now() };
        }),
      );
    },
    [activeId],
  );

  const addWheel = useCallback(
    (template?: (typeof DEFAULT_TEMPLATES)[number]) => {
      const wheel = createWheel(template);
      setWheels((prev) => [wheel, ...prev]);
      setActiveId(wheel.id);
      setExcludedIds([]);
      return wheel;
    },
    [],
  );

  const deleteWheel = useCallback(
    (id: string) => {
      setWheels((prev) => {
        const next = prev.filter((w) => w.id !== id);
        if (next.length === 0) {
          const fresh = createWheel(DEFAULT_TEMPLATES[0]);
          setActiveId(fresh.id);
          return [fresh];
        }
        if (activeId === id) setActiveId(next[0].id);
        return next;
      });
      setExcludedIds([]);
    },
    [activeId],
  );

  const selectWheel = useCallback((id: string) => {
    setActiveId(id);
    setExcludedIds([]);
  }, []);

  const resetExclusions = useCallback(() => setExcludedIds([]), []);

  const markExcluded = useCallback((optionId: string) => {
    setExcludedIds((prev) =>
      prev.includes(optionId) ? prev : [...prev, optionId],
    );
  }, []);

  return {
    wheels,
    activeWheel,
    activeId: activeWheel?.id ?? "",
    excludedIds,
    addWheel,
    deleteWheel,
    selectWheel,
    updateActive,
    resetExclusions,
    markExcluded,
  };
}
