import { useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eraser, Palette, Undo, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface FreeCanvasProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  onDrawingChange?: (dataUrl: string) => void;
  className?: string;
}

export function FreeCanvas({
  width = 600,
  height = 400,
  backgroundColor = "#ffffff",
  onDrawingChange,
  className,
}: FreeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(3);
  const [history, setHistory] = useState<string[]>([]);

  const colors = [
    "#000000", // Preto
    "#FF0000", // Vermelho
    "#00FF00", // Verde
    "#0000FF", // Azul
    "#FFFF00", // Amarelo
    "#FF00FF", // Magenta
    "#00FFFF", // Ciano
    "#FFA500", // Laranja
  ];

  const lineWidths = [2, 3, 5, 8];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Inicializar canvas com fundo branco
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
    
    // Salvar estado inicial
    saveToHistory();
  }, [width, height, backgroundColor]);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL();
    setHistory((prev) => [...prev, dataUrl]);
    onDrawingChange?.(dataUrl);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
    saveToHistory();
  };

  const undo = () => {
    if (history.length <= 1) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Remove estado atual
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);

    // Restaura estado anterior
    const img = new Image();
    img.src = newHistory[newHistory.length - 1];
    img.onload = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0);
    };
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `desenho-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <Card className={cn("p-4 space-y-4", className)}>
      <div className="flex flex-wrap gap-4 items-center justify-between">
        {/* Cores */}
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-muted-foreground" />
          <div className="flex gap-2">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={cn(
                  "w-8 h-8 rounded-full border-2 transition-all hover:scale-110",
                  color === c ? "border-primary scale-110" : "border-muted"
                )}
                style={{ backgroundColor: c }}
                aria-label={`Cor ${c}`}
              />
            ))}
          </div>
        </div>

        {/* Espessura */}
        <div className="flex items-center gap-2">
          {lineWidths.map((w) => (
            <button
              key={w}
              onClick={() => setLineWidth(w)}
              className={cn(
                "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110",
                lineWidth === w ? "border-primary bg-primary/10" : "border-muted"
              )}
              aria-label={`Espessura ${w}px`}
            >
              <div
                className="rounded-full bg-current"
                style={{ width: w, height: w }}
              />
            </button>
          ))}
        </div>

        {/* Ações */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={undo}
            disabled={history.length <= 1}
            title="Desfazer"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={clearCanvas} title="Limpar">
            <Eraser className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={downloadCanvas} title="Baixar">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="border border-border rounded-lg cursor-crosshair touch-none w-full"
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </Card>
  );
}
