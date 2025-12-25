import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DragItem {
  id: string;
  content: React.ReactNode;
}

interface DragAndDropProps {
  items: DragItem[];
  onOrderChange?: (items: DragItem[]) => void;
  correctOrder?: string[]; // IDs na ordem correta
  showFeedback?: boolean;
  className?: string;
}

function SortableItem({ id, content }: { id: string; content: React.ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "p-4 mb-2 flex items-center gap-3 cursor-move touch-none",
        isDragging && "opacity-50 shadow-lg scale-105"
      )}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0" />
      <div className="flex-1">{content}</div>
    </Card>
  );
}

export function DragAndDrop({
  items: initialItems,
  onOrderChange,
  correctOrder,
  showFeedback = false,
  className,
}: DragAndDropProps) {
  const [items, setItems] = useState(initialItems);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Permite scroll sem ativar drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        onOrderChange?.(newItems);
        return newItems;
      });
    }
  };

  const isCorrectOrder = () => {
    if (!correctOrder) return null;
    return items.every((item, index) => item.id === correctOrder[index]);
  };

  const getItemFeedback = (itemId: string, index: number) => {
    if (!showFeedback || !correctOrder) return null;
    const isCorrect = correctOrder[index] === itemId;
    return isCorrect ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50";
  };

  return (
    <div className={cn("w-full", className)}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "transition-all duration-300",
                showFeedback && getItemFeedback(item.id, index)
              )}
            >
              <SortableItem id={item.id} content={item.content} />
            </div>
          ))}
        </SortableContext>
      </DndContext>

      {showFeedback && correctOrder && (
        <div className="mt-4 p-4 rounded-lg bg-muted">
          {isCorrectOrder() ? (
            <p className="text-green-600 font-semibold">✅ Ordem correta! Parabéns!</p>
          ) : (
            <p className="text-amber-600 font-semibold">
              ⚠️ Ainda não está na ordem correta. Continue tentando!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
