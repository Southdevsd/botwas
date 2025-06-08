import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GitBranch, Clock, Download, RotateCcw, Plus, GitCommit, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Version {
  id: string;
  version: string;
  description: string;
  timestamp: string;
  changes: string[];
  commands: string[];
  events: any[];
  files: Record<string, string>;
  author: string;
}

interface VersionControlProps {
  currentBot: {
    name: string;
    commands: string[];
    events: any[];
    files?: Record<string, string>;
  };
  onRestore: (version: Version) => void;
}

const VersionControl = ({ currentBot, onRestore }: VersionControlProps) => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [newVersionDescription, setNewVersionDescription] = useState('');
  const [isCreatingVersion, setIsCreatingVersion] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Carregar versões do localStorage
    const savedVersions = localStorage.getItem('bot-versions');
    if (savedVersions) {
      setVersions(JSON.parse(savedVersions));
    } else {
      // Criar versão inicial
      createInitialVersion();
    }
  }, []);

  const createInitialVersion = () => {
    const initialVersion: Version = {
      id: '1',
      version: '1.0.0',
      description: 'Versão inicial do bot',
      timestamp: new Date().toISOString(),
      changes: ['Bot criado', 'Comandos básicos adicionados'],
      commands: currentBot.commands,
      events: currentBot.events,
      files: currentBot.files || {},
      author: 'Usuário'
    };
    
    setVersions([initialVersion]);
    localStorage.setItem('bot-versions', JSON.stringify([initialVersion]));
  };

  const createNewVersion = () => {
    if (!newVersionDescription.trim()) {
      toast({
        title: "Erro",
        description: "Adicione uma descrição para a nova versão.",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingVersion(true);

    const newVersion: Version = {
      id: (versions.length + 1).toString(),
      version: generateNextVersion(),
      description: newVersionDescription,
      timestamp: new Date().toISOString(),
      changes: analyzeChanges(),
      commands: currentBot.commands,
      events: currentBot.events,
      files: currentBot.files || {},
      author: 'Usuário'
    };

    const updatedVersions = [newVersion, ...versions];
    setVersions(updatedVersions);
    localStorage.setItem('bot-versions', JSON.stringify(updatedVersions));
    
    setNewVersionDescription('');
    setIsCreatingVersion(false);

    toast({
      title: "Nova versão criada!",
      description: `Versão ${newVersion.version} foi salva com sucesso.`,
    });
  };

  const generateNextVersion = (): string => {
    if (versions.length === 0) return '1.0.0';
    
    const lastVersion = versions[0].version;
    const [major, minor, patch] = lastVersion.split('.').map(Number);
    
    // Lógica simples: incrementa o patch
    return `${major}.${minor}.${patch + 1}`;
  };

  const analyzeChanges = (): string[] => {
    if (versions.length === 0) return ['Bot criado'];
    
    const lastVersion = versions[0];
    const changes: string[] = [];
    
    // Analisar mudanças nos comandos
    const addedCommands = currentBot.commands.filter(cmd => !lastVersion.commands.includes(cmd));
    const removedCommands = lastVersion.commands.filter(cmd => !currentBot.commands.includes(cmd));
    
    addedCommands.forEach(cmd => changes.push(`+ Comando ${cmd} adicionado`));
    removedCommands.forEach(cmd => changes.push(`- Comando ${cmd} removido`));
    
    // Analisar mudanças nos eventos
    const addedEvents = currentBot.events.filter(event => 
      !lastVersion.events.some(lastEvent => lastEvent.name === event.name)
    );
    const removedEvents = lastVersion.events.filter(event => 
      !currentBot.events.some(currentEvent => currentEvent.name === event.name)
    );
    
    addedEvents.forEach(event => changes.push(`+ Evento ${event.name} adicionado`));
    removedEvents.forEach(event => changes.push(`- Evento ${event.name} removido`));
    
    if (changes.length === 0) {
      changes.push('Configurações atualizadas');
    }
    
    return changes;
  };

  const restoreVersion = (version: Version) => {
    onRestore(version);
    
    toast({
      title: "Versão restaurada!",
      description: `Bot restaurado para a versão ${version.version}.`,
    });
  };

  const downloadVersion = (version: Version) => {
    const versionData = {
      version: version.version,
      description: version.description,
      timestamp: version.timestamp,
      bot: {
        name: currentBot.name,
        commands: version.commands,
        events: version.events,
        files: version.files
      }
    };
    
    const blob = new Blob([JSON.stringify(versionData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentBot.name}-v${version.version}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Versão baixada!",
      description: `Arquivo de backup da versão ${version.version} foi baixado.`,
    });
  };

  const compareVersions = (version1: Version, version2: Version) => {
    return {
      commandsAdded: version1.commands.filter(cmd => !version2.commands.includes(cmd)),
      commandsRemoved: version2.commands.filter(cmd => !version1.commands.includes(cmd)),
      eventsAdded: version1.events.filter(event => 
        !version2.events.some(v2Event => v2Event.name === event.name)
      ),
      eventsRemoved: version2.events.filter(event => 
        !version1.events.some(v1Event => v1Event.name === event.name)
      )
    };
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center">
            <GitBranch className="mr-2 h-5 w-5 text-green-500" />
            Controle de Versão
          </CardTitle>
          <p className="text-muted-foreground">
            Gerencie versões do seu bot com segurança e controle total
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Input
              placeholder="Descreva as mudanças desta versão..."
              value={newVersionDescription}
              onChange={(e) => setNewVersionDescription(e.target.value)}
              className="bg-background border-border flex-1"
            />
            <Button 
              onClick={createNewVersion}
              disabled={isCreatingVersion || !newVersionDescription.trim()}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              {isCreatingVersion ? 'Criando...' : 'Nova Versão'}
            </Button>
          </div>
          
          {versions.length > 0 && (
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{versions.length}</div>
                <div className="text-sm text-muted-foreground">Versões</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{versions[0]?.version || '1.0.0'}</div>
                <div className="text-sm text-muted-foreground">Atual</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">
                  {versions.reduce((total, v) => total + v.changes.length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Mudanças</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Versions List */}
      <div className="space-y-4">
        {versions.map((version, index) => (
          <Card 
            key={version.id} 
            className={`bg-card/50 border-border transition-all cursor-pointer ${
              selectedVersion?.id === version.id ? 'border-discord bg-discord/10' : 'hover:border-discord/50'
            }`}
            onClick={() => setSelectedVersion(selectedVersion?.id === version.id ? null : version)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge 
                    className={`${
                      index === 0 
                        ? 'bg-green-500/20 text-green-400 border-green-500/50' 
                        : 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                    }`}
                  >
                    v{version.version}
                    {index === 0 && ' (Atual)'}
                  </Badge>
                  <div>
                    <CardTitle className="text-lg">{version.description}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Clock className="mr-1 h-3 w-3" />
                      {formatDate(version.timestamp)}
                      <span className="ml-3">por {version.author}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadVersion(version);
                    }}
                    className="border-border"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  {index !== 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        restoreVersion(version);
                      }}
                      className="border-border"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Changes */}
                <div>
                  <h4 className="font-medium mb-2">Mudanças:</h4>
                  <div className="space-y-1">
                    {version.changes.map((change, changeIndex) => (
                      <div key={changeIndex} className="flex items-center text-sm">
                        <GitCommit className="mr-2 h-3 w-3 text-muted-foreground" />
                        <span className={
                          change.startsWith('+') ? 'text-green-400' :
                          change.startsWith('-') ? 'text-red-400' :
                          'text-muted-foreground'
                        }>
                          {change}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Stats */}
                <div className="flex space-x-4 text-sm text-muted-foreground">
                  <span>{version.commands.length} comandos</span>
                  <span>{version.events.length} eventos</span>
                  <span>{Object.keys(version.files).length} arquivos</span>
                </div>
                
                {/* Detailed comparison when expanded */}
                {selectedVersion?.id === version.id && index > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <h4 className="font-medium mb-2">Comparação com versão anterior:</h4>
                    {(() => {
                      const comparison = compareVersions(version, versions[index - 1]);
                      return (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <h5 className="font-medium text-green-400 mb-1">Adicionado:</h5>
                            {comparison.commandsAdded.map(cmd => (
                              <div key={cmd} className="text-green-400">+ Comando {cmd}</div>
                            ))}
                            {comparison.eventsAdded.map(event => (
                              <div key={event.name} className="text-green-400">+ Evento {event.name}</div>
                            ))}
                          </div>
                          <div>
                            <h5 className="font-medium text-red-400 mb-1">Removido:</h5>
                            {comparison.commandsRemoved.map(cmd => (
                              <div key={cmd} className="text-red-400">- Comando {cmd}</div>
                            ))}
                            {comparison.eventsRemoved.map(event => (
                              <div key={event.name} className="text-red-400">- Evento {event.name}</div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {versions.length === 0 && (
        <Card className="bg-card/50 border-border border-dashed">
          <CardContent className="text-center py-8">
            <GitBranch className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma versão encontrada</h3>
            <p className="text-muted-foreground mb-4">
              Crie sua primeira versão para começar a usar o controle de versão
            </p>
            <Button onClick={createInitialVersion} className="bg-gradient-discord hover:bg-discord-dark text-white">
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeira Versão
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VersionControl;