"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import { GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  addTimelineTaskAction,
  deleteTimelineTaskAction,
  reorderTimelineTasksAction,
  updateTimelineTaskAction,
} from "@/lib/actions/timeline";
import { cn } from "@/lib/utils";
import type { TimelineTask } from "@/db/schema";

function SortableTask({
  task,
  now,
  onRefresh,
}: {
  task: TimelineTask;
  now: number;
  onRefresh: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const overdue =
    task.status !== "done" &&
    task.dueDate &&
    new Date(task.dueDate).getTime() < now;

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-start gap-3 rounded-xl border bg-[#141418]/90 p-4 backdrop-blur-md transition-colors",
        overdue ? "border-[var(--overdue)]/60 shadow-[0_0_15px_rgba(226,138,50,0.15)]" : "border-[rgba(197,160,89,0.22)]",
      )}
    >
      <button
        type="button"
        className="mt-1 cursor-grab text-[#C5A059] hover:text-[#DFB15B]"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-[#FCFBF7]">{task.title}</p>
          {task.milestone && <Badge>Milestone</Badge>}
          {overdue && (
            <Badge className="border-[var(--overdue)] text-[var(--overdue)] bg-[var(--overdue)]/10">
              Overdue
            </Badge>
          )}
        </div>
        {task.description && (
          <p className="mt-1 text-xs text-[#948B79]">{task.description}</p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
          <select
            className="rounded border border-[rgba(197,160,89,0.3)] bg-[#101014] px-2.5 py-1 text-xs text-[#FCFBF7] focus:outline-none focus:border-[#C5A059]"
            value={task.status}
            onChange={async (e) => {
              await updateTimelineTaskAction(task.id, {
                status: e.target.value as TimelineTask["status"],
              });
              onRefresh();
            }}
          >
            <option value="todo">To do</option>
            <option value="in_progress">In progress</option>
            <option value="done">Completed</option>
          </select>
          <span className="text-[#948B79]">
            {task.dueDate
              ? `Due ${format(new Date(task.dueDate), "MMM d, yyyy")}`
              : "No due date"}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-[#948B79] hover:text-red-400"
            onClick={async () => {
              await deleteTimelineTaskAction(task.id);
              onRefresh();
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    </li>
  );
}

export function TimelineBoard({
  eventId,
  tasks: initialTasks,
}: {
  eventId: string;
  tasks: TimelineTask[];
}) {
  const router = useRouter();
  const [tasks, setTasks] = useState(initialTasks);
  const [prevInitialTasks, setPrevInitialTasks] = useState(initialTasks);
  if (prevInitialTasks !== initialTasks) {
    setPrevInitialTasks(initialTasks);
    setTasks(initialTasks);
  }
  const [title, setTitle] = useState("");
  const sensors = useSensors(useSensor(PointerSensor));
  const [now] = useState(() => Date.now());

  function refresh() {
    router.refresh();
  }

  async function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = tasks.findIndex((t) => t.id === active.id);
    const newIndex = tasks.findIndex((t) => t.id === over.id);
    const next = arrayMove(tasks, oldIndex, newIndex);
    setTasks(next);
    await reorderTimelineTasksAction(
      eventId,
      next.map((t) => t.id),
    );
  }

  return (
    <div className="space-y-6">
      <form
        className="flex flex-wrap gap-2 rounded-2xl border border-[rgba(197,160,89,0.22)] bg-[#141418]/80 p-4 backdrop-blur-md"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!title.trim()) return;
          await addTimelineTaskAction(eventId, {
            title: title.trim(),
            status: "todo",
            position: tasks.length,
          });
          setTitle("");
          refresh();
        }}
      >
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New milestone or task (e.g. Royal Florist Consultation)..."
          className="flex-1 min-w-[200px]"
        />
        <Button type="submit">Add Task</Button>
      </form>

      {tasks.length === 0 ? (
        <p className="text-sm text-[#948B79] text-center py-12">No timeline tasks yet.</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={tasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="space-y-3">
              {tasks.map((task) => (
                <SortableTask key={task.id} task={task} now={now} onRefresh={refresh} />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
