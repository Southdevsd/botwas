import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Video, Image, Code, Search, Plus, UserPlus, UserMinus, Users, Settings, Trash2, Eye, Download, FolderOpen, Upload, File, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import JSZip from 'jszip';

interface SourceFile {
  name: string;
  content: string;
  type: 'js' | 'json' | 'txt' | 'md' | 'env' | 'other';
  path: string;
}

interface Source {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'image';
  url: string;
  sourceFiles: SourceFile[];
  mainCode: string;
  instructions: string;
  dependencies: string[];
  author: string;
  authorEmail: string;
  createdAt: string;
}

interface SourceManagerProps {
  isAdmin: boolean;
  canPost: boolean;
  userEmail: string;
}

const SourceManager = ({ isAdmin, canPost, userEmail }: SourceManagerProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sources, setSources] = useState<Source[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('browse');
  const [newSource, setNewSource] = useState({
    title: '',
    description: '',
    type: 'video' as 'video' | 'image',
    url: '',
    mainCode: '',
    instructions: '',
    dependencies: [] as string[],
    sourceFiles: [] as SourceFile[]
  });
  const [authorizedUsers, setAuthorizedUsers] = useState<string[]>([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [newDependency, setNewDependency] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');
  const [newFileType, setNewFileType] = useState<'js' | 'json' | 'txt' | 'md' | 'env' | 'other'>('js');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Carregar sources do localStorage
    const savedSources = JSON.parse(localStorage.getItem('botSources') || '[]');
    setSources(savedSources);

    // Carregar usuários autorizados
    const savedUsers = JSON.parse(localStorage.getItem('authorizedSourcePosters') || '[]');
    setAuthorizedUsers(savedUsers);
  }, []);

  // Forçar tab "browse" se o usuário não pode postar
  useEffect(() => {
    if (!canPost && activeTab === 'post') {
      setActiveTab('browse');
    }
  }, [canPost, activeTab]);

  const saveToStorage = (newSources: Source[]) => {
    localStorage.setItem('botSources', JSON.stringify(newSources));
    setSources(newSources);
  };

  const saveAuthorizedUsers = (users: string[]) => {
    localStorage.setItem('authorizedSourcePosters', JSON.stringify(users));
    setAuthorizedUsers(users);
  };

  const addDependency = () => {
    if (newDependency.trim() && !newSource.dependencies.includes(newDependency.trim())) {
      setNewSource({
        ...newSource,
        dependencies: [...newSource.dependencies, newDependency.trim()]
      });
      setNewDependency('');
    }
  };

  const removeDependency = (dep: string) => {
    setNewSource({
      ...newSource,
      dependencies: newSource.dependencies.filter(d => d !== dep)
    });
  };

  const addSourceFile = () => {
    if (newFileName.trim() && newFileContent.trim()) {
      const file: SourceFile = {
        name: newFileName.trim(),
        content: newFileContent.trim(),
        type: newFileType,
        path: newFileName.trim()
      };
      
      setNewSource({
        ...newSource,
        sourceFiles: [...newSource.sourceFiles, file]
      });
      
      setNewFileName('');
      setNewFileContent('');
      setNewFileType('js');
    }
  };

  const removeSourceFile = (index: number) => {
    setNewSource({
      ...newSource,
      sourceFiles: newSource.sourceFiles.filter((_, i) => i !== index)
    });
  };

  const handleFileUpload = async (files: FileList | File[]) => {
    setUploadStatus('uploading');
    const fileArray = Array.from(files);
    const sourceFiles: SourceFile[] = [];
    let mainCode = '';

    try {
      for (const file of fileArray) {
        if (file.size > 1024 * 1024) { // 1MB limit
          toast({
            title: "Arquivo muito grande",
            description: `${file.name} excede o limite de 1MB`,
            variant: "destructive"
          });
          continue;
        }

        const content = await readFileContent(file);
        const fileType = getFileType(file.name);
        
        const sourceFile: SourceFile = {
          name: file.name,
          content,
          type: fileType,
          path: (file as any).webkitRelativePath || file.name
        };

        sourceFiles.push(sourceFile);

        // Se for index.js ou main.js, usar como código principal
        if (file.name === 'index.js' || file.name === 'main.js' || file.name === 'bot.js') {
          mainCode = content;
        }
      }

      // Se não encontrou arquivo principal, usar o primeiro .js encontrado
      if (!mainCode) {
        const jsFile = sourceFiles.find(file => file.type === 'js');
        if (jsFile) {
          mainCode = jsFile.content;
        }
      }

      setNewSource({
        ...newSource,
        sourceFiles,
        mainCode
      });

      setUploadStatus('success');
      toast({
        title: "Bot enviado com sucesso!",
        description: `${sourceFiles.length} arquivo(s) carregado(s)`,
      });

    } catch (error) {
      setUploadStatus('error');
      toast({
        title: "Erro no upload",
        description: "Erro ao processar os arquivos",
        variant: "destructive"
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFolderSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsText(file);
    });
  };

  const getFileType = (fileName: string): 'js' | 'json' | 'txt' | 'md' | 'env' | 'other' => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
      case 'mjs':
        return 'js';
      case 'json':
        return 'json';
      case 'txt':
        return 'txt';
      case 'md':
        return 'md';
      case 'env':
        return 'env';
      default:
        return 'other';
    }
  };

  const handlePostSource = () => {
    if (!newSource.title || !newSource.description || !newSource.url) {
      toast({
        title: "Erro",
        description: "Título, descrição e URL são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    if (newSource.sourceFiles.length === 0 && !newSource.mainCode) {
      toast({
        title: "Erro",
        description: "É necessário enviar pelo menos um arquivo do bot.",
        variant: "destructive"
      });
      return;
    }

    // Validar URL do YouTube se for vídeo
    if (newSource.type === 'video' && !newSource.url.includes('youtube.com') && !newSource.url.includes('youtu.be')) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma URL válida do YouTube.",
        variant: "destructive"
      });
      return;
    }

    const source: Source = {
      id: Date.now().toString(),
      title: newSource.title,
      description: newSource.description,
      type: newSource.type,
      url: newSource.url,
      sourceFiles: newSource.sourceFiles,
      mainCode: newSource.mainCode,
      instructions: newSource.instructions,
      dependencies: newSource.dependencies,
      author: user?.username || 'Usuário',
      authorEmail: user?.email || '',
      createdAt: new Date().toISOString()
    };

    const updatedSources = [source, ...sources];
    saveToStorage(updatedSources);

    // Reset form
    setNewSource({
      title: '',
      description: '',
      type: 'video',
      url: '',
      mainCode: '',
      instructions: '',
      dependencies: [],
      sourceFiles: []
    });
    setUploadStatus('idle');

    toast({
      title: "Source postada!",
      description: "Seu bot completo foi publicado com sucesso.",
    });

    setActiveTab('browse');
  };

  const handleAddUser = () => {
    if (!newUserEmail || !newUserEmail.includes('@')) {
      toast({
        title: "Erro",
        description: "Por favor, insira um email válido.",
        variant: "destructive"
      });
      return;
    }

    if (authorizedUsers.includes(newUserEmail)) {
      toast({
        title: "Erro",
        description: "Este usuário já está autorizado.",
        variant: "destructive"
      });
      return;
    }

    const updatedUsers = [...authorizedUsers, newUserEmail];
    saveAuthorizedUsers(updatedUsers);
    setNewUserEmail('');

    toast({
      title: "Usuário adicionado!",
      description: `${newUserEmail} agora pode postar sources.`,
    });
  };

  const handleRemoveUser = (email: string) => {
    const updatedUsers = authorizedUsers.filter(u => u !== email);
    saveAuthorizedUsers(updatedUsers);

    toast({
      title: "Usuário removido!",
      description: `${email} não pode mais postar sources.`,
    });
  };

  const canDeleteSource = (source: Source) => {
    // Admin principal pode deletar qualquer source
    if (userEmail === 'mariadosocorrogomes1808@gmail.com') {
      return true;
    }
    // Usuário só pode deletar suas próprias sources
    return source.authorEmail === userEmail;
  };

  const handleDeleteSource = (id: string) => {
    const updatedSources = sources.filter(s => s.id !== id);
    saveToStorage(updatedSources);

    toast({
      title: "Source deletada!",
      description: "A source foi removida com sucesso.",
    });
  };

  const downloadCompleteSource = async (source: Source) => {
    try {
      const zip = new JSZip();
      
      // Adicionar arquivo README com instruções
      const readmeContent = `# ${source.title}

${source.description}

## Instruções de Instalação

${source.instructions || 'Nenhuma instrução fornecida.'}

## Dependências Necessárias

${source.dependencies.length > 0 ? 
  source.dependencies.map(dep => `npm install ${dep}`).join('\n') : 
  'Nenhuma dependência especial necessária.'}

## Como usar

1. Baixe e extraia todos os arquivos
2. Instale as dependências listadas acima
3. Configure as variáveis de ambiente se necessário
4. Execute o arquivo principal (index.js ou main.js)

Autor: ${source.author}
Data: ${new Date(source.createdAt).toLocaleDateString()}
`;
      
      zip.file('README.md', readmeContent);
      
      // Adicionar arquivo principal como index.js se não existir
      if (source.mainCode && !source.sourceFiles.some(f => f.name === 'index.js')) {
        zip.file('index.js', source.mainCode);
      }
      
      // Adicionar todos os arquivos da source
      source.sourceFiles.forEach(file => {
        // Manter a estrutura de pastas se houver
        const filePath = file.path || file.name;
        zip.file(filePath, file.content);
      });
      
      // Se houver dependências, criar package.json
      if (source.dependencies.length > 0) {
        const packageJson = {
          name: source.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          version: "1.0.0",
          description: source.description,
          main: "index.js",
          dependencies: {}
        };
        
        // Adicionar dependências com versão latest
        source.dependencies.forEach(dep => {
          packageJson.dependencies[dep] = "latest";
        });
        
        zip.file('package.json', JSON.stringify(packageJson, null, 2));
      }
      
      // Gerar e baixar o ZIP
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${source.title.replace(/[^a-zA-Z0-9]/g, '_')}_bot_completo.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download iniciado!",
        description: "Bot completo baixado em formato ZIP com todos os arquivos.",
      });
    } catch (error) {
      toast({
        title: "Erro no download",
        description: "Erro ao gerar o arquivo ZIP.",
        variant: "destructive"
      });
    }
  };

  const filteredSources = sources.filter(source =>
    source.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    source.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getYouTubeEmbedUrl = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'js': return 'text-yellow-400';
      case 'json': return 'text-green-400';
      case 'txt': return 'text-gray-400';
      case 'md': return 'text-blue-400';
      case 'env': return 'text-red-400';
      default: return 'text-white';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="flex items-center gradient-text">
            <FolderOpen className="mr-2 h-5 w-5" />
            Source Manager - Bots Completos
          </CardTitle>
          <CardDescription className="text-cyber-cyan">
            {!canPost ? 'Explore bots completos com todos os arquivos' : 
             isAdmin ? 'Gerencie bots completos e usuários autorizados' : 
             'Visualize e poste bots completos'}
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full ${canPost ? (isAdmin ? 'grid-cols-3' : 'grid-cols-2') : 'grid-cols-1'} bg-black/40`}>
          <TabsTrigger value="browse">
            <Eye className="mr-1 h-4 w-4" />
            Explorar Bots
          </TabsTrigger>
          {canPost && (
            <TabsTrigger value="post">
              <Plus className="mr-1 h-4 w-4" />
              Postar Bot Completo
            </TabsTrigger>
          )}
          {isAdmin && (
            <TabsTrigger value="admin">
              <Settings className="mr-1 h-4 w-4" />
              Painel Admin
            </TabsTrigger>
          )}
        </TabsList>

        {/* Browse Sources */}
        <TabsContent value="browse" className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Pesquisar bots completos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-black/40 border-cyber-cyan/30"
              />
            </div>
            <Button variant="outline" className="border-cyber-cyan/30">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSources.map(source => (
              <Card key={source.id} className="cyber-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge className={source.type === 'video' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}>
                      {source.type === 'video' ? <Video className="mr-1 h-3 w-3" /> : <Image className="mr-1 h-3 w-3" />}
                      {source.type === 'video' ? 'Com Vídeo' : 'Com Imagem'}
                    </Badge>
                    {canDeleteSource(source) && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteSource(source.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <CardTitle className="text-lg text-cyber-blue">{source.title}</CardTitle>
                  <CardDescription className="text-cyber-cyan text-sm">
                    {source.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {source.type === 'video' ? (
                    <div className="aspect-video">
                      <iframe
                        src={getYouTubeEmbedUrl(source.url)}
                        className="w-full h-full rounded-lg"
                        allowFullScreen
                        title={source.title}
                      />
                    </div>
                  ) : (
                    <img
                      src={source.url}
                      alt={source.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}

                  {/* Dependencies */}
                  {source.dependencies.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-cyber-blue text-sm">Dependências:</Label>
                      <div className="flex flex-wrap gap-1">
                        {source.dependencies.map((dep, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-cyber-cyan/30">
                            {dep}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Instructions */}
                  {source.instructions && (
                    <div className="space-y-2">
                      <Label className="text-cyber-blue text-sm">Instruções de Instalação:</Label>
                      <div className="bg-black/60 border border-cyber-cyan/30 rounded-lg p-3">
                        <p className="text-xs text-cyber-green whitespace-pre-wrap">
                          {source.instructions}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Main Code */}
                  <div className="space-y-2">
                    <Label className="text-cyber-blue text-sm">Código Principal (index.js):</Label>
                    <div className="bg-black/60 border border-cyber-cyan/30 rounded-lg p-3">
                      <pre className="text-xs text-cyber-green font-mono whitespace-pre-wrap overflow-x-auto max-h-32">
                        {source.mainCode}
                      </pre>
                    </div>
                  </div>

                  {/* Additional Files */}
                  {source.sourceFiles.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-cyber-blue text-sm">Arquivos Adicionais ({source.sourceFiles.length}):</Label>
                      <div className="space-y-2">
                        {source.sourceFiles.slice(0, 2).map((file, index) => (
                          <div key={index} className="bg-black/60 border border-cyber-cyan/30 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-xs font-mono ${getFileTypeColor(file.type)}`}>
                                {file.name}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {file.type}
                              </Badge>
                            </div>
                            <pre className="text-xs text-cyber-green font-mono whitespace-pre-wrap overflow-x-auto max-h-20">
                              {file.content.substring(0, 200)}...
                            </pre>
                          </div>
                        ))}
                        {source.sourceFiles.length > 2 && (
                          <div className="text-xs text-cyber-cyan text-center">
                            +{source.sourceFiles.length - 2} arquivos adicionais
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => downloadCompleteSource(source)}
                      className="flex-1 cyber-button"
                    >
                      <Download className="mr-1 h-3 w-3" />
                      Baixar Bot Completo
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(source.mainCode);
                        toast({
                          title: "Copiado!",
                          description: "Código principal copiado.",
                        });
                      }}
                      className="border-cyber-cyan/30"
                    >
                      Copiar
                    </Button>
                  </div>
                  
                  <div className="text-xs text-cyber-cyan">
                    Por: {source.author} • {new Date(source.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSources.length === 0 && (
            <Card className="cyber-card text-center">
              <CardContent className="pt-6">
                <FolderOpen className="h-12 w-12 mx-auto mb-4 text-cyber-cyan" />
                <h3 className="text-lg font-semibold text-cyber-blue mb-2">
                  {searchTerm ? 'Nenhum bot encontrado' : 'Nenhum bot disponível'}
                </h3>
                <p className="text-cyber-cyan">
                  {searchTerm ? 'Tente pesquisar por outros termos.' : 'Aguarde novos bots serem postados!'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Post Source */}
        {canPost && (
          <TabsContent value="post" className="space-y-6">
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-cyber-blue">Novo Bot Completo</CardTitle>
                <CardDescription className="text-cyber-cyan">
                  Envie a pasta completa do seu bot com todos os arquivos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Upload Area */}
                <div className="space-y-4">
                  <Label className="text-cyber-blue">Enviar Pasta do Bot</Label>
                  
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isDragOver 
                        ? 'border-cyber-cyan bg-cyber-cyan/10' 
                        : 'border-cyber-cyan/30 hover:border-cyber-cyan/50'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    {uploadStatus === 'uploading' ? (
                      <div className="space-y-2">
                        <Upload className="h-8 w-8 mx-auto text-cyber-cyan animate-pulse" />
                        <p className="text-cyber-cyan">Processando arquivos...</p>
                      </div>
                    ) : uploadStatus === 'success' ? (
                      <div className="space-y-2">
                        <CheckCircle className="h-8 w-8 mx-auto text-cyber-green" />
                        <p className="text-cyber-green">
                          {newSource.sourceFiles.length} arquivo(s) carregado(s) com sucesso!
                        </p>
                        <div className="text-xs text-cyber-cyan">
                          {newSource.sourceFiles.map(file => file.name).join(', ')}
                        </div>
                      </div>
                    ) : uploadStatus === 'error' ? (
                      <div className="space-y-2">
                        <AlertCircle className="h-8 w-8 mx-auto text-red-400" />
                        <p className="text-red-400">Erro no upload. Tente novamente.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <FolderOpen className="h-12 w-12 mx-auto text-cyber-cyan" />
                        <div>
                          <p className="text-cyber-blue font-semibold">
                            Arraste a pasta do bot aqui ou clique para selecionar
                          </p>
                          <p className="text-xs text-cyber-cyan mt-2">
                            Suporte: .js, .json, .txt, .md, .env (máx 1MB por arquivo)
                          </p>
                        </div>
                        <Button 
                          onClick={handleFolderSelect}
                          variant="outline" 
                          className="border-cyber-cyan/30"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Selecionar Pasta do Bot
                        </Button>
                      </div>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    {...({ webkitdirectory: "" } as any)}
                    onChange={handleFileInputChange}
                    className="hidden"
                    accept=".js,.json,.txt,.md,.env"
                  />
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-cyber-blue">Título do Bot</Label>
                    <Input
                      id="title"
                      value={newSource.title}
                      onChange={(e) => setNewSource({...newSource, title: e.target.value})}
                      placeholder="Ex: Bot de Moderação Avançado"
                      className="bg-black/40 border-cyber-cyan/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-cyber-blue">Tipo de Mídia</Label>
                    <Select value={newSource.type} onValueChange={(value: 'video' | 'image') => setNewSource({...newSource, type: value})}>
                      <SelectTrigger className="bg-black/40 border-cyber-cyan/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">
                          <div className="flex items-center">
                            <Video className="mr-2 h-4 w-4" />
                            Vídeo do YouTube
                          </div>
                        </SelectItem>
                        <SelectItem value="image">
                          <div className="flex items-center">
                            <Image className="mr-2 h-4 w-4" />
                            Imagem do Bot
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-cyber-blue">Descrição</Label>
                  <Textarea
                    id="description"
                    value={newSource.description}
                    onChange={(e) => setNewSource({...newSource, description: e.target.value})}
                    placeholder="Descreva as funcionalidades do seu bot..."
                    className="bg-black/40 border-cyber-cyan/30"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url" className="text-cyber-blue">
                    {newSource.type === 'video' ? 'URL do YouTube' : 'URL da Imagem'}
                  </Label>
                  <Input
                    id="url"
                    value={newSource.url}
                    onChange={(e) => setNewSource({...newSource, url: e.target.value})}
                    placeholder={newSource.type === 'video' ? 'https://youtube.com/watch?v=...' : 'https://exemplo.com/imagem.png'}
                    className="bg-black/40 border-cyber-cyan/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions" className="text-cyber-blue">Instruções de Instalação</Label>
                  <Textarea
                    id="instructions"
                    value={newSource.instructions}
                    onChange={(e) => setNewSource({...newSource, instructions: e.target.value})}
                    placeholder="1. Baixe o Node.js&#10;2. Execute npm install&#10;3. Configure o token no arquivo .env&#10;4. Execute node index.js"
                    className="bg-black/40 border-cyber-cyan/30"
                    rows={6}
                  />
                </div>

                {/* Dependencies Section */}
                <div className="space-y-2">
                  <Label className="text-cyber-blue">Dependências do Bot</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newDependency}
                      onChange={(e) => setNewDependency(e.target.value)}
                      placeholder="discord.js"
                      className="bg-black/40 border-cyber-cyan/30"
                    />
                    <Button type="button" onClick={addDependency} variant="outline" className="border-cyber-cyan/30">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {newSource.dependencies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {newSource.dependencies.map((dep, index) => (
                        <Badge key={index} variant="outline" className="border-cyber-cyan/30">
                          {dep}
                          <button
                            type="button"
                            onClick={() => removeDependency(dep)}
                            className="ml-1 text-red-400 hover:text-red-300"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Show uploaded files */}
                {newSource.sourceFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-cyber-blue">Arquivos do Bot ({newSource.sourceFiles.length})</Label>
                    <div className="bg-black/40 border border-cyber-cyan/30 rounded-lg p-4 max-h-40 overflow-y-auto">
                      {newSource.sourceFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between py-1 px-2 hover:bg-cyber-cyan/10 rounded">
                          <div className="flex items-center space-x-2">
                            <File className="h-4 w-4 text-cyber-cyan" />
                            <span className="text-sm text-cyber-blue font-mono">{file.path || file.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {file.type}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeSourceFile(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button onClick={handlePostSource} className="w-full cyber-button" size="lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Postar Bot Completo
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Admin Panel */}
        {isAdmin && (
          <TabsContent value="admin" className="space-y-6">
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-cyber-blue">Gerenciar Usuários Autorizados</CardTitle>
                <CardDescription className="text-cyber-cyan">
                  Adicione ou remova usuários que podem postar bots completos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                    className="bg-black/40 border-cyber-cyan/30"
                  />
                  <Button onClick={handleAddUser} className="cyber-button">
                    <UserPlus className="mr-1 h-4 w-4" />
                    Adicionar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-cyber-blue">Usuários Autorizados</CardTitle>
                <CardDescription className="text-cyber-cyan">
                  {authorizedUsers.length} usuário(s) autorizado(s) a postar bots
                </CardDescription>
              </CardHeader>
              <CardContent>
                {authorizedUsers.length > 0 ? (
                  <div className="space-y-2">
                    {authorizedUsers.map(email => (
                      <div key={email} className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-cyber-cyan/30">
                        <span className="text-cyber-blue">{email}</span>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRemoveUser(email)}
                        >
                          <UserMinus className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto mb-4 text-cyber-cyan" />
                    <p className="text-cyber-cyan">Nenhum usuário autorizado ainda</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-cyber-blue">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-black/40 rounded-lg border border-cyber-cyan/30">
                    <div className="text-2xl font-bold text-cyber-blue">{sources.length}</div>
                    <div className="text-sm text-cyber-cyan">Bots Totais</div>
                  </div>
                  <div className="text-center p-4 bg-black/40 rounded-lg border border-cyber-cyan/30">
                    <div className="text-2xl font-bold text-cyber-blue">{authorizedUsers.length}</div>
                    <div className="text-sm text-cyber-cyan">Usuários Autorizados</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default SourceManager;