interface CommandTemplate {
  name: string;
  category: string;
  code: string;
  description: string;
}

export class AICodeGenerator {
  private templates: Map<string, CommandTemplate[]> = new Map();

  constructor() {
    this.initializeTemplates();
  }

  private initializeTemplates() {
    // Templates de comandos por categoria
    this.templates.set('ticket', [
      {
        name: 'ticket-system',
        category: 'ticket',
        description: 'Sistema completo de tickets com categorias',
        code: this.getTicketSystemCode()
      }
    ]);

    this.templates.set('economy', [
      {
        name: 'economy-system',
        category: 'economy',
        description: 'Sistema de economia completo',
        code: this.getEconomySystemCode()
      }
    ]);

    this.templates.set('moderation', [
      {
        name: 'moderation-system',
        category: 'moderation',
        description: 'Sistema de moderação avançado',
        code: this.getModerationSystemCode()
      }
    ]);

    this.templates.set('music', [
      {
        name: 'music-system',
        category: 'music',
        description: 'Sistema de música completo',
        code: this.getMusicSystemCode()
      }
    ]);

    this.templates.set('utility', [
      {
        name: 'utility-commands',
        category: 'utility',
        description: 'Comandos utilitários diversos',
        code: this.getUtilitySystemCode()
      }
    ]);
  }

  public generateCode(prompt: string): CommandTemplate {
    const analysisResult = this.analyzePrompt(prompt);
    const category = this.categorizePrompt(analysisResult);
    const template = this.selectBestTemplate(category, analysisResult);
    
    return this.customizeTemplate(template, analysisResult);
  }

  private analyzePrompt(prompt: string) {
    const keywords = prompt.toLowerCase().split(/\s+/);
    const features = this.extractFeatures(prompt);
    const complexity = this.assessComplexity(prompt);
    
    return {
      keywords,
      features,
      complexity,
      originalPrompt: prompt
    };
  }

  private extractFeatures(prompt: string): string[] {
    const featurePatterns = {
      'embed': /embed|mensagem|bonita|colorida|visual/i,
      'buttons': /botão|button|clicável|interação/i,
      'modal': /modal|formulário|input|campo/i,
      'permissions': /permissão|admin|moderador|role/i,
      'database': /salvar|banco|dados|persistir/i,
      'api': /api|buscar|search|google|externa/i,
      'timer': /timer|tempo|delay|agendado/i,
      'random': /aleatório|random|sorteio|escolher/i
    };

    const features: string[] = [];
    Object.entries(featurePatterns).forEach(([feature, pattern]) => {
      if (pattern.test(prompt)) {
        features.push(feature);
      }
    });

    return features;
  }

  private assessComplexity(prompt: string): 'simple' | 'medium' | 'complex' {
    const complexityIndicators = {
      simple: /comando simples|básico|apenas/i,
      complex: /sistema|completo|avançado|múltiplas|categorias|database/i
    };

    if (complexityIndicators.complex.test(prompt)) return 'complex';
    if (complexityIndicators.simple.test(prompt)) return 'simple';
    return 'medium';
  }

