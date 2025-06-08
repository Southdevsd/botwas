import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { FileText, Download, Copy, Eye, Settings, Globe, Code, Book } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentationGeneratorProps {
  botName: string;
  commands: string[];
  events: any[];
  variables: Record<string, string>;
}

const DocumentationGenerator = ({ botName, commands, events, variables }: DocumentationGeneratorProps) => {
  const [docType, setDocType] = useState<'markdown' | 'html' | 'pdf'>('markdown');
  const [includeExamples, setIncludeExamples] = useState(true);
  const [includeAPI, setIncludeAPI] = useState(true);
  const [includeDeployment, setIncludeDeployment] = useState(true);
  const [customDescription, setCustomDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocs, setGeneratedDocs] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const generateReadme = () => {
    return `# ${botName}

${customDescription || `🤖 Bot Discord criado com **BotCraft** - A plataforma visual para criar bots sem programação!`}

## 📋 Comandos Disponíveis

${commands.map(cmd => `### \`!${cmd}\`
Descrição do comando ${cmd}

**Uso:** \`!${cmd} [parâmetros]\`

**Exemplo:** \`!${cmd} exemplo\`

**Permissões:** Usuário

---`).join('\n\n')}

## 🎯 Eventos Configurados

${events.map(event => `### ${event.name}
${event.description}

**Status:** ${event.enabled ? '✅ Ativo' : '❌ Inativo'}

**Configuração:**
\`\`\`json
${JSON.stringify(event.config, null, 2)}
\`\`\`

---`).join('\n\n')}

## 🔧 Variáveis Dinâmicas

Use essas variáveis em suas mensagens:

${Object.entries(variables).map(([key, value]) => `- \`${key}\` - ${value}`).join('\n')}

## 🚀 Como usar

### 1. Configuração inicial
\`\`\`bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env e adicione seu token do Discord
\`\`\`

### 2. Executar o bot
\`\`\`bash
# Modo desenvolvimento
npm run dev

# Modo produção
npm start
\`\`\`

## 🔒 Permissões necessárias

Seu bot precisa das seguintes permissões:
- ✅ Enviar mensagens
- ✅ Ler histórico de mensagens
- ✅ Usar comandos de barra
- ✅ Incorporar links
- ✅ Anexar arquivos
- ✅ Mencionar @everyone, @here e todos os cargos

${includeDeployment ? `## 🌐 Deploy

### Heroku
\`\`\`bash
# Instalar Heroku CLI e fazer login
heroku create ${botName.toLowerCase().replace(/\s+/g, '-')}
heroku config:set DISCORD_TOKEN=seu_token
git push heroku main
\`\`\`

### Railway
\`\`\`bash
# Conectar repositório ao Railway
# Adicionar variável DISCORD_TOKEN
# Deploy automático
\`\`\`

### Replit
1. Importe o projeto no Replit
2. Adicione DISCORD_TOKEN nos Secrets
3. Execute o projeto` : ''}

${includeAPI ? `## 🔌 API Reference

### Estrutura dos Comandos
\`\`\`javascript
module.exports = {
    name: 'comando',
    description: 'Descrição do comando',
    async execute(message, args, client) {
        // Lógica do comando
    }
};
\`\`\`

### Estrutura dos Eventos
\`\`\`javascript
module.exports = {
    name: 'evento',
    once: false,
    async execute(...args) {
        // Lógica do evento
    }
};
\`\`\`` : ''}

## 🆘 Suporte

- 📧 Email: support@botcraft.dev
- 🌐 Site: https://botcraft.dev
- 📚 Documentação: https://docs.botcraft.dev

---

