import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCode, Eye, Download, Copy, Check } from "lucide-react";
import { MermaidViewer } from "./MermaidViewer";
import { ExampleTemplates } from "./ExampleTemplates";
import { toast } from "sonner";

const defaultDiagram = `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E`;

export const MermaidEditor = () => {
  const [code, setCode] = useState(defaultDiagram);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Kopierat till urklipp!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTemplateSelect = (template: string) => {
    setCode(template);
    toast.success("Mall laddad!");
  };

  return (
    <div className="min-h-screen bg-gradient-accent p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Mermaid Editor
          </h1>
          <p className="text-muted-foreground text-lg">
            Skapa diagram med enkel textsyntax
          </p>
        </div>

        {/* Templates */}
        <ExampleTemplates onSelectTemplate={handleTemplateSelect} />

        {/* Main Content - Mobile Tabs, Desktop Split */}
        <div className="block md:hidden">
          <Tabs defaultValue="editor" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="editor" className="gap-2">
                <FileCode className="h-4 w-4" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor" className="mt-0">
              <Card className="p-4 bg-card border-border shadow-glow">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-foreground">Kod</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="gap-2"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" />
                          Kopierat
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Kopiera
                        </>
                      )}
                    </Button>
                  </div>
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="font-mono text-sm min-h-[400px] bg-secondary border-border focus:ring-primary"
                    placeholder="Skriv din Mermaid-kod här..."
                  />
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="preview" className="mt-0">
              <Card className="p-4 bg-card border-border shadow-glow">
                <h2 className="text-lg font-semibold mb-3 text-foreground">Preview</h2>
                <MermaidViewer code={code} />
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop Split View */}
        <div className="hidden md:grid md:grid-cols-2 gap-6">
          <Card className="p-6 bg-card border-border shadow-glow">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-foreground">Editor</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Kopierat
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Kopiera
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="font-mono text-sm min-h-[600px] bg-secondary border-border focus:ring-primary"
                placeholder="Skriv din Mermaid-kod här..."
              />
            </div>
          </Card>

          <Card className="p-6 bg-card border-border shadow-glow">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Preview</h2>
            <MermaidViewer code={code} />
          </Card>
        </div>
      </div>
    </div>
  );
};
