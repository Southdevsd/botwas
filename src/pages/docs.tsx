import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Book, Code, Zap, Bot, Shield, Users } from 'lucide-react';

const docs = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Documentação</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Aprenda a criar bots Discord incríveis com nossa plataforma
            </p>
          </div>

          <Tabs defaultValue="getting-started" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted">
              <TabsTrigger value="getting-started">Início</TabsTrigger>
              <TabsTrigger value="commands">Comandos</TabsTrigger>
              <TabsTrigger value="advanced">Avançado</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>

            <TabsContent value="getting-started" className="mt-6">
              <div className="grid gap-6">
                <Card className="bg-card/50 border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Book className="mr-2 h-5 w-5" />
                      Primeiros Passos
                    </CardTitle>
                    <CardDescription>
                      Como começar a criar seus primeiros bots
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-background rounded-lg">
                        <div className="font-semibold mb-2">1. Login</div>
                        <p className="text-sm text-muted-foreground">
                          Entre com Discord ou GitHub para acessar sua conta
                        </p>
                      </div>
                      <div className="p-4 bg-background rounded-lg">
                        <div className="font-semibold mb-2">2. Criar Bot</div>
                        <p className="text-sm text-muted-foreground">
                          Clique em "Criar Novo Bot" e configure as informações básicas
                        </p>
                      </div>
                      <div className="p-4 bg-background rounded-lg">
                        <div className="font-semibold mb-2">3. Adicionar Comandos</div>
                        <p className="text-sm text-muted-foreground">
                          Selecione comandos ou use IA para criar personalizados
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bot className="mr-2 h-5 w-5" />
                      Configuração do Bot Discord
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">1. Criar Aplicação no Discord</h3>
                      <p className="text-muted-foreground mb-2">
                        Acesse o <a href="https://discord.com/developers/applications" className="text-discord underline">Discord Developer Portal</a> e crie uma nova aplicação.
                      </p>
                      <div className="bg-background p-3 rounded-lg">
                        <code className="text-sm">
                          https://discord.com/developers/applications
                        </code>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">2. Obter Token</h3>
                      <p className="text-muted-foreground mb-2">
                        Na seção "Bot", clique em "Copy Token" para obter o token do seu bot.
                      </p>
                      <Badge className="bg-discord-red text-white">
                        Importante: Nunca compartilhe seu token!
                      </Badge>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">3. Convidar Bot</h3>
                      <p className="text-muted-foreground mb-2">
                        Use o link de convite gerado para adicionar o bot ao seu servidor:
                      </p>
                      <div className="bg-background p-3 rounded-lg">
                        <code className="text-sm break-all">
                          https://discord.com/oauth2/authorize?client_id=SEU_CLIENT_ID&permissions=8&scope=bot%20applications.commands
                        </code>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="commands" className="mt-6">
              <div className="grid gap-6">
                <Card className="bg-card/50 border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="mr-2 h-5 w-5" />
                      Tipos de Comandos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="p-4 bg-background rounded-lg">
                        <div className="flex items-center mb-2">
                          <Shield className="h-5 w-5 mr-2 text-discord-red" />
                          <span className="font-semibold">Moderação</span>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• /ban - Banir usuários</li>
                          <li>• /kick - Expulsar usuários</li>
                          <li>• /mute - Silenciar usuários</li>
                          <li>• /warn - Advertir usuários</li>
                        </ul>
                      </div>

                      <div className="p-4 bg-background rounded-lg">
                        <div className="flex items-center mb-2">
                          <Users className="h-5 w-5 mr-2 text-discord-blue" />
                          <span className="font-semibold">Utilidade</span>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• /userinfo - Info do usuário</li>
                          <li>• /serverinfo - Info do servidor</li>
                          <li>• /avatar - Avatar do usuário</li>
                          <li>• /ping - Latência do bot</li>
                        </ul>
                      </div>

                      <div className="p-4 bg-background rounded-lg">
                        <div className="flex items-center mb-2">
                          <Bot className="h-5 w-5 mr-2 text-discord-green" />
                          <span className="font-semibold">Diversão</span>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• /meme - Memes aleatórios</li>
                          <li>• /8ball - Bola 8 mágica</li>
                          <li>• /joke - Piadas</li>
                          <li>• /gif - GIFs animados</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border-border">
                  <CardHeader>
                    <CardTitle>Comandos Personalizados com IA</CardTitle>
                    <CardDescription>
                      Use nossa IA para criar comandos únicos para seu bot
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Como Funciona</h3>
                      <p className="text-muted-foreground mb-4">
                        Descreva o que você quer que o comando faça e nossa IA gerará o código automaticamente.
                      </p>
                      
                      <div className="bg-background p-4 rounded-lg">
                        <div className="mb-2 text-sm font-medium">Exemplo de Prompt:</div>
                        <div className="text-muted-foreground text-sm mb-3">
                          "Crie um comando que busque informações sobre animes no Google e retorne em um embed bonito"
                        </div>
                        <div className="text-sm font-medium mb-2">Resultado:</div>
                        <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
{`const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('anime')
    .setDescription('Busca informações sobre animes')
    .addStringOption(option =>
      option.setName('nome')
        .setDescription('Nome do anime')
        .setRequired(true)),
        
  async execute(interaction) {
    const anime = interaction.options.getString('nome');
    // Código de busca com Google API
    const embed = new EmbedBuilder()
      .setTitle(anime)
      .setDescription('Informações do anime...');
      
    await interaction.reply({ embeds: [embed] });
  }
};`}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="mt-6">
              <div className="grid gap-6">
                <Card className="bg-card/50 border-border">
                  <CardHeader>
                    <CardTitle>Sistema de Tickets</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Configure um sistema completo de suporte com tickets automáticos.
                    </p>
                    
                    <div className="bg-background p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Configuração Padrão:</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Canal de tickets com botões interativos</li>
                        <li>• Criação automática de canais privados</li>
                        <li>• Sistema de categorias (Suporte, Vendas, Bug Report)</li>
                        <li>• Logs de tickets fechados</li>
                        <li>• Tempo limite para tickets inativos</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border-border">
                  <CardHeader>
                    <CardTitle>Deploy e Hospedagem</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Opções de Deploy</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-background rounded-lg">
                          <div className="font-medium mb-1">Heroku</div>
                          <div className="text-xs text-muted-foreground">Deploy automático gratuito</div>
                        </div>
                        <div className="p-3 bg-background rounded-lg">
                          <div className="font-medium mb-1">Railway</div>
                          <div className="text-xs text-muted-foreground">$5/mês com créditos grátis</div>
                        </div>
                        <div className="p-3 bg-background rounded-lg">
                          <div className="font-medium mb-1">Replit</div>
                          <div className="text-xs text-muted-foreground">Ambiente de desenvolvimento</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="api" className="mt-6">
              <Card className="bg-card/50 border-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Code className="mr-2 h-5 w-5" />
                    API de Integração
                  </CardTitle>
                  <CardDescription>
                    Para usuários premium: acesse nossa API para integrações avançadas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-background p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Endpoints Disponíveis</h3>
                    <div className="space-y-2 text-sm">
                      <div><code className="bg-muted px-2 py-1 rounded">GET /api/bots</code> - Listar seus bots</div>
                      <div><code className="bg-muted px-2 py-1 rounded">POST /api/bots</code> - Criar novo bot</div>
                      <div><code className="bg-muted px-2 py-1 rounded">POST /api/generate</code> - Gerar comando com IA</div>
                      <div><code className="bg-muted px-2 py-1 rounded">GET /api/templates</code> - Listar templates</div>
                    </div>
                  </div>
                  
                  <div className="bg-background p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Autenticação</h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      Use sua API key no header Authorization:
                    </p>
                    <pre className="text-xs bg-muted p-2 rounded">
{`Authorization: Bearer YOUR_API_KEY`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default docs;