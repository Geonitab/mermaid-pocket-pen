import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCode, Eye, Download, Copy, Check, Upload, AlertCircle } from "lucide-react";
import { MermaidViewer } from "./MermaidViewer";
import { ExampleTemplates } from "./ExampleTemplates";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  const [syntaxError, setSyntaxError] = useState<{ line?: number; message: string } | null>(null);
  
  const lineNumbers = code.split('\n').map((_, i) => i + 1);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTemplateSelect = (template: string) => {
    setCode(template);
    toast.success("Template loaded!");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.mmd')) {
        toast.error("Please upload a .mmd file");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCode(content);
        toast.success("File loaded successfully!");
      };
      reader.onerror = () => {
        toast.error("Failed to read file");
      };
      reader.readAsText(file);
    }
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
            Create diagrams with simple text syntax
          </p>
        </div>

        {/* Templates */}
        <ExampleTemplates onSelectTemplate={handleTemplateSelect} />

        {/* Syntax Error Alert */}
        {syntaxError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Syntaxfel {syntaxError.line ? `på rad ${syntaxError.line}` : ''}</AlertTitle>
            <AlertDescription className="text-sm mt-2">
              {syntaxError.message}
            </AlertDescription>
          </Alert>
        )}

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
                    <h2 className="text-lg font-semibold text-foreground">Code</h2>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('file-upload-mobile')?.click()}
                        className="gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Upload
                      </Button>
                      <input
                        id="file-upload-mobile"
                        type="file"
                        accept=".mmd"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        className="gap-2"
                      >
                        {copied ? (
                          <>
                            <Check className="h-4 w-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex flex-col text-right text-muted-foreground font-mono text-sm pt-2 pr-2 select-none border-r border-border">
                      {lineNumbers.map((num) => (
                        <div 
                          key={num} 
                          className={`leading-6 ${syntaxError?.line === num ? 'text-destructive font-bold' : ''}`}
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                    <Textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="font-mono text-sm min-h-[400px] bg-secondary border-border focus:ring-primary flex-1"
                      placeholder="Write your Mermaid code here..."
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="preview" className="mt-0">
              <Card className="p-4 bg-card border-border shadow-glow">
                <h2 className="text-lg font-semibold mb-3 text-foreground">Preview</h2>
                <MermaidViewer code={code} onError={setSyntaxError} />
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
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('file-upload-desktop')?.click()}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload
                  </Button>
                  <input
                    id="file-upload-desktop"
                    type="file"
                    accept=".mmd"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex flex-col text-right text-muted-foreground font-mono text-sm pt-2 pr-2 select-none border-r border-border">
                  {lineNumbers.map((num) => (
                    <div 
                      key={num} 
                      className={`leading-6 ${syntaxError?.line === num ? 'text-destructive font-bold' : ''}`}
                    >
                      {num}
                    </div>
                  ))}
                </div>
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="font-mono text-sm min-h-[600px] bg-secondary border-border focus:ring-primary flex-1"
                  placeholder="Write your Mermaid code here..."
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border shadow-glow">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Preview</h2>
            <MermaidViewer code={code} onError={setSyntaxError} />
          </Card>
        </div>
      </div>
    </div>
  );
};
