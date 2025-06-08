import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Plus, Download, Star, Heart, Code, Share, Filter, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Component {
  id: string;
  name: string;
  description: string;
  category: 'moderation' | 'fun' | 'utility' | 'music' | 'economy' | 'custom';
  code: string;
  author: string;
  downloads: number;
  rating: number;
  tags: string[];
  isPublic: boolean;
  createdAt: string;
}

interface ComponentLibraryProps {
  onImportComponent: (component: Component) => void;
}

const ComponentLibrary = ({ onImportComponent }: ComponentLibraryProps) => {
  const [components, setComponents] = useState<Component[]>([
    {
      id: '1',
      name: 'Sistema de Moderação Avançado',
      description: 'Sistema completo de moderação com warn, mute, ban e logs',
      category: 'moderation',
      code: `// Sistema de Moderação Avançado
const moderationSystem = {
  commands: ['warn', 'mute', 'ban', 'kick', 'unban'],
  automod: true,
  logs: true
};`,
      author: 'DevMaster',
      downloads: 1542,
      rating: 4.8,
      tags: ['moderação', 'admin', 'logs'],
      isPublic: true,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Sistema de Economia',
      description: 'Sistema completo de economia com moedas, loja e trabalhos',
      category: 'economy',
      code: `// Sistema de Economia
const economySystem = {
  commands: ['balance', 'work', 'shop', 'buy', 'daily'],
  currency: 'coins',
  jobs: true
};`,
      author: 'EcoBot',
      downloads: 892,
      rating: 4.6,
      tags: ['economia', 'moedas', 'trabalho'],
      isPublic: true,
      createdAt: '2024-01-12'
    },
    {
      id: '3',
      name: 'Sistema de Música Premium',
      description: 'Player de música com fila, filtros e controles avançados',
      category: 'music',
      code: `// Sistema de Música Premium
const musicSystem = {
  commands: ['play', 'pause', 'skip', 'queue', 'filter'],
  filters: ['bassboost', 'nightcore', '8d'],
  playlists: true
};`,
      author: 'MusicMaker',
      downloads: 2103,
      rating: 4.9,
      tags: ['música', 'player', 'filtros'],
      isPublic: true,
      createdAt: '2024-01-10'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'downloads' | 'rating' | 'recent'>('downloads');
  const [newComponent, setNewComponent] = useState({
    name: '',
    description: '',
    category: 'custom' as const,
    code: '',
    tags: '',
    isPublic: true
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const categories = [
    { value: 'all', label: 'Todos' },
    { value: 'moderation', label: 'Moderação' },
    { value: 'fun', label: 'Diversão' },
    { value: 'utility', label: 'Utilidade' },
    { value: 'music', label: 'Música' },
    { value: 'economy', label: 'Economia' },
    { value: 'custom', label: 'Personalizado' }
  ];

  const getCategoryColor = (category: Component['category']) => {
    const colors = {
      moderation: 'bg-red-500',
      fun: 'bg-yellow-500',
      utility: 'bg-blue-500',
      music: 'bg-purple-500',
      economy: 'bg-green-500',
      custom: 'bg-gray-500'
    };
    return colors[category];
  };

  const getCategoryLabel = (category: Component['category']) => {
    const labels = {
      moderation: 'Moderação',
      fun: 'Diversão',
      utility: 'Utilidade',
      music: 'Música',
      economy: 'Economia',
      custom: 'Personalizado'
    };
    return labels[category];
  };

  const filteredComponents = components
    .filter(comp => {
      const matchesSearch = comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           comp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           comp.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || comp.category === selectedCategory;
      return matchesSearch && matchesCategory && comp.isPublic;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'downloads':
          return b.downloads - a.downloads;
        case 'rating':
          return b.rating - a.rating;
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  const handleCreateComponent = () => {
    const component: Component = {
      id: Date.now().toString(),
      name: newComponent.name,
      description: newComponent.description,
      category: newComponent.category,
      code: newComponent.code,
      author: 'Você',
      downloads: 0,
      rating: 0,
      tags: newComponent.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      isPublic: newComponent.isPublic,
      createdAt: new Date().toISOString()
    };

    setComponents(prev => [...prev, component]);
    setNewComponent({
      name: '',
      description: '',
      category: 'custom',
      code: '',
      tags: '',
      isPublic: true
    });
    setIsCreateDialogOpen(false);

    toast({
      title: "Componente criado!",
      description: `${component.name} foi adicionado à biblioteca.`,
    });
  };

  const handleImport = (component: Component) => {
    onImportComponent(component);
    
    // Incrementar downloads
    setComponents(prev => 
      prev.map(comp => 
        comp.id === component.id 
          ? { ...comp, downloads: comp.downloads + 1 }
          : comp
      )
    );

    toast({
      title: "Componente importado!",
      description: `${component.name} foi adicionado ao seu bot.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Biblioteca de Componentes
              </CardTitle>
              <CardDescription>
                Descubra e compartilhe componentes reutilizáveis para bots Discord
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-discord hover:bg-discord-dark text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Componente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Criar Novo Componente</DialogTitle>
                  <DialogDescription>
                    Crie um componente reutilizável para compartilhar com a comunidade
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Nome do componente"
                    value={newComponent.name}
                    onChange={(e) => setNewComponent(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Textarea
                    placeholder="Descrição do componente"
                    value={newComponent.description}
                    onChange={(e) => setNewComponent(prev => ({ ...prev, description: e.target.value }))}
                  />
                  <Select
                    value={newComponent.category}
                    onValueChange={(value: any) => setNewComponent(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Tags (separadas por vírgula)"
                    value={newComponent.tags}
                    onChange={(e) => setNewComponent(prev => ({ ...prev, tags: e.target.value }))}
                  />
                  <Textarea
                    placeholder="Código do componente"
                    value={newComponent.code}
                    onChange={(e) => setNewComponent(prev => ({ ...prev, code: e.target.value }))}
                    rows={8}
                  />
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateComponent} disabled={!newComponent.name || !newComponent.code}>
                      Criar Componente
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Filtros */}
      <Card className="bg-card/50 border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar componentes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="downloads">Mais baixados</SelectItem>
                <SelectItem value="rating">Melhor avaliados</SelectItem>
                <SelectItem value="recent">Mais recentes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Componentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredComponents.map((component) => (
          <Card key={component.id} className="bg-card/50 border-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg">{component.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getCategoryColor(component.category)} text-white text-xs`}>
                      {getCategoryLabel(component.category)}
                    </Badge>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 mr-1" />
                      <span className="text-sm">{component.rating}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">{component.description}</p>
              
              <div className="flex flex-wrap gap-1">
                {component.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {component.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{component.tags.length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>por {component.author}</span>
                <div className="flex items-center space-x-3">
                  <span className="flex items-center">
                    <Download className="h-3 w-3 mr-1" />
                    {component.downloads.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleImport(component)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Importar
                </Button>
                <Button variant="outline" size="sm">
                  <Code className="mr-2 h-4 w-4" />
                  Ver Código
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredComponents.length === 0 && (
        <Card className="bg-card/50 border-border">
          <CardContent className="pt-6 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum componente encontrado com os filtros atuais.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ComponentLibrary;