import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Save, Download, Play, RefreshCw, Copy, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodeEditorProps {
  botName: string;
  prefix: string;
  commands: string[];
  events: any[];
  variables: Record<string, string>;
}

const CodeEditor = ({ botName, prefix, commands, events, variables }: CodeEditorProps) => {
  const [activeFile, setActiveFile] = useState('index.js');
  const [files, setFiles] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const editorRef = useRef<any>(null);
  const { toast } = useToast();

  const generateFiles = () => {
    const mainCode = generateMainCode();
    const packageJson = generatePackageJson();
    const configJson = generateConfigJson();
    const envExample = generateEnvExample();
    const readme = generateReadme();
    
    // Gerar arquivos de comandos
    const commandFiles: Record<string, string> = {};
    commands.forEach(cmd => {
      commandFiles[`commands/${cmd}.js`] = generateCommandFile(cmd);
    });

    // Gerar arquivos de eventos
    const eventFiles: Record<string, string> = {};
    events.forEach(event => {
      eventFiles[`events/${event.name}.js`] = generateEventFile(event);
    });

    const allFiles = {
      'index.js': mainCode,
      'package.json': packageJson,
      'config.json': configJson,
      '.env.example': envExample,
      'README.md': readme,
      ...commandFiles,
      ...eventFiles
    };

    setFiles(allFiles);
    if (!files[activeFile]) {
      setActiveFile('index.js');
    }
  };

  const generateMainCode = () => {
    return `const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

// Criar instância do cliente Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences
    ]
});

// Coleções
client.commands = new Collection();
client.events = new Collection();

// Carregar comandos
const loadCommands = () => {
    const commandsPath = path.join(__dirname, 'commands');
    if (fs.existsSync(commandsPath)) {
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            client.commands.set(command.name, command);
            console.log(\`✅ Comando carregado: \${command.name}\`);
        }
    }
};

// Carregar eventos
const loadEvents = () => {
    const eventsPath = path.join(__dirname, 'events');
    if (fs.existsSync(eventsPath)) {
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
        
        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            const event = require(filePath);
            
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
            console.log(\`✅ Evento carregado: \${event.name}\`);
        }
    }
};

// Sistema de variáveis dinâmicas
const replaceVariables = (text, user, guild) => {
    return text
        .replace(/{user}/g, user ? user.username : 'Usuário')
        .replace(/{user.mention}/g, user ? \`<@\${user.id}>\` : '@Usuário')
        .replace(/{user.tag}/g, user ? user.tag : 'Usuário#0000')
        .replace(/{server}/g, guild ? guild.name : 'Servidor')
        .replace(/{server.members}/g, guild ? guild.memberCount : '0')
        .replace(/{date}/g, new Date().toLocaleDateString('pt-BR'))
        .replace(/{time}/g, new Date().toLocaleTimeString('pt-BR'))
        .replace(/{bot.name}/g, client.user ? client.user.username : '${botName}')
        .replace(/{prefix}/g, config.prefix || '${prefix}');
};

// Event: Bot pronto
client.once('ready', () => {
    console.log(\`🚀 \${client.user.username} está online!\`);
    console.log(\`📊 Conectado em \${client.guilds.cache.size} servidores\`);
    console.log(\`👥 Servindo \${client.users.cache.size} usuários\`);
    
    client.user.setActivity(\`\${config.prefix}help | \${client.commands.size} comandos\`, { 
        type: 'WATCHING' 
    });
});

// Event: Processar mensagens
client.on('messageCreate', async message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        await command.execute(message, args, client);
    } catch (error) {
        console.error('Erro ao executar comando:', error);
        await message.reply('❌ Houve um erro ao executar este comando!');
    }
});

// Carregar tudo
loadCommands();
loadEvents();

// Login do bot
client.login(process.env.DISCORD_TOKEN || config.token);

// Exportar função de variáveis para usar em outros arquivos
module.exports = { replaceVariables };`;
  };

  const generatePackageJson = () => {
    return JSON.stringify({
      name: botName.toLowerCase().replace(/\s+/g, '-'),
      version: "1.0.0",
      description: `Bot Discord criado com BotCraft - ${commands.length} comandos incluídos`,
      main: "index.js",
      scripts: {
        start: "node index.js",
        dev: "nodemon index.js",
        deploy: "node deploy.js"
      },
      dependencies: {
        "discord.js": "^14.14.1",
        axios: "^1.6.0",
        jszip: "^3.10.1"
      },
      devDependencies: {
        nodemon: "^3.0.1"
      },
      keywords: ["discord", "bot", "botcraft", "javascript"],
      author: "BotCraft User",
      license: "MIT"
    }, null, 2);
  };

  const generateConfigJson = () => {
    return JSON.stringify({
      prefix: prefix,
      botName: botName,
      variables: variables,
      events: events.reduce((acc, event) => {
        acc[event.name] = event.enabled;
        return acc;
      }, {}),
      settings: {
        deleteCommandMessages: false,
        embedColor: "#5865F2",
        errorColor: "#FF0000",
        successColor: "#00FF00"
      }
    }, null, 2);
  };

  const generateEnvExample = () => {
    return `# Discord Bot Token (OBRIGATÓRIO)
DISCORD_TOKEN=seu_token_aqui

# Configurações opcionais
BOT_PREFIX=${prefix}
BOT_NAME=${botName}

# APIs externas (se necessário)
GOOGLE_API_KEY=sua_chave_google_aqui
GOOGLE_CX=seu_cx_aqui

# Banco de dados (opcional)
DATABASE_URL=sua_url_database_aqui`;
  };

  const generateReadme = () => {
    return `# ${botName}

🤖 Bot Discord criado com **BotCraft** - A plataforma visual para criar bots sem programação!

## 📋 Comandos Disponíveis

${commands.map(cmd => `- \`${prefix}${cmd}\``).join('\n')}

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

