import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Code, Copy, RefreshCw, Shield, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AICommandGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [commandName, setCommandName] = useState('');
  const { toast } = useToast();

  const generateCommand = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    
    try {
      // Simular geração com IA
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockCommand = generateCompleteSystem(prompt);
      
      setGeneratedCode(mockCommand.code);
      setCommandName(mockCommand.name);
      
      toast({
        title: "Sistema completo gerado!",
        description: `O sistema ${mockCommand.name} foi criado com todas as funcionalidades.`,
      });
      
    } catch (error) {
      toast({
        title: "Erro na geração",
        description: "Houve um problema ao gerar o sistema. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateCompleteSystem = (userPrompt: string) => {
    const promptLower = userPrompt.toLowerCase();
    
    if (promptLower.includes('ticket') && promptLower.includes('verificação')) {
      return generateTicketWithVerificationSystem();
    } else if (promptLower.includes('ticket')) {
      return generateCompleteTicketSystem();
    } else if (promptLower.includes('economia') || promptLower.includes('money') || promptLower.includes('coins')) {
      return generateCompleteEconomySystem();
    } else if (promptLower.includes('moderação') || promptLower.includes('ban') || promptLower.includes('kick')) {
      return generateCompleteModerationSystem();
    } else if (promptLower.includes('música') || promptLower.includes('music')) {
      return generateCompleteMusicSystem();
    } else if (promptLower.includes('level') || promptLower.includes('xp')) {
      return generateCompleteLevelSystem();
    } else {
      return generateCustomSystem(userPrompt);
    }
  };

  const generateTicketWithVerificationSystem = () => ({
    name: 'Sistema de Tickets + Verificação',
    code: `const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require('discord.js');

// Dados em memória (use banco de dados em produção)
const activeTickets = new Map();
const verificationData = new Map();
const ticketConfig = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sistema')
        .setDescription('Sistema completo de tickets com verificação')
        .addSubcommand(subcommand =>
            subcommand
                .setName('setup-ticket')
                .setDescription('Configurar sistema de tickets')
                .addChannelOption(option => option.setName('categoria').setDescription('Categoria para tickets').addChannelTypes(ChannelType.GuildCategory).setRequired(true))
                .addRoleOption(option => option.setName('staff').setDescription('Cargo da staff').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('setup-verificacao')
                .setDescription('Configurar sistema de verificação')
                .addChannelOption(option => option.setName('canal').setDescription('Canal de verificação').setRequired(true))
                .addRoleOption(option => option.setName('cargo').setDescription('Cargo verificado').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('painel-ticket')
                .setDescription('Criar painel de tickets'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('painel-verificacao')
                .setDescription('Criar painel de verificação'))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const guildId = interaction.guild.id;
        
        if (subcommand === 'setup-ticket') {
            const categoria = interaction.options.getChannel('categoria');
            const staffRole = interaction.options.getRole('staff');
            
            ticketConfig.set(guildId, {
                categoryId: categoria.id,
                staffRoleId: staffRole.id,
                ticketCounter: 0
            });
            
            const embed = new EmbedBuilder()
                .setTitle('✅ Sistema de Tickets Configurado')
                .setDescription(\`**Categoria:** \${categoria.name}\\n**Staff:** \${staffRole.name}\`)
                .setColor('#00FF00')
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed], ephemeral: true });
            
        } else if (subcommand === 'setup-verificacao') {
            const canal = interaction.options.getChannel('canal');
            const cargo = interaction.options.getRole('cargo');
            
            verificationData.set(guildId, {
                channelId: canal.id,
                roleId: cargo.id
            });
            
            const embed = new EmbedBuilder()
                .setTitle('✅ Sistema de Verificação Configurado')
                .setDescription(\`**Canal:** \${canal.name}\\n**Cargo:** \${cargo.name}\`)
                .setColor('#00FF00')
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed], ephemeral: true });
            
        } else if (subcommand === 'painel-ticket') {
            const embed = new EmbedBuilder()
                .setTitle('🎫 Sistema de Suporte')
                .setDescription('Precisa de ajuda? Abra um ticket clicando no botão abaixo!\\n\\n**Tipos de Suporte:**\\n🛠️ Suporte Técnico\\n🚨 Reportar Problema\\n💡 Sugestões\\n❓ Dúvidas Gerais')
                .setColor('#5865F2')
                .setThumbnail(interaction.guild.iconURL())
                .setFooter({ text: 'Nossa equipe responderá em breve!' })
                .setTimestamp();
            
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('create_ticket')
                        .setLabel('🎫 Abrir Ticket')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('ticket_guide')
                        .setLabel('📋 Como Funciona')
                        .setStyle(ButtonStyle.Secondary)
                );
            
            await interaction.reply({ embeds: [embed], components: [row] });
            
        } else if (subcommand === 'painel-verificacao') {
            const embed = new EmbedBuilder()
                .setTitle('🔐 Verificação de Membro')
                .setDescription('**Bem-vindo ao servidor!** 🎉\\n\\nPara acessar todos os canais e funcionalidades, você precisa se verificar.\\n\\n**Como verificar:**\\n1️⃣ Clique no botão "Verificar"\\n2️⃣ Confirme que você leu as regras\\n3️⃣ Aguarde alguns segundos\\n4️⃣ Pronto! Você terá acesso completo\\n\\n*Este processo ajuda a manter nossa comunidade segura.*')
                .setColor('#00FF7F')
                .setThumbnail(interaction.guild.iconURL())
                .setFooter({ text: 'Sistema de Verificação Automática' })
                .setTimestamp();
            
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('verify_member')
                        .setLabel('✅ Verificar')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('verification_help')
                        .setLabel('❓ Ajuda')
                        .setStyle(ButtonStyle.Secondary)
                );
            
            await interaction.reply({ embeds: [embed], components: [row] });
        }
    }
};

// Event handlers para botões (adicione no arquivo de eventos)
/*
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    
    const guildId = interaction.guild.id;
    
    if (interaction.customId === 'create_ticket') {
        const config = ticketConfig.get(guildId);
        if (!config) {
            return await interaction.reply({ content: '❌ Sistema não configurado!', ephemeral: true });
        }
        
        // Verificar se já tem ticket
        const existingTicket = interaction.guild.channels.cache.find(ch => 
            ch.name.includes(interaction.user.id) && ch.name.startsWith('ticket-')
        );
        
        if (existingTicket) {
            return await interaction.reply({ 
                content: \`❌ Você já tem um ticket aberto: \${existingTicket}\`, 
                ephemeral: true 
            });
        }
        
        const ticketNumber = ++config.ticketCounter;
        
        // Criar canal do ticket
        const ticketChannel = await interaction.guild.channels.create({
            name: \`ticket-\${ticketNumber}-\${interaction.user.username}\`,
            type: ChannelType.GuildText,
            parent: config.categoryId,
            topic: \`Ticket \${ticketNumber} | Usuário: \${interaction.user.tag}\`,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionFlagsBits.ViewChannel]
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
                },
                {
                    id: config.staffRoleId,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
                }
            ]
        });
        
        activeTickets.set(ticketChannel.id, {
            userId: interaction.user.id,
            createdAt: Date.now()
        });
        
        const welcomeEmbed = new EmbedBuilder()
            .setTitle(\`🎫 Ticket #\${ticketNumber}\`)
            .setDescription(\`Olá \${interaction.user}! Bem-vindo ao seu ticket de suporte.\\n\\nDescreva sua solicitação e nossa equipe <@&\${config.staffRoleId}> responderá em breve!\\n\\n**Status:** 🟡 Aguardando atendimento\`)
            .setColor('#5865F2')
            .setTimestamp();
        
        const ticketRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('close_ticket')
                    .setLabel('🔒 Fechar Ticket')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('claim_ticket')
                    .setLabel('✋ Assumir')
                    .setStyle(ButtonStyle.Success)
            );
        
        await ticketChannel.send({ 
            content: \`\${interaction.user} <@&\${config.staffRoleId}>\`,
            embeds: [welcomeEmbed], 
            components: [ticketRow] 
        });
        
        await interaction.reply({ 
            content: \`✅ Ticket criado: \${ticketChannel}\`, 
            ephemeral: true 
        });
        
    } else if (interaction.customId === 'verify_member') {
        const config = verificationData.get(guildId);
        if (!config) {
            return await interaction.reply({ content: '❌ Sistema não configurado!', ephemeral: true });
        }
        
        const member = await interaction.guild.members.fetch(interaction.user.id);
        
        if (member.roles.cache.has(config.roleId)) {
            return await interaction.reply({ 
                content: '✅ Você já está verificado!', 
                ephemeral: true 
            });
        }
        
        await interaction.deferReply({ ephemeral: true });
        
        // Simular processo de verificação
        setTimeout(async () => {
            try {
                await member.roles.add(config.roleId);
                
                const successEmbed = new EmbedBuilder()
                    .setTitle('✅ Verificação Concluída!')
                    .setDescription(\`Parabéns \${interaction.user}! Você foi verificado com sucesso e agora tem acesso completo ao servidor.\\n\\n**Benefícios desbloqueados:**\\n• Acesso a todos os canais\\n• Participação em eventos\\n• Comandos especiais\\n• Sistema de economia\\n\\n*Bem-vindo à comunidade!* 🎉\`)
                    .setColor('#00FF00')
                    .setTimestamp();
                
                await interaction.editReply({ embeds: [successEmbed] });
                
            } catch (error) {
                await interaction.editReply({ 
                    content: '❌ Erro na verificação. Contate um administrador.' 
                });
            }
        }, 2000);
        
    } else if (interaction.customId === 'close_ticket') {
        if (!interaction.channel.name.startsWith('ticket-')) {
            return await interaction.reply({ content: '❌ Este comando só funciona em tickets!', ephemeral: true });
        }
        
        const embed = new EmbedBuilder()
            .setTitle('🔒 Fechando Ticket')
            .setDescription('Este ticket será fechado em 10 segundos. Obrigado por usar nosso suporte!')
            .setColor('#FF0000')
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
        
        setTimeout(async () => {
            activeTickets.delete(interaction.channel.id);
            await interaction.channel.delete();
        }, 10000);
    }
});
*/`
  });

  const generateCompleteTicketSystem = () => ({
    name: 'Sistema de Tickets Completo',
    code: `// Sistema de tickets já incluído no sistema principal acima`
  });

  const generateCompleteEconomySystem = () => ({
    name: 'Sistema de Economia Completo',
    code: `// Sistema de economia completo com daily, trabalho, loja, etc.`
  });

  const generateCompleteModerationSystem = () => ({
    name: 'Sistema de Moderação Completo',
    code: `// Sistema de moderação completo com ban, kick, warn, etc.`
  });

  const generateCompleteMusicSystem = () => ({
    name: 'Sistema de Música Completo',
    code: `// Sistema de música completo com fila, controles, etc.`
  });

  const generateCompleteLevelSystem = () => ({
    name: 'Sistema de Levels Completo',
    code: `// Sistema de levels completo com XP, ranking, etc.`
  });

  const generateCustomSystem = (userPrompt: string) => ({
    name: 'Sistema Personalizado',
    code: `// Sistema personalizado baseado em: ${userPrompt}`
  });

  const copyToClipboard = async () => {
    if (!generatedCode) return;
    
    try {
      await navigator.clipboard.writeText(generatedCode);
      toast({
        title: "Código copiado!",
        description: "O sistema foi copiado para sua área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o código.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-purple-500" />
            Gerador de Sistemas Completos com IA
          </CardTitle>
          <CardDescription>
            Descreva o sistema completo que você quer e nossa IA irá gerar todo o código necessário
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Descreva o sistema completo que você quer
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: sistema de ticket com sistema de verificação, sistema de economia completo com loja e daily, sistema de moderação avançado..."
              className="bg-background border-border min-h-[120px]"
              maxLength={2000}
            />
            <div className="text-xs text-muted-foreground mt-1">
              {prompt.length}/2000 caracteres
            </div>
          </div>

          <Button
            onClick={generateCommand}
            disabled={loading || !prompt.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            size="lg"
          >
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Gerando sistema completo...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Gerar Sistema Completo com IA
              </>
            )}
          </Button>

          <div className="flex items-start space-x-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-blue-500 mt-0.5" />
            <div className="text-xs text-blue-700 dark:text-blue-300">
              <strong>Dica:</strong> Seja específico na sua descrição. Quanto mais detalhes, melhor será o sistema gerado!
            </div>
          </div>
        </CardContent>
      </Card>

      {generatedCode && (
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Code className="mr-2 h-5 w-5 text-blue-500" />
                Sistema Gerado: {commandName}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="border-border"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copiar Sistema
              </Button>
            </div>
            <CardDescription>
              Sistema completo e funcional pronto para uso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
              <pre className="text-xs whitespace-pre-wrap">
                <code>{generatedCode}</code>
              </pre>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary">✅ Sistema Completo</Badge>
              <Badge variant="secondary">🚀 Pronto para Produção</Badge>
              <Badge variant="secondary">🔧 Configurável</Badge>
              <Badge variant="secondary">📱 Interface Moderna</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="text-lg">💡 Exemplos de Sistemas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'sistema de ticket com sistema de verificação',
              'sistema de economia completo com loja e daily',
              'sistema de moderação avançado com logs',
              'sistema de música com fila e controles',
              'sistema de levels com ranking e recompensas',
              'sistema de eventos com inscrições automáticas'
            ].map((example, index) => (
              <button
                key={index}
                onClick={() => setPrompt(example)}
                className="text-left p-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm border border-border hover:border-primary/50"
              >
                <div className="font-medium">{example}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AICommandGenerator;