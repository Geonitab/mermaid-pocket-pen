import { useEffect, useRef } from "react";
import mermaid from "mermaid";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface MermaidViewerProps {
  code: string;
  onError?: (error: { line?: number; message: string } | null) => void;
}

export const MermaidViewer = ({ code, onError }: MermaidViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "dark",
      securityLevel: "loose",
      fontFamily: "inherit",
    });
  }, []);

  useEffect(() => {
    if (containerRef.current && code) {
      // Debounce the rendering to avoid checking syntax on every keystroke
      const timeoutId = setTimeout(() => {
        const renderDiagram = async () => {
          try {
            containerRef.current!.innerHTML = "";
            const { svg } = await mermaid.render(`mermaid-${Date.now()}`, code);
            containerRef.current!.innerHTML = svg;
            onError?.(null);
          } catch (error: any) {
            console.error("Mermaid rendering error:", error);
            
            // Extract line number and message from error
            let lineNumber: number | undefined;
            let errorMessage = "Please check your Mermaid code and try again.";
            
            if (error?.message) {
              errorMessage = error.message;
              // Try to extract line number from error message
              const lineMatch = error.message.match(/line (\d+)/i);
              if (lineMatch) {
                lineNumber = parseInt(lineMatch[1]);
              }
            }
            
            onError?.({ line: lineNumber, message: errorMessage });
            
            containerRef.current!.innerHTML = `
              <div class="text-destructive p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <p class="font-semibold mb-2">Syntax Error</p>
                <p class="text-sm opacity-80">Please check your Mermaid code and try again.</p>
              </div>
            `;
          }
        };
        renderDiagram();
      }, 600);

      return () => clearTimeout(timeoutId);
    }
  }, [code, onError]);

  const handleExport = async (format: "svg" | "png") => {
    try {
      const svgElement = containerRef.current?.querySelector("svg");
      if (!svgElement) {
        toast.error("No diagram to export");
        return;
      }

      if (format === "svg") {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const blob = new Blob([svgData], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "diagram.svg";
        link.click();
        URL.revokeObjectURL(url);
        toast.success("SVG downloaded!");
      } else {
        // PNG export
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const img = new Image();
        
        img.onload = () => {
          canvas.width = img.width * 2;
          canvas.height = img.height * 2;
          ctx?.scale(2, 2);
          ctx?.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = "diagram.png";
              link.click();
              URL.revokeObjectURL(url);
              toast.success("PNG downloaded!");
            }
          });
        };
        
        img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export diagram");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleExport("svg")}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          SVG
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleExport("png")}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          PNG
        </Button>
      </div>
      <div
        ref={containerRef}
        className="bg-secondary/50 p-6 rounded-lg border border-border min-h-[400px] flex items-center justify-center overflow-auto"
      />
    </div>
  );
};
