import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { GitBranch, Users, Calendar, Database, Workflow } from "lucide-react";

const templates = [
  {
    name: "Flödesschema",
    icon: Workflow,
    code: `graph TD
    A[Start] --> B{Beslut?}
    B -->|Ja| C[Utför handling]
    B -->|Nej| D[Alternativ väg]
    C --> E[Slut]
    D --> E`,
  },
  {
    name: "Sekvensdiagram",
    icon: Users,
    code: `sequenceDiagram
    participant A as Alice
    participant B as Bob
    A->>B: Hej Bob!
    B->>A: Hej Alice!
    A->>B: Hur mår du?
    B->>A: Bra, tack!`,
  },
  {
    name: "Gantt-schema",
    icon: Calendar,
    code: `gantt
    title Projektplan
    dateFormat YYYY-MM-DD
    section Fas 1
    Planering: 2024-01-01, 30d
    Design: 2024-02-01, 20d
    section Fas 2
    Utveckling: 2024-02-15, 45d
    Testning: 2024-04-01, 15d`,
  },
  {
    name: "Git-diagram",
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
    name: "ER-diagram",
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
      <h2 className="text-lg font-semibold mb-3 text-foreground">Exempel-mallar</h2>
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