  private categorizePrompt(analysis: any): string {
    const categoryKeywords = {
      ticket: ['ticket', 'suporte', 'atendimento', 'support'],
      economy: ['economia', 'money', 'coins', 'moedas', 'saldo', 'daily'],
      moderation: ['moderação', 'ban', 'kick', 'timeout', 'warn', 'clear'],
      music: ['música', 'music', 'play', 'tocar', 'som'],
      utility: ['utility', 'util', 'info', 'search', 'buscar']
    };

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => analysis.keywords.includes(keyword))) {
        return category;
      }
    }

    return 'utility';
  }

  private selectBestTemplate(category: string, analysis: any): CommandTemplate {
    const templates = this.templates.get(category) || this.templates.get('utility')!;
    return templates[0]; // Por enquanto retorna o primeiro template
  }

  private customizeTemplate(template: CommandTemplate, analysis: any): CommandTemplate {
    let customizedCode = template.code;
    
    // Personalizar com base nas features detectadas
    if (analysis.features.includes('embed')) {
      customizedCode = this.enhanceWithEmbeds(customizedCode);
    }
    
    if (analysis.features.includes('buttons')) {
      customizedCode = this.enhanceWithButtons(customizedCode);
    }

    // Personalizar nome do comando baseado no prompt
    const commandName = this.extractCommandName(analysis.originalPrompt) || template.name;
    customizedCode = customizedCode.replace(/\.setName\('.*?'\)/, `.setName('${commandName}')`);

    return {
      ...template,
      name: commandName,
      code: customizedCode
    };
  }

  private extractCommandName(prompt: string): string {
    // Extrair nome do comando do prompt
    const namePatterns = [
      /comando\s+(\w+)/i,
      /\/(\w+)/,
      /chamado\s+(\w+)/i,
      /nome\s+(\w+)/i
    ];

    for (const pattern of namePatterns) {
      const match = prompt.match(pattern);
      if (match) {
        return match[1].toLowerCase();
      }
    }

    return '';
  }

  private enhanceWithEmbeds(code: string): string {
    // Adicionar configurações avançadas de embed se não existirem
    if (!code.includes('.setThumbnail')) {
      code = code.replace(
        '.setTimestamp();',
        '.setThumbnail(interaction.user.displayAvatarURL())\n            .setTimestamp();'
      );
    }
    return code;
  }

  private enhanceWithButtons(code: string): string {
    // Adicionar botões se não existirem
    if (!code.includes('ButtonBuilder')) {
      const buttonImport = code.includes('ActionRowBuilder') ? '' : ', ActionRowBuilder, ButtonBuilder, ButtonStyle';
      code = code.replace(
        'const { SlashCommandBuilder, EmbedBuilder',
        `const { SlashCommandBuilder, EmbedBuilder${buttonImport}`
      );
    }
    return code;
  }

  private getTicketSystemCode(): string {
    return `const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Sistema avançado de tickets para suporte')
        .addSubcommand(subcommand =>
            subcommand
                .setName('setup')
                .setDescription('Configurar sistema de tickets')
                .addChannelOption(option =>
                    option.setName('canal')
                        .setDescription('Canal para enviar painel de tickets')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('close')
                .setDescription('Fechar ticket atual'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Adicionar usuário ao ticket')
                .addUserOption(option =>
                    option.setName('usuario')
                        .setDescription('Usuário para adicionar')
                        .setRequired(true))),
    
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        
        if (subcommand === 'setup') {
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
                return await interaction.reply({
                    content: '❌ Você precisa da permissão "Gerenciar Canais" para usar este comando!',
                    ephemeral: true
                });
            }
            
            const channel = interaction.options.getChannel('canal');
            
            const embed = new EmbedBuilder()
                .setTitle('🎫 Sistema de Tickets')
                .setDescription('**Precisa de ajuda?** Clique em um dos botões abaixo para abrir um ticket!\\n\\n🔧 **Suporte Técnico** - Problemas com bots ou servidor\\n💰 **Suporte Financeiro** - Questões sobre pagamentos\\n📋 **Suporte Geral** - Outras dúvidas')
                .setColor('#5865F2')
                .setThumbnail(interaction.guild.iconURL())
                .setFooter({ text: 'Sistema de Tickets Avançado' })
                .setTimestamp();
            
            const buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('ticket_technical')
                        .setLabel('🔧 Suporte Técnico')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('ticket_financial')
                        .setLabel('💰 Suporte Financeiro')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('ticket_general')
                        .setLabel('📋 Suporte Geral')
                        .setStyle(ButtonStyle.Secondary)
                );
            
            await channel.send({ embeds: [embed], components: [buttons] });
            
            const successEmbed = new EmbedBuilder()
                .setTitle('✅ Sistema Configurado')
                .setDescription(\`Painel de tickets enviado para \${channel}!\`)
                .setColor('#00FF00')
                .setTimestamp();
            
            await interaction.reply({ embeds: [successEmbed], ephemeral: true });
            
        } else if (subcommand === 'close') {
            if (!interaction.channel.name.startsWith('ticket-')) {
                return await interaction.reply({
                    content: '❌ Este comando só pode ser usado em canais de ticket!',
                    ephemeral: true
                });
            }
            
            const embed = new EmbedBuilder()
                .setTitle('🔒 Fechando Ticket')
                .setDescription('Este ticket será fechado em 5 segundos...')
                .setColor('#FF0000')
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
            
            setTimeout(async () => {
                await interaction.channel.delete();
            }, 5000);
            
        } else if (subcommand === 'add') {
            if (!interaction.channel.name.startsWith('ticket-')) {
                return await interaction.reply({
                    content: '❌ Este comando só pode ser usado em canais de ticket!',
                    ephemeral: true
                });
            }
            
            const user = interaction.options.getUser('usuario');
            
            await interaction.channel.permissionOverwrites.create(user, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true
            });
            
            const embed = new EmbedBuilder()
                .setTitle('✅ Usuário Adicionado')
                .setDescription(\`\${user} foi adicionado ao ticket!\`)
                .setColor('#00FF00')
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
        }
    }
};

// Event handler para botões (adicione em um arquivo separado de eventos)
/*
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    
    if (interaction.customId.startsWith('ticket_')) {
        const type = interaction.customId.split('_')[1];
        const typeNames = {
            technical: 'Técnico',
            financial: 'Financeiro',
            general: 'Geral'
        };
        
        const typeName = typeNames[type];
        const channelName = \`ticket-\${typeName.toLowerCase()}-\${interaction.user.username}\`;
        
        // Verificar se já tem ticket aberto
        const existingChannel = interaction.guild.channels.cache.find(
            channel => channel.name === channelName
        );
        
        if (existingChannel) {
            return await interaction.reply({
                content: \`❌ Você já tem um ticket aberto: \${existingChannel}\`,
                ephemeral: true
            });
        }
        
        // Criar canal do ticket
        const ticketChannel = await interaction.guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionFlagsBits.ViewChannel]
                },
                {
                    id: interaction.user.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory
                    ]
                }
            ]
        });
        
        const welcomeEmbed = new EmbedBuilder()
            .setTitle(\`🎫 Ticket de Suporte \${typeName}\`)
            .setDescription(\`Olá \${interaction.user}! Descreva seu problema e nossa equipe te ajudará o mais rápido possível.\\n\\n**Tipo:** \${typeName}\\n**Status:** Aguardando resposta\`)
            .setColor('#5865F2')
            .setTimestamp();
        
        const closeButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('close_ticket')
                    .setLabel('🔒 Fechar Ticket')
                    .setStyle(ButtonStyle.Danger)
            );
        
        await ticketChannel.send({
            content: \`\${interaction.user}\`,
            embeds: [welcomeEmbed],
            components: [closeButton]
        });
        
        await interaction.reply({
            content: \`✅ Ticket criado: \${ticketChannel}\`,
            ephemeral: true
        });
    }
    
    if (interaction.customId === 'close_ticket') {
        const embed = new EmbedBuilder()
            .setTitle('🔒 Fechando Ticket')
            .setDescription('Este ticket será fechado em 5 segundos...')
            .setColor('#FF0000')
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
        
        setTimeout(async () => {
            await interaction.channel.delete();
        }, 5000);
    }
});
*/`;
  }

  private getEconomySystemCode(): string {
    return `const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Sistema de economia com arquivo JSON
const economyFile = path.join(__dirname, '..', 'data', 'economy.json');

// Função para carregar dados
function loadEconomy() {
    try {
        if (!fs.existsSync(economyFile)) {
            fs.mkdirSync(path.dirname(economyFile), { recursive: true });
            fs.writeFileSync(economyFile, JSON.stringify({}));
            return {};
        }
        return JSON.parse(fs.readFileSync(economyFile, 'utf8'));
    } catch (error) {
        console.error('Erro ao carregar economia:', error);
        return {};
    }
}

// Função para salvar dados
function saveEconomy(data) {
    try {
        fs.writeFileSync(economyFile, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Erro ao salvar economia:', error);
    }
}

// Função para obter dados do usuário
function getUserData(userId) {
    const economy = loadEconomy();
    if (!economy[userId]) {
        economy[userId] = {
            coins: 100,
            bank: 0,
            lastDaily: 0,
            lastWork: 0,
            level: 1,
            xp: 0
        };
        saveEconomy(economy);
    }
    return economy[userId];
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('economy')
        .setDescription('Sistema completo de economia')
        .addSubcommand(subcommand =>
            subcommand
                .setName('balance')
                .setDescription('Ver saldo')
                .addUserOption(option =>
                    option.setName('usuario')
                        .setDescription('Ver saldo de outro usuário')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('daily')
                .setDescription('Coletar recompensa diária'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('work')
                .setDescription('Trabalhar para ganhar moedas'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('transfer')
                .setDescription('Transferir moedas')
                .addUserOption(option =>
                    option.setName('usuario')
                        .setDescription('Usuário para transferir')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('quantidade')
                        .setDescription('Quantidade de moedas')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('deposit')
                .setDescription('Depositar no banco')
                .addIntegerOption(option =>
                    option.setName('quantidade')
                        .setDescription('Quantidade para depositar')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('withdraw')
                .setDescription('Sacar do banco')
                .addIntegerOption(option =>
                    option.setName('quantidade')
                        .setDescription('Quantidade para sacar')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('leaderboard')
                .setDescription('Ver ranking de economia')),
    
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const economy = loadEconomy();
        
        if (subcommand === 'balance') {
            const target = interaction.options.getUser('usuario') || interaction.user;
            const userData = getUserData(target.id);
            
            const total = userData.coins + userData.bank;
            const nextLevelXP = userData.level * 1000;
            const progress = (userData.xp / nextLevelXP * 100).toFixed(1);
            
            const embed = new EmbedBuilder()
                .setTitle(\`💰 Economia de \${target.displayName}\`)
                .setDescription(\`**Carteira:** \${userData.coins.toLocaleString()} 🪙\\n**Banco:** \${userData.bank.toLocaleString()} 🏦\\n**Total:** \${total.toLocaleString()} 💎\\n\\n**Level:** \${userData.level} (\${progress}%)\\n**XP:** \${userData.xp}/\${nextLevelXP}\`)
                .setColor('#FFD700')
                .setThumbnail(target.displayAvatarURL())
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
            
        } else if (subcommand === 'daily') {
            const userData = getUserData(interaction.user.id);
            const now = Date.now();
            const oneDay = 24 * 60 * 60 * 1000;
            
            if (now - userData.lastDaily < oneDay) {
                const timeLeft = oneDay - (now - userData.lastDaily);
                const hours = Math.floor(timeLeft / (60 * 60 * 1000));
                const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
                
                return await interaction.reply({
                    content: \`⏰ Você já coletou sua recompensa diária! Volte em \${hours}h \${minutes}m\`,
                    ephemeral: true
                });
            }
            
            const baseAmount = 200;
            const levelBonus = userData.level * 50;
            const dailyAmount = baseAmount + levelBonus + Math.floor(Math.random() * 100);
            const xpGained = 50;
            
            userData.coins += dailyAmount;
            userData.xp += xpGained;
            userData.lastDaily = now;
            
            // Verificar level up
            const nextLevelXP = userData.level * 1000;
            if (userData.xp >= nextLevelXP) {
                userData.level++;
                userData.xp -= nextLevelXP;
            }
            
            economy[interaction.user.id] = userData;
            saveEconomy(economy);
            
            const embed = new EmbedBuilder()
                .setTitle('🎁 Recompensa Diária Coletada!')
                .setDescription(\`**Moedas recebidas:** \${dailyAmount.toLocaleString()} 🪙\\n**XP ganho:** \${xpGained} ⭐\\n\\n**Novo saldo:** \${userData.coins.toLocaleString()} 🪙\\n**Level:** \${userData.level}\`)
                .setColor('#00FF00')
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
            
        } else if (subcommand === 'work') {
            const userData = getUserData(interaction.user.id);
            const now = Date.now();
            const workCooldown = 60 * 60 * 1000; // 1 hora
            
            if (now - userData.lastWork < workCooldown) {
                const timeLeft = workCooldown - (now - userData.lastWork);
                const minutes = Math.floor(timeLeft / (60 * 1000));
                
                return await interaction.reply({
                    content: \`⏰ Você está cansado! Descanse por mais \${minutes} minutos.\`,
                    ephemeral: true
                });
            }
            
            const jobs = [
                { name: 'Programador', min: 400, max: 800, emoji: '💻' },
                { name: 'Designer', min: 300, max: 600, emoji: '🎨' },
                { name: 'Vendedor', min: 200, max: 500, emoji: '🛒' },
                { name: 'Entregador', min: 150, max: 350, emoji: '🚚' },
                { name: 'Limpeza', min: 100, max: 250, emoji: '🧹' }
            ];
            
            const job = jobs[Math.floor(Math.random() * jobs.length)];
            const earned = Math.floor(Math.random() * (job.max - job.min + 1)) + job.min;
            const xpGained = Math.floor(earned / 10);
            
            userData.coins += earned;
            userData.xp += xpGained;
            userData.lastWork = now;
            
            economy[interaction.user.id] = userData;
            saveEconomy(economy);
            
            const embed = new EmbedBuilder()
                .setTitle(\`\${job.emoji} Trabalho Concluído!\`)
                .setDescription(\`Você trabalhou como **\${job.name}** e ganhou:\\n\\n**Moedas:** \${earned.toLocaleString()} 🪙\\n**XP:** \${xpGained} ⭐\\n\\n**Novo saldo:** \${userData.coins.toLocaleString()} 🪙\`)
                .setColor('#0099FF')
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
        }
    }
};`;
  }

  private getModerationSystemCode(): string {
    return `const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mod')
        .setDescription('Sistema avançado de moderação')
        .addSubcommand(subcommand =>
            subcommand
                .setName('ban')
                .setDescription('Banir usuário')
                .addUserOption(option =>
                    option.setName('usuario')
                        .setDescription('Usuário para banir')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('motivo')
                        .setDescription('Motivo do banimento')
                        .setRequired(false))
                .addBooleanOption(option =>
                    option.setName('deletar_mensagens')
                        .setDescription('Deletar mensagens dos últimos 7 dias')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('unban')
                .setDescription('Desbanir usuário')
                .addStringOption(option =>
                    option.setName('userid')
                        .setDescription('ID do usuário para desbanir')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('timeout')
                .setDescription('Aplicar timeout')
                .addUserOption(option =>
                    option.setName('usuario')
                        .setDescription('Usuário para timeout')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('duracao')
                        .setDescription('Duração em minutos')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('motivo')
                        .setDescription('Motivo do timeout')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('warn')
                .setDescription('Advertir usuário')
                .addUserOption(option =>
                    option.setName('usuario')
                        .setDescription('Usuário para advertir')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('motivo')
                        .setDescription('Motivo da advertência')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('clear')
                .setDescription('Limpar mensagens')
                .addIntegerOption(option =>
                    option.setName('quantidade')
                        .setDescription('Quantidade de mensagens (1-100)')
                        .setRequired(true)
                        .setMinValue(1)
                        .setMaxValue(100))),
    
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        
        // Verificar permissões gerais
        if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return await interaction.reply({
                content: '❌ Você não tem permissão para usar comandos de moderação!',
                ephemeral: true
            });
        }
        
        if (subcommand === 'ban') {
            if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
                return await interaction.reply({
                    content: '❌ Você não tem permissão para banir membros!',
                    ephemeral: true
                });
            }
            
            const target = interaction.options.getMember('usuario');
            const motivo = interaction.options.getString('motivo') || 'Não especificado';
            const deletarMensagens = interaction.options.getBoolean('deletar_mensagens') || false;
            
            if (!target.bannable) {
                return await interaction.reply({
                    content: '❌ Não posso banir este usuário! Verifique as permissões.',
                    ephemeral: true
                });
            }
            
            if (target.roles.highest.position >= interaction.member.roles.highest.position) {
                return await interaction.reply({
                    content: '❌ Você não pode banir alguém com cargo igual ou superior ao seu!',
                    ephemeral: true
                });
            }
            
            try {
                // Tentar enviar DM para o usuário
                try {
                    const dmEmbed = new EmbedBuilder()
                        .setTitle('🔨 Você foi banido!')
                        .setDescription(\`**Servidor:** \${interaction.guild.name}\\n**Motivo:** \${motivo}\\n**Moderador:** \${interaction.user.tag}\`)
                        .setColor('#FF0000')
                        .setTimestamp();
                    
                    await target.send({ embeds: [dmEmbed] });
                } catch (error) {
                    console.log('Não foi possível enviar DM para o usuário banido');
                }
                
                await target.ban({
                    reason: \`\${motivo} | Moderador: \${interaction.user.tag}\`,
                    deleteMessageDays: deletarMensagens ? 7 : 0
                });
                
                const embed = new EmbedBuilder()
                    .setTitle('🔨 Usuário Banido')
                    .setDescription(\`**Usuário:** \${target.user.tag} (\${target.id})\\n**Motivo:** \${motivo}\\n**Moderador:** \${interaction.user.tag}\\n**Mensagens deletadas:** \${deletarMensagens ? 'Sim (7 dias)' : 'Não'}\`)
                    .setColor('#FF0000')
                    .setThumbnail(target.user.displayAvatarURL())
                    .setTimestamp();
                
                await interaction.reply({ embeds: [embed] });
                
            } catch (error) {
                await interaction.reply({
                    content: '❌ Erro ao banir usuário: ' + error.message,
                    ephemeral: true
                });
            }
            
        } else if (subcommand === 'timeout') {
            const target = interaction.options.getMember('usuario');
            const duracao = interaction.options.getInteger('duracao');
            const motivo = interaction.options.getString('motivo') || 'Não especificado';
            
            if (duracao > 40320) { // 28 dias em minutos
                return await interaction.reply({
                    content: '❌ A duração máxima do timeout é 28 dias (40320 minutos)!',
                    ephemeral: true
                });
            }
            
            try {
                await target.timeout(duracao * 60 * 1000, \`\${motivo} | Moderador: \${interaction.user.tag}\`);
                
                const embed = new EmbedBuilder()
                    .setTitle('⏰ Timeout Aplicado')
                    .setDescription(\`**Usuário:** \${target.user.tag}\\n**Duração:** \${duracao} minutos\\n**Motivo:** \${motivo}\\n**Moderador:** \${interaction.user.tag}\`)
                    .setColor('#FFA500')
                    .setTimestamp();
                
                await interaction.reply({ embeds: [embed] });
                
            } catch (error) {
                await interaction.reply({
                    content: '❌ Erro ao aplicar timeout: ' + error.message,
                    ephemeral: true
                });
            }
            
        } else if (subcommand === 'clear') {
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
                return await interaction.reply({
                    content: '❌ Você não tem permissão para gerenciar mensagens!',
                    ephemeral: true
                });
            }
            
            const quantidade = interaction.options.getInteger('quantidade');
            
            try {
                const messages = await interaction.channel.bulkDelete(quantidade, true);
                
                const embed = new EmbedBuilder()
                    .setTitle('🧹 Mensagens Limpas')
                    .setDescription(\`**Quantidade deletada:** \${messages.size} mensagens\\n**Moderador:** \${interaction.user.tag}\`)
                    .setColor('#00FF00')
                    .setTimestamp();
                
                const reply = await interaction.reply({ embeds: [embed] });
                
                // Deletar a mensagem de confirmação após 5 segundos
                setTimeout(() => {
                    reply.delete().catch(() => {});
                }, 5000);
                
            } catch (error) {
                await interaction.reply({
                    content: '❌ Erro ao limpar mensagens: ' + error.message,
                    ephemeral: true
                });
            }
        }
    }
};`;
  }

  private getMusicSystemCode(): string {
    return `const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// Simulação de sistema de música (para uso real, instale discord-player ou similar)
const musicQueue = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('music')
        .setDescription('Sistema completo de música')
        .addSubcommand(subcommand =>
            subcommand
                .setName('play')
                .setDescription('Tocar música')
                .addStringOption(option =>
                    option.setName('musica')
                        .setDescription('Nome ou URL da música')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('queue')
                .setDescription('Ver fila de reprodução'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('skip')
                .setDescription('Pular música atual'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('stop')
                .setDescription('Parar reprodução e limpar fila'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('volume')
                .setDescription('Ajustar volume')
                .addIntegerOption(option =>
                    option.setName('nivel')
                        .setDescription('Nível do volume (0-100)')
                        .setRequired(true)
                        .setMinValue(0)
                        .setMaxValue(100)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('shuffle')
                .setDescription('Embaralhar fila'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('nowplaying')
                .setDescription('Ver música atual')),
    
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        
        // Verificar se o usuário está em um canal de voz
        if (!interaction.member.voice.channel) {
            return await interaction.reply({
                content: '❌ Você precisa estar em um canal de voz para usar comandos de música!',
                ephemeral: true
            });
        }
        
        const queue = musicQueue.get(interaction.guild.id) || {
            songs: [],
            volume: 50,
            playing: false,
            currentSong: null
        };
        
        if (subcommand === 'play') {
            const musica = interaction.options.getString('musica');
            
            // Simular adição de música à fila
            const songData = {
                title: musica.includes('http') ? 'Música do YouTube' : musica,
                url: musica.includes('http') ? musica : \`https://youtube.com/search?q=\${encodeURIComponent(musica)}\`,
                duration: '3:45',
                requestedBy: interaction.user,
                thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
            };
            
            queue.songs.push(songData);
            
            if (!queue.playing) {
                queue.currentSong = songData;
                queue.playing = true;
            }
            
            musicQueue.set(interaction.guild.id, queue);
            
            const embed = new EmbedBuilder()
                .setTitle(queue.songs.length === 1 ? '🎵 Tocando Agora' : '📝 Adicionado à Fila')
                .setDescription(\`**[\${songData.title}](\${songData.url})**\\n\\n**Duração:** \${songData.duration}\\n**Solicitado por:** \${songData.requestedBy}\\n**Posição na fila:** \${queue.songs.length}\`)
                .setColor('#0099FF')
                .setThumbnail(songData.thumbnail)
                .setTimestamp();
            
            const buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('music_pause')
                        .setLabel('⏸️ Pausar')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('music_skip')
                        .setLabel('⏭️ Pular')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('music_stop')
                        .setLabel('⏹️ Parar')
                        .setStyle(ButtonStyle.Danger)
                );
            
            await interaction.reply({ embeds: [embed], components: [buttons] });
            
        } else if (subcommand === 'queue') {
            if (queue.songs.length === 0) {
                return await interaction.reply({
                    content: '📭 A fila está vazia! Use \`/music play\` para adicionar músicas.',
                    ephemeral: true
                });
            }
            
            const queueList = queue.songs
                .slice(0, 10)
                .map((song, index) => \`\${index + 1}. **[\${song.title}](\${song.url})** - \${song.duration} | \${song.requestedBy}\`)
                .join('\\n');
            
            const embed = new EmbedBuilder()
                .setTitle(\`🎵 Fila de Reprodução (\${queue.songs.length} músicas)\`)
                .setDescription(queueList)
                .setColor('#0099FF')
                .setFooter({ text: queue.songs.length > 10 ? \`E mais \${queue.songs.length - 10} músicas...\` : '' })
                .setTimestamp();
            
            if (queue.currentSong) {
                embed.addFields({
                    name: '🎶 Tocando Agora',
                    value: \`**[\${queue.currentSong.title}](\${queue.currentSong.url})**\`,
                    inline: false
                });
            }
            
            await interaction.reply({ embeds: [embed] });
            
        } else if (subcommand === 'skip') {
            if (!queue.playing || queue.songs.length === 0) {
                return await interaction.reply({
                    content: '❌ Não há música tocando para pular!',
                    ephemeral: true
                });
            }
            
            const skippedSong = queue.currentSong;
            queue.songs.shift(); // Remove a música atual
            
            if (queue.songs.length > 0) {
                queue.currentSong = queue.songs[0];
            } else {
                queue.currentSong = null;
                queue.playing = false;
            }
            
            musicQueue.set(interaction.guild.id, queue);
            
            const embed = new EmbedBuilder()
                .setTitle('⏭️ Música Pulada')
                .setDescription(\`**Música pulada:** \${skippedSong.title}\\n\${queue.currentSong ? \`**Próxima música:** \${queue.currentSong.title}\` : '**Fila vazia!**'}\`)
                .setColor('#FFA500')
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
            
        } else if (subcommand === 'volume') {
            const nivel = interaction.options.getInteger('nivel');
            queue.volume = nivel;
            musicQueue.set(interaction.guild.id, queue);
            
            const volumeEmoji = nivel === 0 ? '🔇' : nivel < 30 ? '🔈' : nivel < 70 ? '🔉' : '🔊';
            
            const embed = new EmbedBuilder()
                .setTitle(\`\${volumeEmoji} Volume Ajustado\`)
                .setDescription(\`Volume definido para **\${nivel}%**\`)
                .setColor('#0099FF')
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
        }
    }
};

// Event handlers para botões (adicione em arquivo de eventos)
/*
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    
    if (interaction.customId.startsWith('music_')) {
        const action = interaction.customId.split('_')[1];
        const queue = musicQueue.get(interaction.guild.id);
        
        if (!queue || !queue.playing) {
            return await interaction.reply({
                content: '❌ Não há música tocando!',
                ephemeral: true
            });
        }
        
        if (action === 'pause') {
            // Implementar pausa
            const embed = new EmbedBuilder()
                .setTitle('⏸️ Música Pausada')
                .setDescription(\`**\${queue.currentSong.title}** foi pausada.\`)
                .setColor('#FFA500');
            
            await interaction.reply({ embeds: [embed] });
            
        } else if (action === 'skip') {
            // Usar a lógica do comando skip
            // ... (mesmo código do subcommand skip)
            
        } else if (action === 'stop') {
            queue.songs = [];
            queue.playing = false;
            queue.currentSong = null;
            musicQueue.set(interaction.guild.id, queue);
            
            const embed = new EmbedBuilder()
                .setTitle('⏹️ Reprodução Parada')
                .setDescription('A reprodução foi interrompida e a fila foi limpa.')
                .setColor('#FF0000');
            
            await interaction.reply({ embeds: [embed] });
        }
    }
});
*/`;
  }

  private getUtilitySystemCode(): string {
    return `const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('util')
        .setDescription('Comandos utilitários diversos')
        .addSubcommand(subcommand =>
            subcommand
                .setName('userinfo')
                .setDescription('Informações do usuário')
                .addUserOption(option =>
                    option.setName('usuario')
                        .setDescription('Usuário para ver informações')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('serverinfo')
                .setDescription('Informações do servidor'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('ping')
                .setDescription('Verificar latência do bot'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('poll')
                .setDescription('Criar enquete')
                .addStringOption(option =>
                    option.setName('pergunta')
                        .setDescription('Pergunta da enquete')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('opcoes')
                        .setDescription('Opções separadas por vírgula (máx 5)')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remind')
                .setDescription('Criar lembrete')
                .addStringOption(option =>
                    option.setName('tempo')
                        .setDescription('Tempo (ex: 10m, 1h, 1d)')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('mensagem')
                        .setDescription('Mensagem do lembrete')
                        .setRequired(true))),
    
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        
        if (subcommand === 'userinfo') {
            const target = interaction.options.getUser('usuario') || interaction.user;
            const member = interaction.guild.members.cache.get(target.id);
            
            const roles = member.roles.cache
                .filter(role => role.id !== interaction.guild.id)
                .sort((a, b) => b.position - a.position)
                .map(role => role.toString())
                .slice(0, 10);
            
            const embed = new EmbedBuilder()
                .setTitle(\`👤 Informações de \${target.displayName}\`)
                .setThumbnail(target.displayAvatarURL({ dynamic: true, size: 256 }))
                .addFields(
                    { name: '🏷️ Tag', value: target.tag, inline: true },
                    { name: '🆔 ID', value: target.id, inline: true },
                    { name: '🤖 Bot', value: target.bot ? 'Sim' : 'Não', inline: true },
                    { name: '📅 Conta criada', value: \`<t:\${Math.floor(target.createdTimestamp / 1000)}:F>\`, inline: false },
                    { name: '📥 Entrou no servidor', value: member ? \`<t:\${Math.floor(member.joinedTimestamp / 1000)}:F>\` : 'N/A', inline: false },
                    { name: \`🎭 Cargos (\${member.roles.cache.size - 1})\`, value: roles.length > 0 ? roles.join(', ') : 'Nenhum cargo', inline: false }
                )
                .setColor(member.displayHexColor || '#0099FF')
                .setTimestamp();
            
            if (member.premiumSince) {
                embed.addFields({ name: '💎 Boost desde', value: \`<t:\${Math.floor(member.premiumSinceTimestamp / 1000)}:F>\`, inline: true });
            }
            
            await interaction.reply({ embeds: [embed] });
            
        } else if (subcommand === 'serverinfo') {
            const guild = interaction.guild;
            const owner = await guild.fetchOwner();
            
            const embed = new EmbedBuilder()
                .setTitle(\`🏰 Informações do \${guild.name}\`)
                .setThumbnail(guild.iconURL({ dynamic: true, size: 256 }))
                .addFields(
                    { name: '👑 Dono', value: owner.user.tag, inline: true },
                    { name: '🆔 ID', value: guild.id, inline: true },
                    { name: '📅 Criado em', value: \`<t:\${Math.floor(guild.createdTimestamp / 1000)}:F>\`, inline: false },
                    { name: '👥 Membros', value: guild.memberCount.toString(), inline: true },
                    { name: '💬 Canais', value: guild.channels.cache.size.toString(), inline: true },
                    { name: '🎭 Cargos', value: guild.roles.cache.size.toString(), inline: true },
                    { name: '😊 Emojis', value: guild.emojis.cache.size.toString(), inline: true },
                    { name: '🔒 Nível de verificação', value: guild.verificationLevel.toString(), inline: true },
                    { name: '💎 Boosts', value: guild.premiumSubscriptionCount.toString(), inline: true }
                )
                .setColor('#0099FF')
                .setTimestamp();
            
            if (guild.banner) {
                embed.setImage(guild.bannerURL({ dynamic: true, size: 1024 }));
            }
            
            await interaction.reply({ embeds: [embed] });
            
        } else if (subcommand === 'ping') {
            const start = Date.now();
            
            const embed = new EmbedBuilder()
                .setTitle('🏓 Pong!')
                .setDescription('Calculando latência...')
                .setColor('#FFA500');
            
            const message = await interaction.reply({ embeds: [embed], fetchReply: true });
            
            const end = Date.now();
            const apiLatency = end - start;
            const wsLatency = interaction.client.ws.ping;
            
            const updatedEmbed = new EmbedBuilder()
                .setTitle('🏓 Pong!')
                .addFields(
                    { name: '📡 Latência da API', value: \`\${apiLatency}ms\`, inline: true },
                    { name: '🌐 Latência WebSocket', value: \`\${wsLatency}ms\`, inline: true },
                    { name: '📊 Status', value: apiLatency < 100 ? '🟢 Excelente' : apiLatency < 200 ? '🟡 Boa' : '🔴 Ruim', inline: true }
                )
                .setColor(apiLatency < 100 ? '#00FF00' : apiLatency < 200 ? '#FFA500' : '#FF0000')
                .setTimestamp();
            
            await interaction.editReply({ embeds: [updatedEmbed] });
            
        } else if (subcommand === 'poll') {
            const pergunta = interaction.options.getString('pergunta');
            const opcoes = interaction.options.getString('opcoes').split(',').map(o => o.trim()).slice(0, 5);
            
            if (opcoes.length < 2) {
                return await interaction.reply({
                    content: '❌ Você precisa fornecer pelo menos 2 opções!',
                    ephemeral: true
                });
            }
            
            const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
            const opcoesList = opcoes.map((opcao, index) => \`\${emojis[index]} \${opcao}\`).join('\\n');
            
            const embed = new EmbedBuilder()
                .setTitle('📊 Enquete')
                .setDescription(\`**\${pergunta}**\\n\\n\${opcoesList}\`)
                .setColor('#0099FF')
                .setFooter({ text: \`Criado por \${interaction.user.tag}\` })
                .setTimestamp();
            
            const message = await interaction.reply({ embeds: [embed], fetchReply: true });
            
            // Adicionar reações
            for (let i = 0; i < opcoes.length; i++) {
                await message.react(emojis[i]);
            }
            
        } else if (subcommand === 'remind') {
            const tempo = interaction.options.getString('tempo');
            const mensagem = interaction.options.getString('mensagem');
            
            // Converter tempo para milissegundos
            const timeRegex = /^(\\d+)([smhd])$/;
            const match = tempo.match(timeRegex);
            
            if (!match) {
                return await interaction.reply({
                    content: '❌ Formato de tempo inválido! Use: s (segundos), m (minutos), h (horas), d (dias)\\nExemplo: 10m, 1h, 1d',
                    ephemeral: true
                });
            }
            
            const amount = parseInt(match[1]);
            const unit = match[2];
            
            const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
            const delay = amount * multipliers[unit];
            
            if (delay > 86400000 * 7) { // Máximo 7 dias
                return await interaction.reply({
                    content: '❌ O tempo máximo para lembretes é 7 dias!',
                    ephemeral: true
                });
            }
            
            const embed = new EmbedBuilder()
                .setTitle('⏰ Lembrete Criado')
                .setDescription(\`Eu vou te lembrar em **\${tempo}** sobre:\\n\\n"\${mensagem}"\`)
                .setColor('#00FF00')
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
            
            // Configurar o lembrete
            setTimeout(async () => {
                const reminderEmbed = new EmbedBuilder()
                    .setTitle('⏰ Lembrete!')
                    .setDescription(\`\${interaction.user}, você pediu para eu te lembrar sobre:\\n\\n"\${mensagem}"\`)
                    .setColor('#FFD700')
                    .setTimestamp();
                
                try {
                    await interaction.followUp({ embeds: [reminderEmbed] });
                } catch (error) {
                    console.log('Não foi possível enviar o lembrete');
                }
            }, delay);
        }
    }
};`;
  }
}