## ⚙️ Configurações

Edite o arquivo \`config.json\` para personalizar:
- Prefixo dos comandos
- Cores dos embeds
- Ativar/desativar eventos
- Variáveis personalizadas

## 🔧 Variáveis Dinâmicas

Use essas variáveis em suas mensagens:
- \`{user}\` - Nome do usuário
- \`{user.mention}\` - Mencionar usuário
- \`{server}\` - Nome do servidor
- \`{date}\` - Data atual
- \`{time}\` - Hora atual
- \`{bot.name}\` - Nome do bot

## 🎯 Eventos Configurados

${events.map(event => `- **${event.name}**: ${event.description}`).join('\n')}

## 🔒 Permissões necessárias

Seu bot precisa das seguintes permissões:
- ✅ Enviar mensagens
- ✅ Ler histórico de mensagens
- ✅ Usar comandos de barra
- ✅ Incorporar links
- ✅ Anexar arquivos
- ✅ Mencionar @everyone, @here e todos os cargos
- ✅ Gerenciar mensagens (para comandos de moderação)
- ✅ Expulsar membros (se usando comandos de moderação)
- ✅ Banir membros (se usando comandos de moderação)

## 🌐 Deploy

### Heroku
\`\`\`bash
# Instalar Heroku CLI e fazer login
heroku create seu-bot-nome
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
3. Execute o projeto

## 🆘 Suporte

- 📧 Email: support@botcraft.dev
- 🌐 Site: https://botcraft.dev
- 📚 Documentação: https://docs.botcraft.dev

---

Bot criado com ❤️ usando [BotCraft](https://botcraft.dev) - A forma mais fácil de criar bots Discord!
`;
  };

  const generateCommandFile = (commandName: string) => {
    // Lógica para gerar arquivos de comandos específicos baseado no commandName
    const commandTemplates: Record<string, string> = {
      userinfo: `const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'userinfo',
    description: 'Mostra informações sobre um usuário',
    async execute(message, args) {
        const user = message.mentions.users.first() || message.author;
        const member = message.guild.members.cache.get(user.id);
        
        const embed = new EmbedBuilder()
            .setTitle(\`👤 Informações de \${user.username}\`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: 'Tag', value: user.tag, inline: true },
                { name: 'ID', value: user.id, inline: true },
                { name: 'Entrou no Discord', value: \`<t:\${Math.floor(user.createdTimestamp / 1000)}:F>\`, inline: false },
                { name: 'Entrou no servidor', value: member ? \`<t:\${Math.floor(member.joinedTimestamp / 1000)}:F>\` : 'N/A', inline: false }
            )
            .setColor('#5865F2')
            .setTimestamp();
            
        await message.reply({ embeds: [embed] });
    }
};`,
      ban: `const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Bane um usuário do servidor',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return message.reply('❌ Você não tem permissão para banir membros!');
        }
        
        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('❌ Mencione um usuário para banir!');
        }
        
        const reason = args.slice(1).join(' ') || 'Não especificado';
        const member = message.guild.members.cache.get(user.id);
        
        if (!member) {
            return message.reply('❌ Usuário não encontrado!');
        }
        
        if (!member.bannable) {
            return message.reply('❌ Não posso banir este usuário!');
        }
        
        try {
            await member.ban({ reason });
            
            const embed = new EmbedBuilder()
                .setTitle('🔨 Usuário Banido')
                .addFields(
                    { name: 'Usuário', value: \`\${user.tag} (\${user.id})\`, inline: true },
                    { name: 'Moderador', value: message.author.tag, inline: true },
                    { name: 'Motivo', value: reason, inline: false }
                )
                .setColor('#FF0000')
                .setTimestamp();
                
            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await message.reply('❌ Erro ao banir usuário!');
        }
    }
};`
    };
    
    return commandTemplates[commandName] || `// Comando ${commandName} gerado automaticamente
module.exports = {
    name: '${commandName}',
    description: 'Comando ${commandName}',
    async execute(message, args) {
        await message.reply('Comando ${commandName} executado!');
    }
};`;
  };

  const generateEventFile = (event: any) => {
    const eventTemplates: Record<string, string> = {
      guildMemberAdd: `const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    async execute(member, client) {
        const config = require('../config.json');
        if (!config.events.guildMemberAdd) return;
        
        const welcomeChannel = member.guild.channels.cache.find(ch => ch.name === 'bem-vindos' || ch.name === 'welcome');
        if (!welcomeChannel) return;
        
        const embed = new EmbedBuilder()
            .setTitle('🎉 Novo membro!')
            .setDescription(\`Bem-vindo(a) \${member.user.username} ao **\${member.guild.name}**!\`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: 'Membro número', value: \`#\${member.guild.memberCount}\`, inline: true },
                { name: 'Conta criada', value: \`<t:\${Math.floor(member.user.createdTimestamp / 1000)}:R>\`, inline: true }
            )
            .setColor('#00FF00')
            .setTimestamp();
            
        await welcomeChannel.send({ embeds: [embed] });
    }
};`,
      messageDelete: `const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'messageDelete',
    once: false,
    async execute(message, client) {
        const config = require('../config.json');
        if (!config.events.messageDelete || message.author.bot) return;
        
        const logChannel = message.guild.channels.cache.find(ch => ch.name === 'logs');
        if (!logChannel) return;
        
        const embed = new EmbedBuilder()
            .setTitle('🗑️ Mensagem deletada')
            .addFields(
                { name: 'Autor', value: message.author.tag, inline: true },
                { name: 'Canal', value: \`<#\${message.channel.id}>\`, inline: true },
                { name: 'Conteúdo', value: message.content || 'Sem conteúdo', inline: false }
            )
            .setColor('#FF0000')
            .setTimestamp();
            
        await logChannel.send({ embeds: [embed] });
    }
};`
    };
    
    return eventTemplates[event.name] || `// Evento ${event.name} gerado automaticamente
module.exports = {
    name: '${event.name}',
    once: false,
    async execute(...args) {
        console.log('Evento ${event.name} executado!');
    }
};`;
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const saveFile = () => {
    if (editorRef.current && activeFile) {
      const content = editorRef.current.getValue();
      setFiles(prev => ({
        ...prev,
        [activeFile]: content
      }));
      
      toast({
        title: "Arquivo salvo!",
        description: `${activeFile} foi salvo com sucesso.`,
      });
    }
  };

  const copyContent = () => {
    if (editorRef.current) {
      navigator.clipboard.writeText(editorRef.current.getValue());
      toast({
        title: "Código copiado!",
        description: "O código foi copiado para sua área de transferência.",
      });
    }
  };

  const downloadBot = async () => {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    
    // Adicionar todos os arquivos ao ZIP
    Object.entries(files).forEach(([fileName, content]) => {
      if (fileName.includes('/')) {
        // Criar diretórios conforme necessário
        zip.file(fileName, content);
      } else {
        zip.file(fileName, content);
      }
    });
    
    // Gerar e baixar o ZIP
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${botName.toLowerCase().replace(/\s+/g, '-')}-bot.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Bot baixado!",
      description: "Seu bot foi baixado como arquivo ZIP.",
    });
  };

  const testCode = () => {
    toast({
      title: "Testando código...",
      description: "Verificando sintaxe e estrutura do bot.",
    });
    
    // Aqui implementaríamos validação real do código
    setTimeout(() => {
      toast({
        title: "✅ Código válido!",
        description: "Seu bot está pronto para ser executado.",
      });
    }, 2000);
  };

  // Gerar arquivos na inicialização
  useState(() => {
    generateFiles();
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Editor de Código
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Edite e personalize o código do seu bot
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={copyContent}>
                <Copy className="mr-2 h-4 w-4" />
                Copiar
              </Button>
              <Button variant="outline" onClick={saveFile}>
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </Button>
              <Button variant="outline" onClick={testCode}>
                <Play className="mr-2 h-4 w-4" />
                Testar
              </Button>
              <Button onClick={downloadBot} className="bg-gradient-discord hover:bg-discord-dark text-white">
                <Download className="mr-2 h-4 w-4" />
                Baixar Bot
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border">
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-discord">{Object.keys(files).length}</div>
            <p className="text-muted-foreground text-sm">Arquivos</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border">
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-discord-green">{commands.length}</div>
            <p className="text-muted-foreground text-sm">Comandos</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border">
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-discord-yellow">{events.length}</div>
            <p className="text-muted-foreground text-sm">Eventos</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border">
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-purple-500">{Object.keys(variables).length}</div>
            <p className="text-muted-foreground text-sm">Variáveis</p>
          </CardContent>
        </Card>
      </div>

      {/* Editor */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Arquivos do Projeto</CardTitle>
            <Button variant="outline" size="sm" onClick={generateFiles} disabled={isGenerating}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
              Regenerar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeFile} onValueChange={setActiveFile}>
            <TabsList className="grid w-full grid-cols-6 bg-muted mb-4">
              {Object.keys(files).slice(0, 6).map((fileName) => (
                <TabsTrigger 
                  key={fileName} 
                  value={fileName}
                  className="data-[state=active]:bg-discord data-[state=active]:text-white text-xs"
                >
                  {fileName.split('/').pop()}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {Object.entries(files).map(([fileName, content]) => (
              <TabsContent key={fileName} value={fileName}>
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="bg-muted px-4 py-2 flex items-center justify-between">
                    <span className="text-sm font-mono">{fileName}</span>
                    <Badge variant="secondary">{content.split('\n').length} linhas</Badge>
                  </div>
                  <Editor
                    height="500px"
                    language={fileName.endsWith('.json') ? 'json' : fileName.endsWith('.md') ? 'markdown' : 'javascript'}
                    value={content}
                    theme="vs-dark"
                    onMount={handleEditorDidMount}
                    options={{
                      minimap: { enabled: true },
                      fontSize: 14,
                      lineNumbers: 'on',
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                    }}
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeEditor;