import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { GitBranch, Users, Calendar, Database, Workflow, FileCode } from "lucide-react";

const templates = [
  {
    name: "Blank",
    icon: FileCode,
    code: ``,
  },
  {
    name: "Flowchart",
    icon: Workflow,
    code: `graph TD
    A[Start] --> B{Decision?}
    B -->|Yes| C[Perform action]
    B -->|No| D[Alternative path]
    C --> E[End]
    D --> E`,
  },
  {
    name: "Sequence Diagram",
    icon: Users,
    code: `sequenceDiagram
    participant A as Alice
    participant B as Bob
    A->>B: Hello Bob!
    B->>A: Hello Alice!
    A->>B: How are you?
    B->>A: Fine, thanks!`,
  },
  {
    name: "Gantt Chart",
    icon: Calendar,
    code: `gantt
    title Project Plan
    dateFormat YYYY-MM-DD
    section Phase 1
    Planning: 2024-01-01, 30d
    Design: 2024-02-01, 20d
    section Phase 2
    Development: 2024-02-15, 45d
    Testing: 2024-04-01, 15d`,
  },
  {
    name: "Git Diagram",
    icon: GitBranch,
    code: `gitGraph
    commit
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit`,
  },
  {
    name: "ER Diagram",
    icon: Database,
    code: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER {
        string name
        string email
    }
    ORDER {
        int orderNumber
        date orderDate
    }`,
  },
];

interface ExampleTemplatesProps {
  onSelectTemplate: (code: string) => void;
}

export const ExampleTemplates = ({ onSelectTemplate }: ExampleTemplatesProps) => {
  return (
    <Card className="p-4 bg-card border-border">
      <h2 className="text-lg font-semibold mb-3 text-foreground">Example Templates</h2>
      <ScrollArea className="w-full">
        <div className="flex gap-3 pb-2">
          {templates.map((template) => (
            <Button
              key={template.name}
              variant="outline"
              onClick={() => onSelectTemplate(template.code)}
              className="flex-shrink-0 gap-2 hover:bg-primary/10 hover:border-primary transition-all"
            >
              <template.icon className="h-4 w-4" />
              {template.name}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Card>
  );
};