Bot criado com ❤️ usando [BotCraft](https://botcraft.dev) - A forma mais fácil de criar bots Discord!
`;
  };

  const generateAPIDoc = () => {
    return `# ${botName} - API Documentation

## Comandos

${commands.map(cmd => `### ${cmd}

**Endpoint:** \`/${cmd}\`
**Método:** POST
**Descrição:** Executa o comando ${cmd}

**Parâmetros:**
\`\`\`json
{
  "message": "string",
  "args": ["string"],
  "user": {
    "id": "string",
    "username": "string"
  }
}
\`\`\`

**Resposta:**
\`\`\`json
{
  "success": true,
  "response": "string",
  "embed": {}
}
\`\`\`

**Exemplo:**
\`\`\`bash
curl -X POST https://api.bot.com/${cmd} \\
  -H "Content-Type: application/json" \\
  -d '{"message": "!${cmd}", "args": []}'
\`\`\`

---`).join('\n\n')}

## Eventos

${events.map(event => `### ${event.name}

**Trigger:** ${event.name}
**Descrição:** ${event.description}

**Payload:**
\`\`\`json
${JSON.stringify(event.config, null, 2)}
\`\`\`

---`).join('\n\n')}
`;
  };

  const generateUserGuide = () => {
    return `# ${botName} - Guia do Usuário

## 🎯 Primeiros Passos

Bem-vindo ao **${botName}**! Este guia vai te ajudar a usar todas as funcionalidades do bot.

## 📝 Lista de Comandos

${commands.map(cmd => `### !${cmd}

**O que faz:** Comando para ${cmd}

**Como usar:** 
\`!${cmd} [parâmetros]\`

**Exemplo prático:**
\`!${cmd} exemplo\`

**Dicas:**
- Use com moderação
- Verifique suas permissões
- Em caso de dúvida, use !help

---`).join('\n\n')}

## 🔧 Configurações

### Variáveis Disponíveis

${Object.entries(variables).map(([key, value]) => `- **${key}**: ${value}`).join('\n')}

### Eventos Automáticos

${events.filter(e => e.enabled).map(event => `- **${event.name}**: ${event.description}`).join('\n')}

## ❓ Perguntas Frequentes

### Como usar o bot?
Digite os comandos no chat onde o bot está presente.

### O bot não responde, o que fazer?
1. Verifique se o bot está online
2. Confirme se você está usando o prefixo correto
3. Verifique suas permissões

### Como reportar problemas?
Entre em contato com os administradores do servidor.

## 🎉 Recursos Especiais

${includeExamples ? `### Exemplos Práticos

**Comando básico:**
\`!${commands[0] || 'help'}\`

**Comando com parâmetros:**
\`!${commands[1] || 'user'} @usuário\`

**Usando variáveis:**
As mensagens do bot podem incluir variáveis como {user}, {server}, etc.` : ''}
`;
  };

  const generateDocs = async () => {
    setIsGenerating(true);
    
    // Simular geração
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const docs = {
      readme: generateReadme(),
      api: generateAPIDoc(),
      userGuide: generateUserGuide()
    };
    
    setGeneratedDocs(docs);
    setIsGenerating(false);
    
    toast({
      title: "Documentação gerada!",
      description: "Toda a documentação foi criada com sucesso.",
    });
  };

  const downloadDoc = (docName: string, content: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${botName}-${docName}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download concluído!",
      description: `${docName} foi baixado com sucesso.`,
    });
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copiado!",
      description: "Conteúdo copiado para a área de transferência.",
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
                <FileText className="mr-2 h-5 w-5" />
                Gerador de Documentação
              </CardTitle>
              <CardDescription>
                Gere documentação completa e profissional para seu bot automaticamente
              </CardDescription>
            </div>
            <Button 
              onClick={generateDocs}
              disabled={isGenerating}
              className="bg-gradient-discord hover:bg-discord-dark text-white"
            >
              {isGenerating ? 'Gerando...' : 'Gerar Documentação'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Configurações */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            Configurações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Descrição Personalizada</label>
            <Textarea
              placeholder="Descrição do seu bot (opcional)"
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="examples"
                checked={includeExamples}
                onCheckedChange={setIncludeExamples}
              />
              <label htmlFor="examples" className="text-sm">
                Incluir exemplos práticos
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="api"
                checked={includeAPI}
                onCheckedChange={setIncludeAPI}
              />
              <label htmlFor="api" className="text-sm">
                Incluir documentação API
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="deployment"
                checked={includeDeployment}
                onCheckedChange={setIncludeDeployment}
              />
              <label htmlFor="deployment" className="text-sm">
                Incluir guia de deploy
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border">
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-discord">{commands.length}</div>
            <p className="text-muted-foreground text-sm">Comandos</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border">
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-discord-green">{events.length}</div>
            <p className="text-muted-foreground text-sm">Eventos</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border">
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-discord-yellow">{Object.keys(variables).length}</div>
            <p className="text-muted-foreground text-sm">Variáveis</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border">
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-purple-500">{Object.keys(generatedDocs).length}</div>
            <p className="text-muted-foreground text-sm">Documentos</p>
          </CardContent>
        </Card>
      </div>

      {/* Documentação Gerada */}
      {Object.keys(generatedDocs).length > 0 && (
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle>Documentação Gerada</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="readme">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="readme" className="flex items-center">
                  <Book className="mr-2 h-4 w-4" />
                  README
                </TabsTrigger>
                <TabsTrigger value="api" className="flex items-center">
                  <Code className="mr-2 h-4 w-4" />
                  API Docs
                </TabsTrigger>
                <TabsTrigger value="userGuide" className="flex items-center">
                  <Globe className="mr-2 h-4 w-4" />
                  Guia do Usuário
                </TabsTrigger>
              </TabsList>
              
              {Object.entries(generatedDocs).map(([docName, content]) => (
                <TabsContent key={docName} value={docName} className="mt-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <Badge variant="secondary">
                          {content.split('\n').length} linhas
                        </Badge>
                        <Badge variant="secondary">
                          {content.length} caracteres
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(content)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copiar
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => downloadDoc(docName, content)}>
                          <Download className="mr-2 h-4 w-4" />
                          Baixar
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg max-h-96 overflow-auto">
                      <pre className="text-sm whitespace-pre-wrap">{content}</pre>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentationGenerator;