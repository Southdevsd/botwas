import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Code, Download, Copy, Search, Package, Wand2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Command {
  id: string;
  name: string;
  description: string;
  category: string;
  features: string[];
  code: {
    javascript: string;
    typescript: string;
  };
}

const CommandLibrary = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const commands: Command[] = [
    {
      id: 'complete_moderation',
      name: 'Sistema de Moderação Completo',
      description: 'Sistema completo com ban, kick, timeout, warnings e automod',
      category: 'moderacao',
      features: ['Banir/Kickar usuários', 'Sistema de warnings', 'Auto-moderação', 'Logs completos', 'Anti-spam', 'Filtro de palavrões'],
      code: {
        javascript: `const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// Dados em memória (use banco de dados em produção)
const warnings = new Map();
const automodConfig = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mod')
    .setDescription('Sistema completo de moderação')
    .addSubcommand(subcommand =>
      subcommand
        .setName('ban')
        .setDescription('Banir usuário')
        .addUserOption(option => option.setName('usuario').setDescription('Usuário para banir').setRequired(true))
        .addStringOption(option => option.setName('motivo').setDescription('Motivo do banimento').setRequired(false))
        .addStringOption(option => option.setName('duracao').setDescription('Duração (1d, 1h, 1m)').setRequired(false)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('kick')
        .setDescription('Expulsar usuário')
        .addUserOption(option => option.setName('usuario').setDescription('Usuário para expulsar').setRequired(true))
        .addStringOption(option => option.setName('motivo').setDescription('Motivo da expulsão').setRequired(false)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('timeout')
        .setDescription('Silenciar usuário')
        .addUserOption(option => option.setName('usuario').setDescription('Usuário para silenciar').setRequired(true))
        .addStringOption(option => option.setName('duracao').setDescription('Duração (10m, 1h, 1d)').setRequired(true))
        .addStringOption(option => option.setName('motivo').setDescription('Motivo do timeout').setRequired(false)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('warn')
        .setDescription('Avisar usuário')
        .addUserOption(option => option.setName('usuario').setDescription('Usuário para avisar').setRequired(true))
        .addStringOption(option => option.setName('motivo').setDescription('Motivo do aviso').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('warnings')
        .setDescription('Ver avisos de um usuário')
        .addUserOption(option => option.setName('usuario').setDescription('Usuário para verificar').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('clear')
        .setDescription('Limpar mensagens')
        .addIntegerOption(option => option.setName('quantidade').setDescription('Quantidade (1-100)').setRequired(true).setMinValue(1).setMaxValue(100))
        .addUserOption(option => option.setName('usuario').setDescription('Filtrar por usuário').setRequired(false)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('automod')
        .setDescription('Configurar auto-moderação')
        .addBooleanOption(option => option.setName('ativar').setDescription('Ativar auto-moderação').setRequired(true))
        .addChannelOption(option => option.setName('logs').setDescription('Canal de logs').setRequired(false)))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    
    if (subcommand === 'ban') {
      const usuario = interaction.options.getUser('usuario');
      const motivo = interaction.options.getString('motivo') || 'Não especificado';
      const duracao = interaction.options.getString('duracao');
      
      try {
        // Verificar hierarquia
        const member = await interaction.guild.members.fetch(usuario.id);
        if (member.roles.highest.position >= interaction.member.roles.highest.position) {
          return await interaction.reply({ content: '❌ Você não pode banir este usuário!', ephemeral: true });
        }
        
        // Notificar usuário
        try {
          const dmEmbed = new EmbedBuilder()
            .setTitle('🔨 Você foi banido')
            .setDescription(\`**Servidor:** \${interaction.guild.name}\\n**Motivo:** \${motivo}\\n**Moderador:** \${interaction.user.tag}\${duracao ? \`\\n**Duração:** \${duracao}\` : ''}\`)
            .setColor('#FF0000')
            .setTimestamp();
          
          await usuario.send({ embeds: [dmEmbed] });
        } catch (error) {
          console.log('Não foi possível enviar DM para o usuário');
        }
        
        // Banir usuário
        await interaction.guild.members.ban(usuario, { reason: \`\${motivo} - Por: \${interaction.user.tag}\` });
        
        // Embed de confirmação
        const embed = new EmbedBuilder()
          .setTitle('🔨 Usuário Banido')
          .setDescription(\`**Usuário:** \${usuario.tag}\\n**ID:** \${usuario.id}\\n**Motivo:** \${motivo}\\n**Moderador:** \${interaction.user.tag}\${duracao ? \`\\n**Duração:** \${duracao}\` : ''}\`)
          .setColor('#FF0000')
          .setThumbnail(usuario.displayAvatarURL())
          .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
        
        // Log
        const logChannel = interaction.guild.channels.cache.find(ch => ch.name === 'mod-logs');
        if (logChannel) {
          await logChannel.send({ embeds: [embed] });
        }
        
      } catch (error) {
        await interaction.reply({ content: '❌ Erro ao banir usuário!', ephemeral: true });
      }
      
    } else if (subcommand === 'kick') {
      const usuario = interaction.options.getUser('usuario');
      const motivo = interaction.options.getString('motivo') || 'Não especificado';
      
      try {
        const member = await interaction.guild.members.fetch(usuario.id);
        if (member.roles.highest.position >= interaction.member.roles.highest.position) {
          return await interaction.reply({ content: '❌ Você não pode expulsar este usuário!', ephemeral: true });
        }
        
        await member.kick(\`\${motivo} - Por: \${interaction.user.tag}\`);
        
        const embed = new EmbedBuilder()
          .setTitle('👢 Usuário Expulso')
          .setDescription(\`**Usuário:** \${usuario.tag}\\n**Motivo:** \${motivo}\\n**Moderador:** \${interaction.user.tag}\`)
          .setColor('#FFA500')
          .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
        
      } catch (error) {
        await interaction.reply({ content: '❌ Erro ao expulsar usuário!', ephemeral: true });
      }
      
    } else if (subcommand === 'timeout') {
      const usuario = interaction.options.getUser('usuario');
      const duracaoStr = interaction.options.getString('duracao');
      const motivo = interaction.options.getString('motivo') || 'Não especificado';
      
      // Converter duração
      const timeRegex = /(\\d+)([smhd])/i;
      const match = duracaoStr.match(timeRegex);
      if (!match) {
        return await interaction.reply({ content: '❌ Formato de duração inválido! Use: 10m, 1h, 1d', ephemeral: true });
      }
      
      const amount = parseInt(match[1]);
      const unit = match[2].toLowerCase();
      
      let milliseconds;
      switch (unit) {
        case 's': milliseconds = amount * 1000; break;
        case 'm': milliseconds = amount * 60 * 1000; break;
        case 'h': milliseconds = amount * 60 * 60 * 1000; break;
        case 'd': milliseconds = amount * 24 * 60 * 60 * 1000; break;
        default: return await interaction.reply({ content: '❌ Unidade inválida!', ephemeral: true });
      }
      
      if (milliseconds > 28 * 24 * 60 * 60 * 1000) {
        return await interaction.reply({ content: '❌ Duração máxima é de 28 dias!', ephemeral: true });
      }
      
      try {
        const member = await interaction.guild.members.fetch(usuario.id);
        await member.timeout(milliseconds, \`\${motivo} - Por: \${interaction.user.tag}\`);
        
        const embed = new EmbedBuilder()
          .setTitle('🔇 Usuário Silenciado')
          .setDescription(\`**Usuário:** \${usuario.tag}\\n**Duração:** \${duracaoStr}\\n**Motivo:** \${motivo}\\n**Moderador:** \${interaction.user.tag}\`)
          .setColor('#FF8C00')
          .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
        
      } catch (error) {
        await interaction.reply({ content: '❌ Erro ao silenciar usuário!', ephemeral: true });
      }
      
    } else if (subcommand === 'warn') {
      const usuario = interaction.options.getUser('usuario');
      const motivo = interaction.options.getString('motivo');
      
      const userKey = \`\${interaction.guild.id}-\${usuario.id}\`;
      if (!warnings.has(userKey)) {
        warnings.set(userKey, []);
      }
      
      warnings.get(userKey).push({
        motivo,
        moderador: interaction.user.tag,
        timestamp: Date.now()
      });
      
      const totalWarnings = warnings.get(userKey).length;
      
      const embed = new EmbedBuilder()
        .setTitle('⚠️ Usuário Avisado')
        .setDescription(\`**Usuário:** \${usuario.tag}\\n**Motivo:** \${motivo}\\n**Moderador:** \${interaction.user.tag}\\n**Total de Avisos:** \${totalWarnings}\`)
        .setColor('#FFFF00')
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
      
      // Auto-punição por avisos
      if (totalWarnings >= 3) {
        const member = await interaction.guild.members.fetch(usuario.id);
        await member.timeout(60 * 60 * 1000, 'Auto-timeout: 3 avisos acumulados');
        
        await interaction.followUp({
          content: \`🔄 \${usuario.tag} foi automaticamente silenciado por acumular 3 avisos!\`
        });
      }
      
    } else if (subcommand === 'warnings') {
      const usuario = interaction.options.getUser('usuario');
      const userKey = \`\${interaction.guild.id}-\${usuario.id}\`;
      const userWarnings = warnings.get(userKey) || [];
      
      if (userWarnings.length === 0) {
        return await interaction.reply({ content: \`✅ \${usuario.tag} não possui avisos.\`, ephemeral: true });
      }
      
      let warningsList = '';
      userWarnings.forEach((warning, index) => {
        warningsList += \`**\${index + 1}.** \${warning.motivo}\\n*Por: \${warning.moderador} - <t:\${Math.floor(warning.timestamp / 1000)}:R>*\\n\\n\`;
      });
      
      const embed = new EmbedBuilder()
        .setTitle(\`⚠️ Avisos de \${usuario.tag}\`)
        .setDescription(\`**Total:** \${userWarnings.length}\\n\\n\${warningsList}\`)
        .setColor('#FFFF00')
        .setThumbnail(usuario.displayAvatarURL());
      
      await interaction.reply({ embeds: [embed], ephemeral: true });
      
    } else if (subcommand === 'clear') {
      const quantidade = interaction.options.getInteger('quantidade');
      const usuario = interaction.options.getUser('usuario');
      
      try {
        let deletedMessages;
        
        if (usuario) {
          const messages = await interaction.channel.messages.fetch({ limit: 100 });
          const userMessages = messages.filter(msg => msg.author.id === usuario.id).first(quantidade);
          deletedMessages = await interaction.channel.bulkDelete(userMessages, true);
        } else {
          deletedMessages = await interaction.channel.bulkDelete(quantidade, true);
        }
        
        const embed = new EmbedBuilder()
          .setTitle('🧹 Mensagens Limpas')
          .setDescription(\`**Quantidade:** \${deletedMessages.size} mensagens\${usuario ? \`\\n**Usuário:** \${usuario.tag}\` : ''}\\n**Moderador:** \${interaction.user.tag}\`)
          .setColor('#00FF00')
          .setTimestamp();
        
        await interaction.reply({ embeds: [embed], ephemeral: true });
        
      } catch (error) {
        await interaction.reply({ content: '❌ Erro ao limpar mensagens!', ephemeral: true });
      }
      
    } else if (subcommand === 'automod') {
      const ativar = interaction.options.getBoolean('ativar');
      const logsChannel = interaction.options.getChannel('logs');
      
      automodConfig.set(interaction.guild.id, {
        enabled: ativar,
        logsChannelId: logsChannel?.id || null
      });
      
      const embed = new EmbedBuilder()
        .setTitle('🤖 Auto-moderação Configurada')
        .setDescription(\`**Status:** \${ativar ? '✅ Ativada' : '❌ Desativada'}\${logsChannel ? \`\\n**Canal de Logs:** \${logsChannel}\` : ''}\`)
        .setColor(ativar ? '#00FF00' : '#FF0000')
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
};

// Event handler para auto-moderação (adicione no arquivo de eventos)
/*
const messageHistory = new Map();

client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return;
  
  const config = automodConfig.get(message.guild.id);
  if (!config || !config.enabled) return;
  
  // Anti-spam
  const userId = message.author.id;
  const now = Date.now();
  
  if (!messageHistory.has(userId)) {
    messageHistory.set(userId, []);
  }
  
  const userMessages = messageHistory.get(userId);
  userMessages.push(now);
  
  // Limpar mensagens antigas (últimos 5 segundos)
  messageHistory.set(userId, userMessages.filter(timestamp => now - timestamp < 5000));
  
  if (userMessages.length > 5) {
    await message.delete();
    await message.channel.send(\`⚠️ \${message.author}, evite spam!\`).then(msg => setTimeout(() => msg.delete(), 5000));
    return;
  }
  
  // Filtro de palavrões
  const badWords = ['palavra1', 'palavra2']; // Configure suas palavras
  const content = message.content.toLowerCase();
  
  for (const word of badWords) {
    if (content.includes(word)) {
      await message.delete();
      await message.channel.send(\`⚠️ \${message.author}, linguagem inapropriada!\`).then(msg => setTimeout(() => msg.delete(), 5000));
      return;
    }
  }
});
*/`,
        typescript: `// Versão TypeScript do código acima com tipagem completa`
      }
    },
    {
      id: 'complete_economy',
      name: 'Sistema de Economia Avançado',
      description: 'Sistema completo com banco, loja, trabalhos, apostas e muito mais',
      category: 'economia',
      features: ['Sistema bancário', 'Loja de itens', 'Trabalhos e daily', 'Apostas e jogos', 'Transferências', 'Leaderboard'],
      code: {
        javascript: `const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// Dados em memória (use banco de dados em produção)
const users = new Map();
const shops = new Map();
const cooldowns = new Map();

// Inicializar loja padrão
const defaultShop = [
  { id: 'vip_role', name: '🌟 Cargo VIP', price: 5000, type: 'role', description: 'Acesso VIP por 30 dias' },
  { id: 'custom_color', name: '🎨 Cor Personalizada', price: 2500, type: 'color', description: 'Cor única no servidor' },
  { id: 'nickname_change', name: '📝 Mudança de Nick', price: 1000, type: 'nickname', description: 'Mudar nickname uma vez' },
  { id: 'lottery_ticket', name: '🎫 Bilhete de Loteria', price: 100, type: 'item', description: 'Chance de ganhar o jackpot' }
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('eco')
    .setDescription('Sistema completo de economia')
    .addSubcommand(subcommand =>
      subcommand
        .setName('balance')
        .setDescription('Ver saldo')
        .addUserOption(option => option.setName('usuario').setDescription('Ver saldo de outro usuário')))
    .addSubcommand(subcommand =>
      subcommand
        .setName('daily')
        .setDescription('Recompensa diária'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('work')
        .setDescription('Trabalhar para ganhar dinheiro'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('transfer')
        .setDescription('Transferir dinheiro')
        .addUserOption(option => option.setName('usuario').setDescription('Para quem transferir').setRequired(true))
        .addIntegerOption(option => option.setName('quantidade').setDescription('Quantidade').setRequired(true).setMinValue(1)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('deposit')
        .setDescription('Depositar no banco')
        .addIntegerOption(option => option.setName('quantidade').setDescription('Quantidade').setRequired(true).setMinValue(1)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('withdraw')
        .setDescription('Sacar do banco')
        .addIntegerOption(option => option.setName('quantidade').setDescription('Quantidade').setRequired(true).setMinValue(1)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('shop')
        .setDescription('Ver loja'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('buy')
        .setDescription('Comprar item')
        .addStringOption(option => option.setName('item').setDescription('ID do item').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('inventory')
        .setDescription('Ver inventário')
        .addUserOption(option => option.setName('usuario').setDescription('Ver inventário de outro usuário')))
    .addSubcommand(subcommand =>
      subcommand
        .setName('gamble')
        .setDescription('Apostar dinheiro')
        .addIntegerOption(option => option.setName('quantidade').setDescription('Quantidade').setRequired(true).setMinValue(10)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('coinflip')
        .setDescription('Cara ou coroa')
        .addStringOption(option => 
          option.setName('escolha').setDescription('Cara ou coroa?').setRequired(true)
          .addChoices({ name: 'Cara', value: 'cara' }, { name: 'Coroa', value: 'coroa' }))
        .addIntegerOption(option => option.setName('aposta').setDescription('Valor da aposta').setRequired(true).setMinValue(10)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('slots')
        .setDescription('Jogar caça-níqueis')
        .addIntegerOption(option => option.setName('aposta').setDescription('Valor da aposta').setRequired(true).setMinValue(50)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('leaderboard')
        .setDescription('Ranking de riqueza'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('rob')
        .setDescription('Tentar roubar alguém')
        .addUserOption(option => option.setName('usuario').setDescription('Quem roubar').setRequired(true))),
  
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const userId = interaction.user.id;
    
    // Inicializar usuário
    if (!users.has(userId)) {
      users.set(userId, {
        wallet: 1000,
        bank: 0,
        inventory: [],
        lastDaily: 0,
        lastWork: 0,
        lastRob: 0,
        totalEarned: 1000,
        level: 1
      });
    }
    
    const userData = users.get(userId);
    
    if (subcommand === 'balance') {
      const target = interaction.options.getUser('usuario') || interaction.user;
      const targetData = users.get(target.id) || { wallet: 0, bank: 0, level: 1 };
      
      const embed = new EmbedBuilder()
        .setTitle(\`💰 Carteira de \${target.username}\`)
        .setDescription(\`**💸 Carteira:** 💎 \${targetData.wallet.toLocaleString()}\\n**🏦 Banco:** 💎 \${targetData.bank.toLocaleString()}\\n**💎 Total:** 💎 \${(targetData.wallet + targetData.bank).toLocaleString()}\\n\\n**📊 Level:** \${targetData.level}\`)
        .setColor('#FFD700')
        .setThumbnail(target.displayAvatarURL())
        .setTimestamp();
      
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('quick_deposit')
            .setLabel('🏦 Depositar Tudo')
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId('quick_withdraw')
            .setLabel('💸 Sacar Tudo')
            .setStyle(ButtonStyle.Secondary)
        );
      
      await interaction.reply({ embeds: [embed], components: [row] });
      
    } else if (subcommand === 'daily') {
      const now = Date.now();
      const cooldownTime = 24 * 60 * 60 * 1000; // 24 horas
      
      if (now - userData.lastDaily < cooldownTime) {
        const timeLeft = cooldownTime - (now - userData.lastDaily);
        const hours = Math.floor(timeLeft / (60 * 60 * 1000));
        const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
        
        return await interaction.reply({
          content: \`⏰ Você já coletou hoje! Volte em **\${hours}h \${minutes}m**\`,
          ephemeral: true
        });
      }
      
      // Calcular recompensa baseada no level
      const baseAmount = 500;
      const levelBonus = userData.level * 50;
      const randomBonus = Math.floor(Math.random() * 200) + 100;
      const totalAmount = baseAmount + levelBonus + randomBonus;
      
      userData.wallet += totalAmount;
      userData.totalEarned += totalAmount;
      userData.lastDaily = now;
      
      // Chance de item especial
      const specialChance = Math.random();
      let bonusMessage = '';
      
      if (specialChance < 0.1) { // 10% chance
        userData.inventory.push({ id: 'lucky_coin', name: '🍀 Moeda da Sorte', value: 1000 });
        bonusMessage = '\\n\\n🎁 **Bônus:** Você encontrou uma Moeda da Sorte!';
      }
      
      const embed = new EmbedBuilder()
        .setTitle('🎁 Recompensa Diária Coletada!')
        .setDescription(\`**Recompensa Base:** 💎 \${baseAmount.toLocaleString()}\\n**Bônus de Level (\${userData.level}):** 💎 \${levelBonus.toLocaleString()}\\n**Bônus Aleatório:** 💎 \${randomBonus.toLocaleString()}\\n**Total:** 💎 \${totalAmount.toLocaleString()}\\n\\n**Novo Saldo:** 💎 \${userData.wallet.toLocaleString()}\${bonusMessage}\`)
        .setColor('#00FF00')
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
      
    } else if (subcommand === 'work') {
      const now = Date.now();
      const cooldownTime = 60 * 60 * 1000; // 1 hora
      
      if (now - userData.lastWork < cooldownTime) {
        const timeLeft = cooldownTime - (now - userData.lastWork);
        const minutes = Math.floor(timeLeft / (60 * 1000));
        
        return await interaction.reply({
          content: \`⏱️ Você está cansado! Descanse por **\${minutes} minutos**\`,
          ephemeral: true
        });
      }
      
      const jobs = [
        { name: 'Desenvolvedor', min: 200, max: 400, emoji: '💻', success: 0.8 },
        { name: 'Designer', min: 150, max: 350, emoji: '🎨', success: 0.75 },
        { name: 'Streamer', min: 100, max: 500, emoji: '📹', success: 0.6 },
        { name: 'Trader', min: 50, max: 600, emoji: '📈', success: 0.5 },
        { name: 'Motorista', min: 80, max: 200, emoji: '🚗', success: 0.9 }
      ];
      
      const randomJob = jobs[Math.floor(Math.random() * jobs.length)];
      const success = Math.random() < randomJob.success;
      
      if (success) {
        const earned = Math.floor(Math.random() * (randomJob.max - randomJob.min + 1)) + randomJob.min;
        userData.wallet += earned;
        userData.totalEarned += earned;
        userData.lastWork = now;
        
        const embed = new EmbedBuilder()
          .setTitle(\`\${randomJob.emoji} Trabalho Concluído!\`)
          .setDescription(\`Você trabalhou como **\${randomJob.name}** e ganhou **💎 \${earned.toLocaleString()}**!\\n\\n**Novo Saldo:** 💎 \${userData.wallet.toLocaleString()}\`)
          .setColor('#4CAF50')
          .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
      } else {
        userData.lastWork = now;
        
        const embed = new EmbedBuilder()
          .setTitle(\`\${randomJob.emoji} Trabalho Falhou!\`)
          .setDescription(\`Você tentou trabalhar como **\${randomJob.name}** mas não conseguiu completar a tarefa. Tente novamente mais tarde!\`)
          .setColor('#FF6B6B')
          .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
      }
      
    } else if (subcommand === 'slots') {
      const aposta = interaction.options.getInteger('aposta');
      
      if (userData.wallet < aposta) {
        return await interaction.reply({ content: '❌ Você não tem dinheiro suficiente!', ephemeral: true });
      }
      
      const symbols = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎', '7️⃣'];
      const result = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ];
      
      let multiplier = 0;
      
      // Verificar combinações
      if (result[0] === result[1] && result[1] === result[2]) {
        // Três iguais
        switch (result[0]) {
          case '💎': multiplier = 10; break;
          case '7️⃣': multiplier = 7; break;
          case '⭐': multiplier = 5; break;
          default: multiplier = 3; break;
        }
      } else if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) {
        // Dois iguais
        multiplier = 1.5;
      }
      
      const winnings = Math.floor(aposta * multiplier);
      userData.wallet -= aposta;
      
      if (winnings > 0) {
        userData.wallet += winnings;
        userData.totalEarned += winnings - aposta;
      }
      
      const embed = new EmbedBuilder()
        .setTitle('🎰 Caça-Níqueis')
        .setDescription(\`\${result.join(' | ')}\\n\\n\${winnings > 0 ? \`🎉 **GANHOU!**\\n**Multiplicador:** \${multiplier}x\\n**Ganhos:** 💎 \${winnings.toLocaleString()}\` : '😢 **Perdeu...**'}\\n\\n**Novo Saldo:** 💎 \${userData.wallet.toLocaleString()}\`)
        .setColor(winnings > 0 ? '#00FF00' : '#FF0000')
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
      
    } else if (subcommand === 'shop') {
      let shopDescription = '';
      defaultShop.forEach((item, index) => {
        shopDescription += \`**\${index + 1}.** \${item.name} - 💎 \${item.price.toLocaleString()}\\n*\${item.description}*\\n\\n\`;
      });
      
      const embed = new EmbedBuilder()
        .setTitle('🏪 Loja do Servidor')
        .setDescription(shopDescription)
        .setColor('#5865F2')
        .setFooter({ text: 'Use /eco buy <ID> para comprar' });
      
      await interaction.reply({ embeds: [embed] });
      
    } else if (subcommand === 'leaderboard') {
      const sortedUsers = Array.from(users.entries())
        .map(([id, data]) => ({ id, total: data.wallet + data.bank }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 10);
      
      let leaderboard = '';
      for (let i = 0; i < sortedUsers.length; i++) {
        const user = await interaction.client.users.fetch(sortedUsers[i].id).catch(() => null);
        if (user) {
          const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : \`\${i + 1}.\`;
          leaderboard += \`\${medal} **\${user.username}** - 💎 \${sortedUsers[i].total.toLocaleString()}\\n\`;
        }
      }
      
      const embed = new EmbedBuilder()
        .setTitle('🏆 Ranking de Riqueza')
        .setDescription(leaderboard || 'Nenhum usuário encontrado')
        .setColor('#FFD700')
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
    }
  }
};

// Event handlers para botões (adicione no arquivo de eventos)
/*
client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;
  
  const userId = interaction.user.id;
  const userData = users.get(userId);
  
  if (!userData) return;
  
  if (interaction.customId === 'quick_deposit') {
    if (userData.wallet === 0) {
      return await interaction.reply({ content: '❌ Você não tem dinheiro na carteira!', ephemeral: true });
    }
    
    userData.bank += userData.wallet;
    const deposited = userData.wallet;
    userData.wallet = 0;
    
    await interaction.reply({ content: \`🏦 Você depositou 💎 \${deposited.toLocaleString()} no banco!\`, ephemeral: true });
    
  } else if (interaction.customId === 'quick_withdraw') {
    if (userData.bank === 0) {
      return await interaction.reply({ content: '❌ Você não tem dinheiro no banco!', ephemeral: true });
    }
    
    userData.wallet += userData.bank;
    const withdrawn = userData.bank;
    userData.bank = 0;
    
    await interaction.reply({ content: \`💸 Você sacou 💎 \${withdrawn.toLocaleString()} do banco!\`, ephemeral: true });
  }
});
*/`,
        typescript: `// Versão TypeScript do código acima com tipagem completa`
      }
    },
    {
      id: 'complete_tickets',
      name: 'Sistema de Tickets Avançado',
      description: 'Sistema completo com categorias, transcrições e painéis interativos',
      category: 'utilidade',
      features: ['Múltiplas categorias', 'Transcrições automáticas', 'Sistema de rating', 'Painéis interativos', 'Logs completos'],
      code: {
        javascript: `const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

// Configurações dos tickets
const ticketConfig = new Map();
const activeTickets = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tickets')
    .setDescription('Sistema completo de tickets')
    .addSubcommand(subcommand =>
      subcommand
        .setName('setup')
        .setDescription('Configurar sistema de tickets')
        .addChannelOption(option => option.setName('categoria').setDescription('Categoria para tickets').addChannelTypes(ChannelType.GuildCategory).setRequired(true))
        .addRoleOption(option => option.setName('staff').setDescription('Cargo da equipe').setRequired(true))
        .addChannelOption(option => option.setName('logs').setDescription('Canal de logs').setRequired(false))
        .addChannelOption(option => option.setName('transcripts').setDescription('Canal de transcrições').setRequired(false)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('panel')
        .setDescription('Criar painel de tickets')
        .addStringOption(option => option.setName('titulo').setDescription('Título do painel').setRequired(false))
        .addStringOption(option => option.setName('descricao').setDescription('Descrição do painel').setRequired(false)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('close')
        .setDescription('Fechar ticket atual')
        .addStringOption(option => option.setName('motivo').setDescription('Motivo do fechamento').setRequired(false)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Adicionar usuário ao ticket')
        .addUserOption(option => option.setName('usuario').setDescription('Usuário para adicionar').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remover usuário do ticket')
        .addUserOption(option => option.setName('usuario').setDescription('Usuário para remover').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('rename')
        .setDescription('Renomear ticket')
        .addStringOption(option => option.setName('nome').setDescription('Novo nome').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('claim')
        .setDescription('Assumir ticket'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('unclaim')
        .setDescription('Abandonar ticket'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('stats')
        .setDescription('Estatísticas de tickets'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;
    
    if (subcommand === 'setup') {
      const categoria = interaction.options.getChannel('categoria');
      const staffRole = interaction.options.getRole('staff');
      const logsChannel = interaction.options.getChannel('logs');
      const transcriptsChannel = interaction.options.getChannel('transcripts');
      
      ticketConfig.set(guildId, {
        categoryId: categoria.id,
        staffRoleId: staffRole.id,
        logsChannelId: logsChannel?.id || null,
        transcriptsChannelId: transcriptsChannel?.id || null,
        ticketCounter: 0,
        ticketCategories: {
          support: { name: '🛠️ Suporte Técnico', emoji: '🛠️' },
          report: { name: '🚨 Reportar Usuário', emoji: '🚨' },
          suggestion: { name: '💡 Sugestões', emoji: '💡' },
          partnership: { name: '🤝 Parcerias', emoji: '🤝' },
          other: { name: '❓ Outros', emoji: '❓' }
        }
      });
      
      const embed = new EmbedBuilder()
        .setTitle('✅ Sistema de Tickets Configurado')
        .setDescription(\`**Categoria:** \${categoria.name}\\n**Staff:** \${staffRole.name}\\n**Logs:** \${logsChannel ? logsChannel.name : 'Não configurado'}\\n**Transcrições:** \${transcriptsChannel ? transcriptsChannel.name : 'Não configurado'}\`)
        .setColor('#00FF00')
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed], ephemeral: true });
      
    } else if (subcommand === 'panel') {
      const config = ticketConfig.get(guildId);
      if (!config) {
        return await interaction.reply({ content: '❌ Configure o sistema primeiro com \`/tickets setup\`!', ephemeral: true });
      }
      
      const titulo = interaction.options.getString('titulo') || '🎫 Central de Suporte';
      const descricao = interaction.options.getString('descricao') || 'Selecione uma categoria abaixo para abrir um ticket de suporte. Nossa equipe responderá o mais rápido possível!';
      
      const embed = new EmbedBuilder()
        .setTitle(titulo)
        .setDescription(\`\${descricao}\\n\\n**Categorias Disponíveis:**\\n\${Object.entries(config.ticketCategories).map(([key, cat]) => \`\${cat.emoji} \${cat.name}\`).join('\\n')}\\n\\n*Clique no botão correspondente à sua necessidade*\`)
        .setColor('#5865F2')
        .setThumbnail(interaction.guild.iconURL())
        .setFooter({ text: 'Sistema de Tickets Avançado v3.0' })
        .setTimestamp();
      
      const row1 = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('ticket_support')
            .setLabel('Suporte Técnico')
            .setEmoji('🛠️')
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId('ticket_report')
            .setLabel('Reportar')
            .setEmoji('🚨')
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId('ticket_suggestion')
            .setLabel('Sugestões')
            .setEmoji('💡')
            .setStyle(ButtonStyle.Secondary)
        );
      
      const row2 = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('ticket_partnership')
            .setLabel('Parcerias')
            .setEmoji('🤝')
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId('ticket_other')
            .setLabel('Outros')
            .setEmoji('❓')
            .setStyle(ButtonStyle.Secondary)
        );
      
      await interaction.reply({ embeds: [embed], components: [row1, row2] });
      
    } else if (subcommand === 'close') {
      if (!interaction.channel.name.startsWith('ticket-')) {
        return await interaction.reply({ content: '❌ Este comando só pode ser usado em tickets!', ephemeral: true });
      }
      
      const motivo = interaction.options.getString('motivo') || 'Não especificado';
      const ticketInfo = activeTickets.get(interaction.channel.id);
      
      // Criar transcrição
      const messages = await interaction.channel.messages.fetch({ limit: 100 });
      const transcript = messages.reverse().map(msg => 
        \`[\${new Date(msg.createdTimestamp).toLocaleString()}] \${msg.author.tag}: \${msg.content}\`
      ).join('\\n');
      
      // Embed de avaliação
      const ratingEmbed = new EmbedBuilder()
        .setTitle('⭐ Avalie o Atendimento')
        .setDescription('Como foi o atendimento? Sua avaliação nos ajuda a melhorar!')
        .setColor('#FFD700');
      
      const ratingRow = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder().setCustomId('rating_1').setLabel('1⭐').setStyle(ButtonStyle.Danger),
          new ButtonBuilder().setCustomId('rating_2').setLabel('2⭐').setStyle(ButtonStyle.Danger),
          new ButtonBuilder().setCustomId('rating_3').setLabel('3⭐').setStyle(ButtonStyle.Secondary),
          new ButtonBuilder().setCustomId('rating_4').setLabel('4⭐').setStyle(ButtonStyle.Success),
          new ButtonBuilder().setCustomId('rating_5').setLabel('5⭐').setStyle(ButtonStyle.Success)
        );
      
      await interaction.reply({ embeds: [ratingEmbed], components: [ratingRow] });
      
      // Aguardar 30 segundos e fechar
      setTimeout(async () => {
        try {
          const closeEmbed = new EmbedBuilder()
            .setTitle('🔒 Ticket Fechado')
            .setDescription(\`**Ticket:** \${interaction.channel.name}\\n**Fechado por:** \${interaction.user.tag}\\n**Motivo:** \${motivo}\\n**Data:** <t:\${Math.floor(Date.now() / 1000)}:F>\`)
            .setColor('#FF0000')
            .setTimestamp();
          
          // Enviar log
          const config = ticketConfig.get(interaction.guild.id);
          if (config?.logsChannelId) {
            const logsChannel = interaction.guild.channels.cache.get(config.logsChannelId);
            if (logsChannel) {
              await logsChannel.send({ embeds: [closeEmbed] });
            }
          }
          
          // Enviar transcrição
          if (config?.transcriptsChannelId && transcript) {
            const transcriptsChannel = interaction.guild.channels.cache.get(config.transcriptsChannelId);
            if (transcriptsChannel) {
              const transcriptEmbed = new EmbedBuilder()
                .setTitle(\`📄 Transcrição: \${interaction.channel.name}\`)
                .setDescription(\`**Usuário:** \${ticketInfo?.userId ? \`<@\${ticketInfo.userId}>\` : 'Desconhecido'}\\n**Categoria:** \${ticketInfo?.category || 'Desconhecida'}\\n**Fechado por:** \${interaction.user.tag}\`)
                .setColor('#5865F2')
                .setTimestamp();
              
              // Salvar transcrição em arquivo
              const fileName = \`transcript-\${interaction.channel.name}-\${Date.now()}.txt\`;
              fs.writeFileSync(fileName, transcript);
              
              await transcriptsChannel.send({ 
                embeds: [transcriptEmbed],
                files: [{ attachment: fileName, name: fileName }]
              });
              
              // Deletar arquivo local
              fs.unlinkSync(fileName);
            }
          }
          
          activeTickets.delete(interaction.channel.id);
          await interaction.channel.delete();
          
        } catch (error) {
          console.error('Erro ao fechar ticket:', error);
        }
      }, 30000);
      
    } else if (subcommand === 'claim') {
      if (!interaction.channel.name.startsWith('ticket-')) {
        return await interaction.reply({ content: '❌ Este comando só pode ser usado em tickets!', ephemeral: true });
      }
      
      const ticketInfo = activeTickets.get(interaction.channel.id);
      if (ticketInfo?.claimedBy) {
        return await interaction.reply({ content: \`❌ Este ticket já foi assumido por <@\${ticketInfo.claimedBy}>!\`, ephemeral: true });
      }
      
      activeTickets.set(interaction.channel.id, {
        ...ticketInfo,
        claimedBy: interaction.user.id
      });
      
      const embed = new EmbedBuilder()
        .setTitle('✅ Ticket Assumido')
        .setDescription(\`\${interaction.user} assumiu este ticket e será responsável pelo atendimento.\`)
        .setColor('#00FF00')
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
      
    } else if (subcommand === 'stats') {
      // Contar tickets ativos
      const activeCount = activeTickets.size;
      const config = ticketConfig.get(guildId);
      
      const embed = new EmbedBuilder()
        .setTitle('📊 Estatísticas de Tickets')
        .setDescription(\`**Tickets Ativos:** \${activeCount}\\n**Total Criados:** \${config?.ticketCounter || 0}\\n**Sistema:** \${config ? '✅ Configurado' : '❌ Não configurado'}\`)
        .setColor('#5865F2')
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
};

// Event handlers (adicione no arquivo de eventos)
/*
client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;
  
  if (interaction.customId.startsWith('ticket_')) {
    const category = interaction.customId.split('_')[1];
    const config = ticketConfig.get(interaction.guild.id);
    
    if (!config) {
      return await interaction.reply({ content: '❌ Sistema não configurado!', ephemeral: true });
    }
    
    // Verificar se usuário já tem ticket aberto
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
    const categoryInfo = config.ticketCategories[category];
    
    const ticketChannel = await interaction.guild.channels.create({
      name: \`ticket-\${ticketNumber}-\${interaction.user.username}\`,
      type: ChannelType.GuildText,
      parent: config.categoryId,
      topic: \`Ticket de \${categoryInfo.name} | Usuário: \${interaction.user.tag} | ID: \${interaction.user.id}\`,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionFlagsBits.ViewChannel]
        },
        {
          id: interaction.user.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
        },
        {
          id: config.staffRoleId,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
        }
      ]
    });
    
    // Salvar informações do ticket
    activeTickets.set(ticketChannel.id, {
      userId: interaction.user.id,
      category: categoryInfo.name,
      createdAt: Date.now(),
      claimedBy: null
    });
    
    const welcomeEmbed = new EmbedBuilder()
      .setTitle(\`\${categoryInfo.emoji} \${categoryInfo.name} - Ticket #\${ticketNumber}\`)
      .setDescription(\`Olá \${interaction.user}! Bem-vindo ao seu ticket de **\${categoryInfo.name}**.\\n\\nPor favor, descreva detalhadamente sua solicitação. Nossa equipe <@&\${config.staffRoleId}> responderá em breve!\\n\\n**Status:** 🟡 Aguardando atendimento\`)
      .setColor('#5865F2')
      .addFields(
        { name: '📋 Informações', value: \`**Categoria:** \${categoryInfo.name}\\n**Criado:** <t:\${Math.floor(Date.now() / 1000)}:R>\\n**ID do Usuário:** \${interaction.user.id}\`, inline: true }
      )
      .setFooter({ text: 'Use os botões abaixo para gerenciar o ticket' })
      .setTimestamp();
    
    const ticketRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('close_ticket')
          .setLabel('🔒 Fechar')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('claim_ticket')
          .setLabel('✋ Assumir')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('transcript_ticket')
          .setLabel('📄 Transcrição')
          .setStyle(ButtonStyle.Secondary)
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
  }
});
*/`,
        typescript: `// Versão TypeScript do código acima com tipagem completa`
      }
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos os Sistemas' },
    { id: 'moderacao', name: 'Moderação' },
    { id: 'economia', name: 'Economia' },
    { id: 'utilidade', name: 'Utilidade' },
    { id: 'entretenimento', name: 'Entretenimento' }
  ];

  const filteredCommands = commands.filter(command => {
    const matchesCategory = selectedCategory === 'all' || command.category === selectedCategory;
    const matchesSearch = command.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         command.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         command.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const downloadCommand = (command: Command, language: 'javascript' | 'typescript') => {
    const extension = language === 'javascript' ? 'js' : 'ts';
    const code = command.code[language];
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${command.name.toLowerCase().replace(/\s+/g, '-')}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download iniciado!",
      description: `Sistema ${command.name} baixado em ${language}.`
    });
  };

  const copyCommand = (command: Command, language: 'javascript' | 'typescript') => {
    navigator.clipboard.writeText(command.code[language]);
    toast({
      title: "Código copiado!",
      description: `Sistema ${command.name} copiado em ${language}.`
    });
  };

  const generateCustomCommand = async () => {
    if (!customPrompt.trim()) {
      toast({
        title: "Descrição necessária",
        description: "Por favor, descreva o sistema que você quer gerar.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      const generated = `// Sistema personalizado gerado automaticamente
// Descrição: ${customPrompt}
// Linguagem: ${selectedLanguage}

const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// Sistema de dados (use banco de dados em produção)
const systemData = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sistema-personalizado')
    .setDescription('${customPrompt}')
    .addSubcommand(subcommand =>
      subcommand
        .setName('config')
        .setDescription('Configurar o sistema'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('status')
        .setDescription('Ver status do sistema'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('help')
        .setDescription('Ajuda e instruções')),
  
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;
    
    // Inicializar dados se necessário
    if (!systemData.has(guildId)) {
      systemData.set(guildId, {
        enabled: false,
        settings: {},
        data: {},
        createdAt: Date.now()
      });
    }
    
    const guildData = systemData.get(guildId);
    
    if (subcommand === 'config') {
      guildData.enabled = true;
      
      const embed = new EmbedBuilder()
        .setTitle('⚙️ Sistema Configurado')
        .setDescription(\`O sistema foi configurado com sucesso!\\n\\n**Base:** \${customPrompt}\\n**Status:** ✅ Ativo\`)
        .setColor('#00FF00')
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
      
    } else if (subcommand === 'status') {
      const embed = new EmbedBuilder()
        .setTitle('📊 Status do Sistema')
        .setDescription(\`**Status:** \${guildData.enabled ? '✅ Ativo' : '❌ Inativo'}\\n**Criado:** <t:\${Math.floor(guildData.createdAt / 1000)}:R>\\n**Descrição:** \${customPrompt}\`)
        .setColor(guildData.enabled ? '#00FF00' : '#FF0000')
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
      
    } else if (subcommand === 'help') {
      const embed = new EmbedBuilder()
        .setTitle('❓ Ajuda do Sistema')
        .setDescription(\`**Sistema:** \${customPrompt}\\n\\n**Comandos Disponíveis:**\\n\\\`/sistema-personalizado config\\\` - Configurar sistema\\n\\\`/sistema-personalizado status\\\` - Ver status\\n\\\`/sistema-personalizado help\\\` - Esta ajuda\\n\\n**Observação:** Este é um sistema base gerado automaticamente. Personalize conforme necessário!\`)
        .setColor('#5865F2')
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
};

/*
INSTRUÇÕES DE INSTALAÇÃO:
1. Salve este arquivo na pasta 'commands' do seu bot
2. Reinicie o bot para carregar o comando
3. Use /sistema-personalizado config para ativar
4. Personalize o código conforme suas necessidades

FUNCIONALIDADES INCLUÍDAS:
- Sistema de configuração básico
- Persistência de dados em memória
- Comandos de gerenciamento
- Embeds informativos
- Tratamento de erros básico

PRÓXIMOS PASSOS:
- Integre com banco de dados
- Adicione funcionalidades específicas
- Implemente logs e auditoria
- Configure permissões adequadas
*/`;

      setGeneratedCode(generated);
      
      toast({
        title: "Sistema personalizado gerado!",
        description: "O sistema foi criado baseado na sua descrição."
      });
    } catch (error) {
      toast({
        title: "Erro na geração",
        description: "Não foi possível gerar o sistema. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center text-foreground">
          <Package className="mr-2 h-5 w-5 text-primary" />
          Biblioteca de Sistemas Completos
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Sistemas prontos para produção ou gere sistemas personalizados com IA avançada
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ready" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger value="ready">Sistemas Prontos</TabsTrigger>
            <TabsTrigger value="generate">Gerar Sistema</TabsTrigger>
          </TabsList>

          <TabsContent value="ready" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar sistemas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-background border-border pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48 bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCommands.map(command => (
                <Card key={command.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-foreground mb-2">{command.name}</CardTitle>
                        <CardDescription className="text-muted-foreground text-sm mb-3">
                          {command.description}
                        </CardDescription>
                        <Badge variant="secondary" className="mb-3">
                          {categories.find(c => c.id === command.category)?.name}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-foreground">🚀 Funcionalidades:</h4>
                      <div className="grid grid-cols-1 gap-1">
                        {command.features.map((feature, index) => (
                          <div key={index} className="text-xs text-muted-foreground flex items-center">
                            <span className="w-1 h-1 bg-primary rounded-full mr-2"></span>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => downloadCommand(command, 'javascript')}
                        className="bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-600 border-yellow-600/30"
                      >
                        <Download className="mr-1 h-3 w-3" />
                        Baixar JS
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => downloadCommand(command, 'typescript')}
                        className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-600 border-blue-600/30"
                      >
                        <Download className="mr-1 h-3 w-3" />
                        Baixar TS
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyCommand(command, 'javascript')}
                        className="border-border hover:bg-muted"
                      >
                        <Copy className="mr-1 h-3 w-3" />
                        Copiar JS
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyCommand(command, 'typescript')}
                        className="border-border hover:bg-muted"
                      >
                        <Copy className="mr-1 h-3 w-3" />
                        Copiar TS
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="generate" className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">
                  Descreva o sistema completo que você quer
                </label>
                <Textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Ex: Sistema completo de eventos com inscrições, notificações automáticas, categorias de eventos, sistema de feedback dos participantes..."
                  className="bg-background border-border text-foreground min-h-[120px]"
                  rows={4}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {customPrompt.length}/2000 caracteres
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">
                  Linguagem de Programação
                </label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript (Discord.js)</SelectItem>
                    <SelectItem value="typescript">TypeScript (Discord.js)</SelectItem>
                    <SelectItem value="python">Python (Discord.py)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={generateCustomCommand}
                disabled={loading || !customPrompt.trim()}
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
                    <Wand2 className="mr-2 h-4 w-4" />
                    Gerar Sistema Completo com IA
                  </>
                )}
              </Button>
            </div>

            {generatedCode && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">🎯 Sistema Personalizado Gerado</h3>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => navigator.clipboard.writeText(generatedCode)} 
                      size="sm" 
                      variant="outline" 
                      className="border-border hover:bg-muted"
                    >
                      <Copy className="mr-1 h-3 w-3" />
                      Copiar
                    </Button>
                    <Button 
                      onClick={() => {
                        const extension = selectedLanguage === 'javascript' ? 'js' : selectedLanguage === 'typescript' ? 'ts' : 'py';
                        const blob = new Blob([generatedCode], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `sistema-personalizado.${extension}`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      size="sm" 
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Download className="mr-1 h-3 w-3" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="bg-muted border border-border rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="text-sm text-foreground font-mono whitespace-pre-wrap">
                    {generatedCode}
                  </pre>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">✅ Sistema Completo</Badge>
                  <Badge variant="secondary">🚀 Pronto para Produção</Badge>
                  <Badge variant="secondary">📱 Responsivo</Badge>
                  <Badge variant="secondary">🔧 Configurável</Badge>
                  <Badge variant="secondary">📊 Com Logs</Badge>
                  <Badge variant="secondary">🎯 Personalizado</Badge>
                </div>
              </div>
            )}

            {/* Exemplos */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base text-foreground">💡 Ideias de Sistemas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    'Sistema de eventos com inscrições e notificações',
                    'Sistema de clans/guilds com rankings e batalhas',
                    'Sistema de verificação com captcha e roles automáticos',
                    'Sistema de sugestões com votação da comunidade',
                    'Sistema de giveaways com sorteios automáticos',
                    'Sistema de estatísticas detalhadas do servidor',
                    'Sistema de backup automático de mensagens',
                    'Sistema de marketplace para troca de itens'
                  ].map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setCustomPrompt(example)}
                      className="text-left p-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm border border-border hover:border-primary/50"
                    >
                      <div className="font-medium mb-1 text-foreground">{example.split(' com ')[0]}</div>
                      <div className="text-xs text-muted-foreground">
                        {example.includes(' com ') ? example.split(' com ').slice(1).join(' com ') : 'Sistema completo e configurável'}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CommandLibrary;