import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Download, Eye, Code, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodePreviewProps {
  botName: string;
  prefix: string;
  commands: string[];
}

const CodePreview = ({ botName, prefix, commands }: CodePreviewProps) => {
  const [activeFile, setActiveFile] = useState('index.js');
  const { toast } = useToast();

  const generateMainCode = () => {
    return `const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Criar instância do cliente Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Coleção de comandos
client.commands = new Collection();

// Carregar comandos
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.name, command);
}

// Event: Bot pronto
client.once('ready', () => {
    console.log('🚀 ${botName} está online!');
    client.user.setActivity('${prefix}help | ${commands.length} comandos', { type: 'WATCHING' });
});

// Event: Processar mensagens
client.on('messageCreate', async message => {
    if (!message.content.startsWith('${prefix}') || message.author.bot) return;

    const args = message.content.slice(${prefix.length}).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error('Erro ao executar comando:', error);
        await message.reply('❌ Houve um erro ao executar este comando!');
    }
});

// Login do bot
client.login(process.env.DISCORD_TOKEN);`;
  };

  const generatePackageJson = () => {
    return `{
  "name": "${botName.toLowerCase().replace(/\s+/g, '-')}",
  "version": "1.0.0",
  "description": "Bot Discord criado com BotCraft",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "discord.js": "^14.14.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "keywords": ["discord", "bot", "botcraft"],
  "author": "BotCraft User",
  "license": "MIT"
}`;
  };

  const generateEnvExample = () => {
    return `# Discord Bot Token
DISCORD_TOKEN=seu_token_aqui

# Configurações opcionais
BOT_PREFIX=${prefix}
BOT_NAME=${botName}`;
  };

  const generateReadme = () => {
    return `# ${botName}

Bot Discord criado com **BotCraft** 🚀

## Comandos Disponíveis

${commands.map(cmd => `- \`${prefix}${cmd}\``).join('\n')}

## Como usar

1. **Instalar dependências:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Configurar o bot:**
   - Copie \`.env.example\` para \`.env\`
   - Adicione seu token do Discord
   - Configure as permissões necessárias

3. **Executar o bot:**
   \`\`\`bash
   npm start
   \`\`\`

## Permissões necessárias

Seu bot precisa das seguintes permissões:
- Enviar mensagens
- Ler histórico de mensagens
- Usar comandos de barra
- Incorporar links
- Anexar arquivos
- Mencionar @everyone, @here e todos os cargos

## Suporte

Bot criado com ❤️ usando [BotCraft](https://botcraft.dev)
`;
  };

  const files = {
    'index.js': { content: generateMainCode(), language: 'javascript', icon: Code },
    'package.json': { content: generatePackageJson(), language: 'json', icon: FileText },
    '.env.example': { content: generateEnvExample(), language: 'bash', icon: FileText },
    'README.md': { content: generateReadme(), language: 'markdown', icon: FileText },
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Código copiado!",
      description: "O código foi copiado para sua área de transferência.",
    });
  };

  const downloadBot = () => {
    toast({
      title: "Download iniciado!",
      description: "Seu bot será baixado em breve...",
    });
    // Aqui implementaríamos o download real do ZIP
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Code className="mr-2 h-5 w-5" />
                Preview do Código
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Visualize o código gerado para seu bot
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="border-border">
                <Eye className="mr-2 h-4 w-4" />
                Testar
              </Button>
              <Button 
                onClick={downloadBot}
                className="bg-gradient-discord hover:bg-discord-dark text-white"
              >
                <Download className="mr-2 h-4 w-4" />
                Baixar Bot
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Bot Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-discord rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-xl">
                  {botName.charAt(0) || 'B'}
                </span>
              </div>
              <h3 className="font-semibold text-lg">{botName || 'Meu Bot'}</h3>
              <p className="text-muted-foreground text-sm">
                Prefixo: <code className="bg-muted px-1 py-0.5 rounded">{prefix}</code>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-discord">{commands.length}</div>
            <p className="text-muted-foreground">Comandos</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-discord-green">4</div>
            <p className="text-muted-foreground">Arquivos</p>
          </CardContent>
        </Card>
      </div>

      {/* Code Files */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Arquivos do Bot</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => copyToClipboard(files[activeFile].content)}
              className="border-border"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copiar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeFile} onValueChange={setActiveFile}>
            <TabsList className="grid w-full grid-cols-4 bg-muted">
              {Object.entries(files).map(([fileName, file]) => {
                const Icon = file.icon;
                return (
                  <TabsTrigger 
                    key={fileName} 
                    value={fileName}
                    className="data-[state=active]:bg-discord data-[state=active]:text-white"
                  >
                    <Icon className="mr-1 h-4 w-4" />
                    {fileName}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            
            {Object.entries(files).map(([fileName, file]) => (
              <TabsContent key={fileName} value={fileName} className="mt-4">
                <div className="relative">
                  <pre className="bg-background border border-border rounded-lg p-4 overflow-x-auto text-sm">
                    <code className="text-foreground">
                      {file.content}
                    </code>
                  </pre>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Commands List */}
      {commands.length > 0 && (
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle>Comandos Incluídos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {commands.map((command) => (
                <Badge 
                  key={command} 
                  variant="secondary"
                  className="bg-discord/20 text-discord border-discord/50 justify-center"
                >
                  {prefix}{command}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CodePreview;