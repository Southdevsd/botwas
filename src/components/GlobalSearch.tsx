import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Bot, Code, Settings, FileText, Zap, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SearchResult {
  id: string;
  type: 'bot' | 'command' | 'code' | 'config';
  title: string;
  description: string;
  botName?: string;
  category?: string;
  tags?: string[];
  lastModified?: string;
}

const GlobalSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('all');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: '1',
      type: 'command',
      title: 'Comando !ban',
      description: 'Comando de moderação para banir usuários',
      botName: 'ModBot Pro',
      category: 'Moderação',
      tags: ['moderação', 'ban', 'punição'],
      lastModified: '2024-01-15'
    },
    {
      id: '2',
      type: 'bot',
      title: 'MusicBot Supreme',
      description: 'Bot completo de música com suporte a Spotify',
      category: 'Música',
      tags: ['música', 'spotify', 'youtube'],
      lastModified: '2024-01-14'
    },
    {
      id: '3',
      type: 'code',
      title: 'Sistema de Economia',
      description: 'Código para sistema de moedas virtuais',
      botName: 'EconomyBot',
      category: 'Economia',
      tags: ['economia', 'moedas', 'loja'],
      lastModified: '2024-01-13'
    },
    {
      id: '4',
      type: 'config',
      title: 'Configuração de Welcome',
      description: 'Configurações de mensagem de boas-vindas',
      botName: 'WelcomeBot',
      category: 'Eventos',
      tags: ['welcome', 'eventos', 'mensagens'],
      lastModified: '2024-01-12'
    }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    try {
      // Simulate search delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter results based on query and filter
      let filteredResults = mockResults.filter(result => {
        const matchesQuery = result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           result.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           result.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
                           
        const matchesFilter = searchFilter === 'all' || result.type === searchFilter;
        
        return matchesQuery && matchesFilter;
      });
      
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bot': return Bot;
      case 'command': return Zap;
      case 'code': return Code;
      case 'config': return Settings;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bot': return 'bg-blue-500';
      case 'command': return 'bg-green-500';
      case 'code': return 'bg-purple-500';
      case 'config': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="bg-card/50 border-border">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Search className="mr-2 h-5 w-5" />
          Busca Global
        </CardTitle>
        <CardDescription>
          Encontre comandos, bots, códigos e configurações em todos os seus projetos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="flex space-x-2">
          <div className="flex-1">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Digite para buscar comandos, bots, códigos..."
              className="bg-background border-border"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          <Select value={searchFilter} onValueChange={setSearchFilter}>
            <SelectTrigger className="w-40 bg-background border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="bot">Bots</SelectItem>
              <SelectItem value="command">Comandos</SelectItem>
              <SelectItem value="code">Códigos</SelectItem>
              <SelectItem value="config">Configurações</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="bg-gradient-discord hover:bg-discord-dark text-white"
          >
            {isSearching ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Search Filters */}
        <div className="flex items-center space-x-2 text-sm">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Filtros rápidos:</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {setSearchQuery('moderação'); setSearchFilter('command');}}
            className="h-6 text-xs"
          >
            Moderação
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {setSearchQuery('música'); setSearchFilter('bot');}}
            className="h-6 text-xs"
          >
            Música
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {setSearchQuery('economia'); setSearchFilter('code');}}
            className="h-6 text-xs"
          >
            Economia
          </Button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium">
              Resultados da busca ({searchResults.length})
            </h3>
            
            {searchResults.map((result) => {
              const IconComponent = getTypeIcon(result.type);
              return (
                <Card key={result.id} className="bg-background border-border cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`w-8 h-8 ${getTypeColor(result.type)} rounded-full flex items-center justify-center text-white`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{result.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {result.type}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            {result.description}
                          </p>
                          
                          {result.botName && (
                            <p className="text-xs text-muted-foreground">
                              em <span className="font-medium">{result.botName}</span>
                            </p>
                          )}
                          
                          {result.tags && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {result.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right text-xs text-muted-foreground ml-4">
                        {result.lastModified && (
                          <div>Modificado em {result.lastModified}</div>
                        )}
                        {result.category && (
                          <Badge variant="outline" className="mt-1">
                            {result.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {searchQuery && searchResults.length === 0 && !isSearching && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>Nenhum resultado encontrado para "{searchQuery}"</p>
            <p className="text-sm">Tente usar termos diferentes ou filtros mais amplos</p>
          </div>
        )}

        {!searchQuery && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>Digite algo para começar a buscar</p>
            <p className="text-sm">Busque por comandos, bots, códigos ou configurações</p>
          </div>
        )}

        {/* Recent Searches */}
        <div className="pt-4 border-t border-border">
          <h4 className="font-medium mb-3 text-sm">Buscas Recentes</h4>
          <div className="flex flex-wrap gap-2">
            {['moderação', 'música', 'economia', 'welcome'].map((term) => (
              <Button
                key={term}
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery(term)}
                className="h-6 text-xs"
              >
                {term}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GlobalSearch;