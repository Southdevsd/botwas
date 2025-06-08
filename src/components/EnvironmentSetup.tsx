import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Cloud, Server, Code, Download, CheckCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EnvironmentSetupProps {
  botName: string;
  commands: string[];
  events: any[];
}

interface DeploymentOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  difficulty: 'Fácil' | 'Médio' | 'Avançado';
  free: boolean;
  features: string[];
  setupSteps: string[];
}

const EnvironmentSetup = ({ botName, commands, events }: EnvironmentSetupProps) => {
  const [selectedDeployment, setSelectedDeployment] = useState('replit');
  const [includeDocumentation, setIncludeDocumentation] = useState(true);
  const [includeStartupScripts, setIncludeStartupScripts] = useState(true);
  const [includeEnvironmentFiles, setIncludeEnvironmentFiles] = useState(true);
  const [includeDeploymentGuide, setIncludeDeploymentGuide] = useState(true);
  const { toast } = useToast();

  const deploymentOptions: DeploymentOption[] = [
    {
      id: 'replit',
      name: 'Replit',
      icon: '🔄',
      description: 'Hospedagem gratuita e fácil de usar',
      difficulty: 'Fácil',
      free: true,
      features: ['Hospedagem gratuita', 'Editor online', 'Deploy automático', 'Uptime monitoring'],
      setupSteps: [
        'Criar conta no Replit',
        'Importar projeto',
        'Adicionar DISCORD_TOKEN nos Secrets',
        'Executar o bot'
      ]
    },
    {
      id: 'railway',
      name: 'Railway',
      icon: '🚂',
      description: 'Deploy automático com GitHub',
      difficulty: 'Médio',
      free: true,
      features: ['Deploy via Git', 'Escalabilidade automática', 'Métricas detalhadas', 'SSL gratuito'],
      setupSteps: [
        'Conectar repositório GitHub',
        'Configurar variáveis de ambiente',
        'Deploy automático',
        'Monitorar logs'
      ]
    },
    {
      id: 'heroku',
      name: 'Heroku',
      icon: '💜',
      description: 'Plataforma robusta e confiável',
      difficulty: 'Médio',
      free: false,
      features: ['Alta disponibilidade', 'Add-ons diversos', 'Escalabilidade', 'Logs avançados'],
      setupSteps: [
        'Instalar Heroku CLI',
        'Criar aplicação Heroku',
        'Configurar variáveis',
        'Deploy via Git'
      ]
    },
    {
      id: 'vps',
      name: 'VPS/Servidor',
      icon: '🖥️',
      description: 'Controle total sobre o ambiente',
      difficulty: 'Avançado',
      free: false,
      features: ['Controle total', 'Performance máxima', 'Customização completa', 'Acesso SSH'],
      setupSteps: [
        'Configurar servidor Linux',
        'Instalar Node.js e PM2',
        'Configurar firewall',
        'Setup de monitoramento'
      ]
    }
  ];

  const generateReadme = () => {
    const selectedOption = deploymentOptions.find(opt => opt.id === selectedDeployment);
    
    return `# ${botName}

🤖 **Bot Discord criado com BotCraft** - A plataforma mais avançada para criar bots sem programação!

${includeDocumentation ? `## 📚 Documentação Completa

### Comandos Disponíveis

${commands.map(cmd => `- \`!${cmd}\` - Comando ${cmd}`).join('\n')}

### Eventos Configurados

${events.map(event => `- **${event.name}**: ${event.description}`).join('\n')}

` : ''}## 🚀 Guia de Instalação Rápida

### Pré-requisitos
- Node.js 16+ instalado
- Token do bot Discord
- Git (opcional)

### 1. Instalação
\`\`\`bash
# Clonar/baixar o projeto
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env e adicionar seu DISCORD_TOKEN
\`\`\`

### 2. Executar
\`\`\`bash
# Desenvolvimento
npm run dev

# Produção
npm start

# Com PM2 (recomendado para produção)
npm run deploy
\`\`\`

${includeDeploymentGuide ? `## ☁️ Deploy - ${selectedOption?.name}

${selectedOption?.icon} **${selectedOption?.name}** - ${selectedOption?.description}

**Dificuldade:** ${selectedOption?.difficulty}
**Custo:** ${selectedOption?.free ? 'Gratuito' : 'Pago'}

### Características:
${selectedOption?.features.map(feature => `- ✅ ${feature}`).join('\n')}

### Passos para Deploy:
${selectedOption?.setupSteps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

${selectedDeployment === 'replit' ? `
### Configuração Específica - Replit

1. **Criar projeto no Replit:**
   - Vá para [replit.com](https://replit.com)
   - Clique em "Create Repl"
   - Escolha "Import from GitHub" ou "Upload folder"

2. **Configurar Secrets:**
   - No painel lateral, clique em "Secrets" (🔒)
   - Adicione: \`DISCORD_TOKEN\` = seu_token_aqui

3. **Executar:**
   - Clique em "Run" ou execute \`npm start\`
   - Seu bot estará online!

4. **Manter Online:**
   - Configure um monitor como UptimeRobot
   - URL para monitorar: sua-repl-url.replit.dev
` : ''}

${selectedDeployment === 'railway' ? `
### Configuração Específica - Railway

1. **Conectar GitHub:**
   - Vá para [railway.app](https://railway.app)
   - Conecte sua conta GitHub
   - Selecione o repositório do bot

2. **Configurar Variáveis:**
   - Vá para "Variables"
   - Adicione: \`DISCORD_TOKEN\` = seu_token_aqui
   - Adicione: \`PORT\` = 3000

3. **Deploy Automático:**
   - A cada push no GitHub, deploy automático
   - Monitore logs na dashboard

4. **Domínio Personalizado:**
   - Configure domínio customizado se necessário
   - SSL automático incluído
` : ''}

${selectedDeployment === 'heroku' ? `
### Configuração Específica - Heroku

1. **Instalar Heroku CLI:**
\`\`\`bash
# Windows (usando chocolatey)
choco install heroku-cli

# macOS (usando homebrew)
brew tap heroku/brew && brew install heroku

# Ubuntu
curl https://cli-assets.heroku.com/install.sh | sh
\`\`\`

2. **Deploy:**
\`\`\`bash
heroku login
heroku create ${botName.toLowerCase().replace(/\s+/g, '-')}
heroku config:set DISCORD_TOKEN=seu_token_aqui
git push heroku main
\`\`\`

3. **Monitoramento:**
\`\`\`bash
heroku logs --tail
heroku ps:scale worker=1
\`\`\`
` : ''}

${selectedDeployment === 'vps' ? `
### Configuração Específica - VPS

1. **Preparar Servidor:**
\`\`\`bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2
sudo npm install -g pm2
\`\`\`

2. **Deploy do Bot:**
\`\`\`bash
# Transferir arquivos
scp -r ./bot-files user@seu-servidor:/home/user/bot

# Conectar no servidor
ssh user@seu-servidor

# Navegar e instalar
cd /home/user/bot
npm install

# Configurar PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
\`\`\`

3. **Configurar Firewall:**
\`\`\`bash
sudo ufw allow 22
sudo ufw allow 443
sudo ufw enable
\`\`\`
` : ''}

` : ''}## ⚙️ Configuração Avançada

### Variáveis de Ambiente (.env)
\`\`\`env
# Discord Bot Token (OBRIGATÓRIO)
DISCORD_TOKEN=seu_token_discord_aqui

# Configurações do Bot
BOT_PREFIX=!
BOT_NAME=${botName}

# Configurações de Desenvolvimento
NODE_ENV=production
DEBUG=false

# APIs Externas (se necessário)
GOOGLE_API_KEY=sua_chave_google
WEATHER_API_KEY=sua_chave_clima

# Banco de Dados (opcional)
DATABASE_URL=sua_url_database
REDIS_URL=sua_url_redis
\`\`\`

### Configuração do Bot (config.json)
O arquivo \`config.json\` contém todas as configurações do bot:
- Prefixo de comandos
- Cores dos embeds
- Configurações de eventos
- Variáveis personalizadas

### Permissões Necessárias
Seu bot precisa das seguintes permissões no Discord:

**Básicas:**
- ✅ Enviar mensagens
- ✅ Ler histórico de mensagens
- ✅ Usar comandos de barra
- ✅ Incorporar links
- ✅ Anexar arquivos
- ✅ Mencionar @everyone, @here e todos os cargos

**Moderação (se aplicável):**
- ✅ Gerenciar mensagens
- ✅ Expulsar membros
- ✅ Banir membros
- ✅ Gerenciar cargos
- ✅ Gerenciar canais

## 🔧 Scripts Disponíveis

\`\`\`bash
# Desenvolvimento com auto-reload
npm run dev

# Produção
npm start

# Executar testes
npm test

# Deploy com PM2
npm run deploy

# Parar bot
npm run stop

# Logs em tempo real
npm run logs

# Atualizar dependências
npm run update
\`\`\`

## 📊 Monitoramento

### Logs
- Logs são salvos em \`logs/\`
- Use \`npm run logs\` para ver em tempo real
- Configurado com rotação automática

### Métricas
- Uptime do bot
- Comandos executados
- Usuários ativos
- Servidores conectados

### Alertas
- Notificações de erro por webhook
- Monitoramento de performance
- Alertas de desconexão

## 🛠️ Solução de Problemas

### Erros Comuns

**Bot não conecta:**
1. Verifique se o token está correto
2. Confirme se o bot está adicionado ao servidor
3. Verifique as permissões do bot

**Comandos não funcionam:**
1. Confirme o prefixo correto
2. Verifique se o bot tem permissões para ler mensagens
3. Confirme se o canal permite bots

**Performance lenta:**
1. Verifique a latência da conexão
2. Optimize comandos pesados
3. Use cache quando possível

### Logs de Debug
\`\`\`bash
# Ativar modo debug
export DEBUG=true
npm start

# Ver logs específicos
npm run logs -- --filter=error
\`\`\`

## 🔒 Segurança

### Boas Práticas
- ✅ Nunca compartilhe seu token
- ✅ Use variáveis de ambiente
- ✅ Mantenha dependências atualizadas
- ✅ Configure rate limiting
- ✅ Valide todas as entradas

### Backup
- Faça backup regular das configurações
- Exporte dados importantes
- Mantenha versões do código

## 🆘 Suporte

### Recursos Úteis
- 📧 Email: support@botcraft.dev
- 🌐 Site: [botcraft.dev](https://botcraft.dev)
- 📚 Documentação: [docs.botcraft.dev](https://docs.botcraft.dev)
- 💬 Discord: [discord.gg/botcraft](https://discord.gg/botcraft)

### FAQ
**P: Como adicionar novos comandos?**
R: Use o BotCraft para gerar novos comandos ou edite manualmente os arquivos em \`commands/\`

**P: Posso modificar o código?**
R: Sim! O código é 100% editável e customizável

**P: Como atualizar o bot?**
R: Baixe a nova versão do BotCraft e substitua os arquivos

---

**Bot criado com ❤️ usando [BotCraft](https://botcraft.dev)**

*A forma mais avançada e profissional de criar bots Discord!*
`;
  };

  const generatePackageJson = () => {
    return JSON.stringify({
      "name": botName.toLowerCase().replace(/\s+/g, '-'),
      "version": "1.0.0",
      "description": `Bot Discord profissional criado com BotCraft - ${commands.length} comandos incluídos`,
      "main": "index.js",
      "scripts": {
        "start": "node index.js",
        "dev": "nodemon index.js",
        "test": "jest",
        "deploy": "pm2 start ecosystem.config.js",
        "stop": "pm2 stop ecosystem.config.js",
        "logs": "pm2 logs",
        "monitor": "pm2 monit",
        "update": "npm update && npm audit fix"
      },
      "dependencies": {
        "discord.js": "^14.14.1",
        "axios": "^1.6.0",
        "jszip": "^3.10.1",
        "dotenv": "^16.3.1"
      },
      "devDependencies": {
        "nodemon": "^3.0.1",
        "jest": "^29.7.0",
        "@types/jest": "^29.5.5"
      },
      "engines": {
        "node": ">=16.0.0"
      },
      "keywords": [
        "discord",
        "bot",
        "botcraft",
        "javascript",
        "automation"
      ],
      "author": "BotCraft User",
      "license": "MIT",
      "repository": {
        "type": "git",
        "url": "https://github.com/username/repo.git"
      }
    }, null, 2);
  };

  const generateEcosystemConfig = () => {
    return `// Configuração PM2 para produção
module.exports = {
  apps: [{
    name: '${botName.toLowerCase().replace(/\s+/g, '-')}',
    script: 'index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};`;
  };

  const generateEnvExample = () => {
    return `# =================================
# CONFIGURAÇÃO DO BOT DISCORD
# =================================

# Token do bot Discord (OBRIGATÓRIO)
# Obtenha em: https://discord.com/developers/applications
DISCORD_TOKEN=seu_token_discord_aqui

# =================================
# CONFIGURAÇÕES BÁSICAS
# =================================

# Prefixo dos comandos
BOT_PREFIX=!

# Nome do bot
BOT_NAME=${botName}

# Ambiente de execução
NODE_ENV=production

# Ativar modo debug (true/false)
DEBUG=false

# =================================
# CONFIGURAÇÕES DE DEPLOY
# =================================

# Porta para serviços web (Railway, Heroku, etc.)
PORT=3000

# URL base do seu bot (para webhooks)
BASE_URL=https://seu-bot.herokuapp.com

# =================================
# APIs EXTERNAS (OPCIONAL)
# =================================

# Google API (para comandos de busca)
GOOGLE_API_KEY=sua_chave_google_aqui
GOOGLE_CX=seu_custom_search_id

# OpenWeather API (para comandos de clima)
WEATHER_API_KEY=sua_chave_openweather_aqui

# NewsAPI (para comandos de notícias)
NEWS_API_KEY=sua_chave_newsapi_aqui

# =================================
# BANCO DE DADOS (OPCIONAL)
# =================================

# MongoDB
MONGODB_URI=mongodb://localhost:27017/discordbot

# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/botdb

# Redis (para cache)
REDIS_URL=redis://localhost:6379

# =================================
# CONFIGURAÇÕES DE SEGURANÇA
# =================================

# Chave secreta para JWT (se usando autenticação)
JWT_SECRET=sua_chave_secreta_muito_segura

# Webhook para logs de erro
ERROR_WEBHOOK_URL=https://discord.com/api/webhooks/...

# =================================
# CONFIGURAÇÕES DE PERFORMANCE
# =================================

# Limite de rate limiting (requests por minuto)
RATE_LIMIT=60

# Cache TTL em segundos
CACHE_TTL=300

# Máximo de comandos simultâneos
MAX_CONCURRENT_COMMANDS=10`;
  };

  const generateStartupScript = () => {
    return `#!/bin/bash

# Script de inicialização do bot
echo "🚀 Iniciando ${botName}..."

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale Node.js 16+ primeiro."
    exit 1
fi

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Instale npm primeiro."
    exit 1
fi

# Verificar se o arquivo .env existe
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado. Copiando .env.example..."
    cp .env.example .env
    echo "📝 Configure o arquivo .env com seu token Discord antes de continuar."
    exit 1
fi

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Criar diretório de logs se não existir
mkdir -p logs

# Verificar se PM2 está instalado (para produção)
if command -v pm2 &> /dev/null; then
    echo "🔄 Usando PM2 para produção..."
    pm2 start ecosystem.config.js
    pm2 save
else
    echo "🛠️  Iniciando em modo desenvolvimento..."
    npm run dev
fi

echo "✅ Bot iniciado com sucesso!"`;
  };

  const downloadSetup = () => {
    const files = {
      'README.md': generateReadme(),
      'package.json': generatePackageJson(),
      '.env.example': generateEnvExample(),
      ...(includeStartupScripts && {
        'ecosystem.config.js': generateEcosystemConfig(),
        'start.sh': generateStartupScript()
      })
    };

    // Simular download
    toast({
      title: "Ambiente configurado!",
      description: "Todos os arquivos de configuração foram gerados.",
    });

    console.log('Files generated:', Object.keys(files));
  };

  const selectedOption = deploymentOptions.find(opt => opt.id === selectedDeployment);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5 text-blue-500" />
            Configuração Automática do Ambiente
          </CardTitle>
          <p className="text-muted-foreground">
            Configure automaticamente tudo que você precisa para rodar seu bot
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Deployment Selection */}
            <div className="space-y-4">
              <h3 className="font-medium">Escolha a plataforma de deploy:</h3>
              <Select value={selectedDeployment} onValueChange={setSelectedDeployment}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {deploymentOptions.map(option => (
                    <SelectItem key={option.id} value={option.id}>
                      <div className="flex items-center space-x-2">
                        <span>{option.icon}</span>
                        <span>{option.name}</span>
                        {option.free && <Badge variant="secondary" className="text-xs">Grátis</Badge>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedOption && (
                <Card className="bg-background border-border">
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{selectedOption.name}</span>
                        <div className="flex space-x-2">
                          <Badge variant={selectedOption.free ? "secondary" : "outline"}>
                            {selectedOption.free ? 'Grátis' : 'Pago'}
                          </Badge>
                          <Badge variant="outline">{selectedOption.difficulty}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{selectedOption.description}</p>
                      <div className="space-y-1">
                        {selectedOption.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-sm">
                            <CheckCircle className="mr-2 h-3 w-3 text-green-500" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Options */}
            <div className="space-y-4">
              <h3 className="font-medium">Opções de configuração:</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Documentação completa</label>
                  <Switch 
                    checked={includeDocumentation} 
                    onCheckedChange={setIncludeDocumentation}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Scripts de inicialização</label>
                  <Switch 
                    checked={includeStartupScripts} 
                    onCheckedChange={setIncludeStartupScripts}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Arquivos de ambiente</label>
                  <Switch 
                    checked={includeEnvironmentFiles} 
                    onCheckedChange={setIncludeEnvironmentFiles}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Guia de deploy</label>
                  <Switch 
                    checked={includeDeploymentGuide} 
                    onCheckedChange={setIncludeDeploymentGuide}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-4 border-t border-border">
            <Button 
              onClick={downloadSetup}
              className="bg-gradient-discord hover:bg-discord-dark text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Gerar Configuração Completa
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Tabs defaultValue="readme" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-muted">
          <TabsTrigger value="readme" className="data-[state=active]:bg-discord data-[state=active]:text-white">
            📚 README
          </TabsTrigger>
          <TabsTrigger value="package" className="data-[state=active]:bg-discord data-[state=active]:text-white">
            📦 Package
          </TabsTrigger>
          <TabsTrigger value="env" className="data-[state=active]:bg-discord data-[state=active]:text-white">
            ⚙️ Environment
          </TabsTrigger>
          <TabsTrigger value="scripts" className="data-[state=active]:bg-discord data-[state=active]:text-white">
            🚀 Scripts
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="readme" className="mt-4">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle>README.md</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-background border border-border rounded-lg p-4 overflow-x-auto text-xs max-h-96">
                {generateReadme()}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="package" className="mt-4">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle>package.json</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-background border border-border rounded-lg p-4 overflow-x-auto text-sm max-h-96">
                <code>{generatePackageJson()}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="env" className="mt-4">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle>.env.example</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-background border border-border rounded-lg p-4 overflow-x-auto text-sm max-h-96">
                <code>{generateEnvExample()}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scripts" className="mt-4">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle>start.sh</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-background border border-border rounded-lg p-4 overflow-x-auto text-sm max-h-96">
                <code>{generateStartupScript()}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Deployment Links */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle>Links Úteis para Deploy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {deploymentOptions.map(option => (
              <Button
                key={option.id}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 border-border"
                onClick={() => window.open(
                  option.id === 'replit' ? 'https://replit.com' :
                  option.id === 'railway' ? 'https://railway.app' :
                  option.id === 'heroku' ? 'https://heroku.com' :
                  'https://google.com/search?q=vps+hosting', '_blank'
                )}
              >
                <span className="text-2xl">{option.icon}</span>
                <span className="font-medium">{option.name}</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnvironmentSetup;