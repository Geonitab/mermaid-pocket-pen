/**
 * Formats and structures Mermaid code by organizing actors and connections
 */
export function formatMermaidCode(code: string): string {
  if (!code.trim()) return code;

  const lines = code.split('\n');
  const firstLine = lines[0].trim();
  
  // Detect diagram type
  if (firstLine.startsWith('graph') || firstLine.startsWith('flowchart')) {
    return formatFlowchart(lines);
  } else if (firstLine.startsWith('sequenceDiagram')) {
    return formatSequenceDiagram(lines);
  } else if (firstLine.startsWith('classDiagram')) {
    return formatClassDiagram(lines);
  } else if (firstLine.startsWith('erDiagram')) {
    return formatERDiagram(lines);
  } else if (firstLine.startsWith('gitGraph')) {
    return formatGitGraph(lines);
  } else if (firstLine.startsWith('gantt')) {
    return formatGantt(lines);
  }
  
  // Default: just clean up whitespace
  return lines.map(line => line.trim()).filter(line => line).join('\n');
}

function formatFlowchart(lines: string[]): string {
  const header = lines[0].trim();
  const rest = lines.slice(1);
  
  // Separate node definitions from connections
  const nodeDefinitions: string[] = [];
  const connections: string[] = [];
  const comments: string[] = [];
  
  rest.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;
    
    if (trimmed.startsWith('%%')) {
      comments.push(trimmed);
    } else if (trimmed.includes('-->') || trimmed.includes('---') || trimmed.includes('-.->') || trimmed.includes('==>') || trimmed.includes('--o') || trimmed.includes('--x')) {
      connections.push(trimmed);
    } else {
      nodeDefinitions.push(trimmed);
    }
  });
  
  const formatted = [header];
  
  if (comments.length > 0) {
    formatted.push(...comments, '');
  }
  
  if (nodeDefinitions.length > 0) {
    formatted.push(...nodeDefinitions, '');
  }
  
  if (connections.length > 0) {
    formatted.push(...connections);
  }
  
  return formatted.join('\n');
}

function formatSequenceDiagram(lines: string[]): string {
  const header = lines[0].trim();
  const rest = lines.slice(1);
  
  const participants: string[] = [];
  const interactions: string[] = [];
  const comments: string[] = [];
  
  rest.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;
    
    if (trimmed.startsWith('%%')) {
      comments.push(trimmed);
    } else if (trimmed.startsWith('participant')) {
      participants.push(trimmed);
    } else {
      interactions.push(trimmed);
    }
  });
  
  const formatted = [header];
  
  if (comments.length > 0) {
    formatted.push(...comments, '');
  }
  
  if (participants.length > 0) {
    formatted.push(...participants, '');
  }
  
  if (interactions.length > 0) {
    formatted.push(...interactions);
  }
  
  return formatted.join('\n');
}

function formatClassDiagram(lines: string[]): string {
  const header = lines[0].trim();
  const rest = lines.slice(1);
  
  const classes: string[] = [];
  const relationships: string[] = [];
  let currentClass: string[] = [];
  let inClass = false;
  
  rest.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;
    
    if (trimmed.startsWith('class ')) {
      if (inClass && currentClass.length > 0) {
        classes.push(currentClass.join('\n'));
        currentClass = [];
      }
      inClass = true;
      currentClass.push(trimmed);
    } else if (trimmed === '}' && inClass) {
      currentClass.push(trimmed);
      classes.push(currentClass.join('\n'));
      currentClass = [];
      inClass = false;
    } else if (inClass) {
      currentClass.push(`    ${trimmed}`);
    } else if (trimmed.includes('<|--') || trimmed.includes('-->') || trimmed.includes('--')) {
      relationships.push(trimmed);
    }
  });
  
  if (currentClass.length > 0) {
    classes.push(currentClass.join('\n'));
  }
  
  const formatted = [header];
  
  if (classes.length > 0) {
    formatted.push(...classes, '');
  }
  
  if (relationships.length > 0) {
    formatted.push(...relationships);
  }
  
  return formatted.join('\n');
}

function formatERDiagram(lines: string[]): string {
  const header = lines[0].trim();
  const rest = lines.slice(1);
  
  const entities: string[] = [];
  const relationships: string[] = [];
  let currentEntity: string[] = [];
  let inEntity = false;
  
  rest.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;
    
    if (trimmed.match(/^[A-Z_]+\s*{$/)) {
      if (currentEntity.length > 0) {
        entities.push(currentEntity.join('\n'));
        currentEntity = [];
      }
      inEntity = true;
      currentEntity.push(trimmed);
    } else if (trimmed === '}' && inEntity) {
      currentEntity.push(trimmed);
      entities.push(currentEntity.join('\n'));
      currentEntity = [];
      inEntity = false;
    } else if (inEntity) {
      currentEntity.push(`    ${trimmed}`);
    } else if (trimmed.includes('||--') || trimmed.includes('}o--') || trimmed.includes('--o{')) {
      relationships.push(trimmed);
    }
  });
  
  if (currentEntity.length > 0) {
    entities.push(currentEntity.join('\n'));
  }
  
  const formatted = [header];
  
  if (relationships.length > 0) {
    formatted.push(...relationships, '');
  }
  
  if (entities.length > 0) {
    formatted.push(...entities);
  }
  
  return formatted.join('\n');
}

function formatGitGraph(lines: string[]): string {
  const header = lines[0].trim();
  const rest = lines.slice(1).map(line => line.trim()).filter(line => line);
  
  return [header, ...rest].join('\n');
}

function formatGantt(lines: string[]): string {
  const header = lines[0].trim();
  const rest = lines.slice(1);
  
  const metadata: string[] = [];
  const sections: string[] = [];
  let currentSection: string[] = [];
  
  rest.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;
    
    if (trimmed.startsWith('title') || trimmed.startsWith('dateFormat')) {
      metadata.push(trimmed);
    } else if (trimmed.startsWith('section')) {
      if (currentSection.length > 0) {
        sections.push(currentSection.join('\n'));
        currentSection = [];
      }
      currentSection.push(trimmed);
    } else {
      currentSection.push(`    ${trimmed}`);
    }
  });
  
  if (currentSection.length > 0) {
    sections.push(currentSection.join('\n'));
  }
  
  const formatted = [header];
  
  if (metadata.length > 0) {
    formatted.push(...metadata, '');
  }
  
  if (sections.length > 0) {
    formatted.push(...sections);
  }
  
  return formatted.join('\n');
}
