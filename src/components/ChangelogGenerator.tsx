
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Download, GitBranch, User, Calendar, Zap } from 'lucide-react';

interface ChangelogEntry {
  version: string;
  date: string;
  author: string;
  type: 'major' | 'minor' | 'patch' | 'hotfix';
  changes: {
    added: string[];
    changed: string[];
    deprecated: string[];
    removed: string[];
    fixed: string[];
    security: string[];
  };
}

interface ChangelogGeneratorProps {
  botName: string;
  commands: string[];
  events: any[];
  currentVersion?: string;
}

const ChangelogGenerator = ({ botName, commands, events, currentVersion = '1.0.0' }: ChangelogGeneratorProps) => {
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateInitialChangelog();
  }, [commands, events]);

  const generateInitialChangelog = () => {
    const initialEntry: ChangelogEntry = {
      version: currentVersion,
      date: new Date().toISOString().split('T')[0],
      author: 'Bot Forge AI',
      type: 'major',
      changes: {
        added: [
          `Implementado ${commands.length} comandos principais`,
          `Configurado ${events.filter(e => e.enabled).length} eventos automáticos`,
          `Sistema de moderação configurado`,
          `Estrutura base do bot criada`
        ],
        changed: [],
        deprecated: [],
        removed: [],
        fixed: [],
        security: [
          'Implementadas validações de permissão',
          'Sistema de rate limiting configurado'
        ]
      }
    };

    setChangelog([initialEntry]);
  };

  const generateNewVersion = (changes: any) => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const lastVersion = changelog[0]?.version || '1.0.0';
      const [major, minor, patch] = lastVersion.split('.').map(Number);
      
      // Determine version bump type based on changes
      let newVersion = '';
      let changeType: 'major' | 'minor' | 'patch' | 'hotfix' = 'patch';
      
      if (changes.major) {
        newVersion = `${major + 1}.0.0`;
        changeType = 'major';
      } else if (changes.minor) {
        newVersion = `${major}.${minor + 1}.0`;
        changeType = 'minor';
      } else {
        newVersion = `${major}.${minor}.${patch + 1}`;
        changeType = 'patch';
      }

      const newEntry: ChangelogEntry = {
        version: newVersion,
        date: new Date().toISOString().split('T')[0],
        author: 'Bot Forge AI',
        type: changeType,
        changes: {
          added: changes.added || [],
          changed: changes.changed || [],
          deprecated: changes.deprecated || [],
          removed: changes.removed || [],
          fixed: changes.fixed || [],
          security: changes.security || []
        }
      };

      setChangelog(prev => [newEntry, ...prev]);
      setIsGenerating(false);
    }, 1500);
  };

  const exportChangelog = () => {
    const markdownContent = generateMarkdownChangelog();
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${botName.toLowerCase().replace(/\s+/g, '-')}-changelog.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateMarkdownChangelog = () => {
    let markdown = `# Changelog - ${botName}\n\n`;
    markdown += `Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.\n\n`;
    markdown += `O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),\n`;
    markdown += `e este projeto adere ao [Versionamento Semântico](https://semver.org/spec/v2.0.0.html).\n\n`;

    changelog.forEach(entry => {
      markdown += `## [${entry.version}] - ${entry.date}\n\n`;
      markdown += `**Autor:** ${entry.author}\n`;
      markdown += `**Tipo:** ${entry.type.toUpperCase()}\n\n`;

      if (entry.changes.added.length > 0) {
        markdown += `### ✨ Adicionado\n`;
        entry.changes.added.forEach(change => {
          markdown += `- ${change}\n`;
        });
        markdown += `\n`;
      }

      if (entry.changes.changed.length > 0) {
        markdown += `### 🔄 Alterado\n`;
        entry.changes.changed.forEach(change => {
          markdown += `- ${change}\n`;
        });
        markdown += `\n`;
      }

      if (entry.changes.fixed.length > 0) {
        markdown += `### 🐛 Corrigido\n`;
        entry.changes.fixed.forEach(change => {
          markdown += `- ${change}\n`;
        });
        markdown += `\n`;
      }

      if (entry.changes.removed.length > 0) {
        markdown += `### ❌ Removido\n`;
        entry.changes.removed.forEach(change => {
          markdown += `- ${change}\n`;
        });
        markdown += `\n`;
      }

      if (entry.changes.deprecated.length > 0) {
        markdown += `### ⚠️ Descontinuado\n`;
        entry.changes.deprecated.forEach(change => {
          markdown += `- ${change}\n`;
        });
        markdown += `\n`;
      }

      if (entry.changes.security.length > 0) {
        markdown += `### 🔒 Segurança\n`;
        entry.changes.security.forEach(change => {
          markdown += `- ${change}\n`;
        });
        markdown += `\n`;
      }

      markdown += `---\n\n`;
    });

    return markdown;
  };

  const getVersionTypeColor = (type: string) => {
    switch (type) {
      case 'major': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'minor': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'patch': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'hotfix': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const simulateUpdate = () => {
    const sampleChanges = {
      minor: true,
      added: [
        'Novo comando de música adicionado',
        'Sistema de XP implementado',
        'Integração com API externa'
      ],
      changed: [
        'Melhorado sistema de moderação',
        'Otimizada performance dos comandos'
      ],
      fixed: [
        'Corrigido bug no comando de ban',
        'Resolvido problema de timeout'
      ]
    };
    
    generateNewVersion(sampleChanges);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-discord" />
            Changelog Automático
          </CardTitle>
          <p className="text-muted-foreground">
            Histórico completo de versões e alterações do {botName}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <Badge variant="outline" className="bg-discord/20 text-discord border-discord/50">
                Versão Atual: {changelog[0]?.version || currentVersion}
              </Badge>
              <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50">
                {changelog.length} Versões
              </Badge>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={simulateUpdate}
                disabled={isGenerating}
                className="border-border"
              >
                <Zap className="mr-2 h-4 w-4" />
                {isGenerating ? 'Gerando...' : 'Simular Update'}
              </Button>
              
              <Button 
                onClick={exportChangelog}
                className="bg-gradient-discord hover:bg-discord-dark text-white"
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar MD
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Changelog Entries */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle>Histórico de Versões</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] w-full">
            <div className="space-y-6">
              {changelog.map((entry, index) => (
                <div key={entry.version} className="relative">
                  {/* Timeline line */}
                  {index < changelog.length - 1 && (
                    <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-border"></div>
                  )}
                  
                  <div className="flex space-x-4">
                    {/* Version Badge */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-discord rounded-full flex items-center justify-center">
                        <GitBranch className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="bg-background border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold">v{entry.version}</h3>
                            <Badge className={getVersionTypeColor(entry.type)}>
                              {entry.type.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <User className="mr-1 h-3 w-3" />
                              {entry.author}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              {new Date(entry.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          {entry.changes.added.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-green-400 mb-1">✨ Adicionado</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                                {entry.changes.added.map((change, i) => (
                                  <li key={i}>{change}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {entry.changes.changed.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-blue-400 mb-1">🔄 Alterado</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                                {entry.changes.changed.map((change, i) => (
                                  <li key={i}>{change}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {entry.changes.fixed.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-orange-400 mb-1">🐛 Corrigido</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                                {entry.changes.fixed.map((change, i) => (
                                  <li key={i}>{change}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {entry.changes.security.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-red-400 mb-1">🔒 Segurança</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                                {entry.changes.security.map((change, i) => (
                                  <li key={i}>{change}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangelogGenerator;