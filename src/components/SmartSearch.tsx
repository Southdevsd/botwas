import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Command, Calendar, User, Settings, Code, Zap } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: 'command' | 'event' | 'template' | 'log' | 'setting' | 'code';
  data: any;
  relevance: number;
}

interface SmartSearchProps {
  commands: string[];
  events: any[];
  templates?: any[];
  logs?: any[];
  onResultClick?: (result: SearchResult) => void;
}

const SmartSearch = ({ commands, events, templates = [], logs = [], onResultClick }: SmartSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Mock data for demonstration
  const mockData = {
    commands: commands.map(cmd => ({
      id: cmd,
      title: `Comando ${cmd}`,
      description: `Executa a função ${cmd} no servidor Discord`,
      category: 'command' as const,
      data: { name: cmd, type: 'slash_command' }
    })),
    events: events.map(event => ({
      id: event.id || event.name,
      title: `Evento ${event.name}`,
      description: event.description || `Evento automático ${event.name}`,
      category: 'event' as const,
      data: event
    })),
    templates: [
      {
        id: 'moderation',
        title: 'Template de Moderação',
        description: 'Bot completo para moderação de servidor',
        category: 'template' as const,
        data: { type: 'moderation', commands: ['ban', 'kick', 'mute'] }
      },
      {
        id: 'music',
        title: 'Template de Música',
        description: 'Bot para reprodução de música',
        category: 'template' as const,
        data: { type: 'music', commands: ['play', 'stop', 'queue'] }
      }
    ],
    logs: [
      {
        id: 'log1',
        title: 'Erro no comando ban',
        description: 'TypeError: Cannot read property of undefined',
        category: 'log' as const,
        data: { type: 'error', timestamp: Date.now() - 3600000 }
      },
      {
        id: 'log2',
        title: 'Bot conectado com sucesso',
        description: 'Bot iniciado e conectado ao Discord',
        category: 'log' as const,
        data: { type: 'info', timestamp: Date.now() - 7200000 }
      }
    ],
    settings: [
      {
        id: 'prefix',
        title: 'Prefixo do Bot',
        description: 'Configurar prefixo dos comandos',
        category: 'setting' as const,
        data: { key: 'prefix', value: '!' }
      },
      {
        id: 'permissions',
        title: 'Permissões',
        description: 'Gerenciar permissões do bot',
        category: 'setting' as const,
        data: { key: 'permissions', value: 'admin' }
      }
    ],
    code: [
      {
        id: 'main',
        title: 'index.js',
        description: 'Arquivo principal do bot',
        category: 'code' as const,
        data: { file: 'index.js', lines: 150 }
      },
      {
        id: 'commands',
        title: 'commands/',
        description: 'Pasta com todos os comandos',
        category: 'code' as const,
        data: { file: 'commands/', files: commands.length }
      }
    ]
  };

  const allItems = [
    ...mockData.commands,
    ...mockData.events,
    ...mockData.templates,
    ...mockData.logs,
    ...mockData.settings,
    ...mockData.code
  ];

  // Fuzzy search algorithm
  const fuzzySearch = (items: any[], searchQuery: string) => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    
    return items
      .map(item => {
        const title = item.title.toLowerCase();
        const description = item.description.toLowerCase();
        
        let relevance = 0;
        
        // Exact match in title gets highest score
        if (title.includes(query)) {
          relevance += 100;
        }
        
        // Exact match in description
        if (description.includes(query)) {
          relevance += 50;
        }
        
        // Fuzzy matching - characters in order
        let titleScore = 0;
        let queryIndex = 0;
        
        for (let i = 0; i < title.length && queryIndex < query.length; i++) {
          if (title[i] === query[queryIndex]) {
            titleScore += 10;
            queryIndex++;
          }
        }
        
        if (queryIndex === query.length) {
          relevance += titleScore;
        }
        
        // Acronym matching (first letters)
        const words = title.split(' ');
        const acronym = words.map(word => word[0]).join('');
        if (acronym.includes(query)) {
          relevance += 30;
        }
        
        return { ...item, relevance };
      })
      .filter(item => item.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 10);
  };

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate search delay
    const timeoutId = setTimeout(() => {
      const searchResults = fuzzySearch(allItems, query);
      setResults(searchResults);
      setSelectedIndex(-1);
      setIsSearching(false);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % results.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setQuery('');
        setResults([]);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleResultClick = (result: SearchResult) => {
    if (onResultClick) {
      onResultClick(result);
    }
    setQuery('');
    setResults([]);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'command': return <Command className="h-4 w-4 text-discord" />;
      case 'event': return <Zap className="h-4 w-4 text-yellow-500" />;
      case 'template': return <Settings className="h-4 w-4 text-green-500" />;
      case 'log': return <Calendar className="h-4 w-4 text-orange-500" />;
      case 'setting': return <Settings className="h-4 w-4 text-blue-500" />;
      case 'code': return <Code className="h-4 w-4 text-purple-500" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'command': return 'bg-discord/20 text-discord border-discord/50';
      case 'event': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'template': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'log': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'setting': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'code': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar comandos, eventos, templates, logs..."
          className="pl-10 pr-4 py-2 bg-background border-border focus:border-discord"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-discord"></div>
          </div>
        )}
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <Card className="absolute top-full mt-2 w-full bg-card border-border shadow-lg z-50">
          <CardContent className="p-0">
            <ScrollArea className="max-h-96">
              <div className="py-2">
                {results.map((result, index) => (
                  <Button
                    key={result.id}
                    variant="ghost"
                    className={`w-full justify-start px-4 py-3 h-auto ${
                      index === selectedIndex ? 'bg-muted' : ''
                    }`}
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      {getCategoryIcon(result.category)}
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{result.title}</h4>
                          <Badge className={getCategoryColor(result.category)}>
                            {result.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {result.description}
                        </p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Quick Tips */}
      {query.length === 0 && (
        <div className="mt-2 text-xs text-muted-foreground">
          💡 Dicas: Use Ctrl+K para focar, setas para navegar, Enter para selecionar
        </div>
      )}
    </div>
  );
};

export default SmartSearch;