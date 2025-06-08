import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Eye, Code, Plus, Trash2, Image, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmbedField {
  name: string;
  value: string;
  inline: boolean;
}

interface EmbedData {
  title: string;
  description: string;
  color: string;
  thumbnail: string;
  image: string;
  footer: string;
  timestamp: boolean;
  fields: EmbedField[];
}

const EmbedVisualEditor = () => {
  const [embedData, setEmbedData] = useState<EmbedData>({
    title: 'Título do Embed',
    description: 'Descrição do embed aqui...',
    color: '#5865f2',
    thumbnail: '',
    image: '',
    footer: 'Footer do embed',
    timestamp: false,
    fields: []
  });
  const [webhookUrl, setWebhookUrl] = useState('');
  const [activeTab, setActiveTab] = useState('editor');
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const updateEmbedData = (field: keyof EmbedData, value: any) => {
    setEmbedData(prev => ({ ...prev, [field]: value }));
  };

  const addField = () => {
    const newField: EmbedField = {
      name: 'Nome do Campo',
      value: 'Valor do campo',
      inline: false
    };
    setEmbedData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const updateField = (index: number, field: keyof EmbedField, value: any) => {
    setEmbedData(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) => 
        i === index ? { ...f, [field]: value } : f
      )
    }));
  };

  const removeField = (index: number) => {
    setEmbedData(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }));
  };

  const generateCode = () => {
    const code = `const embed = new EmbedBuilder()
  .setTitle('${embedData.title}')
  .setDescription('${embedData.description}')
  .setColor('${embedData.color}')${embedData.thumbnail ? `
  .setThumbnail('${embedData.thumbnail}')` : ''}${embedData.image ? `
  .setImage('${embedData.image}')` : ''}
  .setFooter({ text: '${embedData.footer}' })${embedData.timestamp ? `
  .setTimestamp()` : ''}${embedData.fields.length > 0 ? `
  .addFields(${embedData.fields.map(field => `
    { name: '${field.name}', value: '${field.value}', inline: ${field.inline} }`).join(',')})` : ''};

await interaction.reply({ embeds: [embed] });`;
    
    navigator.clipboard.writeText(code);
    toast({
      title: "Código copiado! 📋",
      description: "O código do embed foi copiado para sua área de transferência."
    });
  };

  const sendToWebhook = async () => {
    if (!webhookUrl.trim()) {
      toast({
        title: "Webhook necessário",
        description: "Por favor, insira a URL do webhook do Discord.",
        variant: "destructive"
      });
      return;
    }

    if (!webhookUrl.includes('discord.com/api/webhooks/')) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL válida de webhook do Discord.",
        variant: "destructive"
      });
      return;
    }

    setSending(true);
    try {
      const embedPayload = {
        embeds: [{
          title: embedData.title,
          description: embedData.description,
          color: parseInt(embedData.color.replace('#', ''), 16),
          thumbnail: embedData.thumbnail ? { url: embedData.thumbnail } : undefined,
          image: embedData.image ? { url: embedData.image } : undefined,
          footer: { text: embedData.footer },
          timestamp: embedData.timestamp ? new Date().toISOString() : undefined,
          fields: embedData.fields.length > 0 ? embedData.fields : undefined
        }]
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(embedPayload),
      });

      if (response.ok) {
        toast({
          title: "✅ Embed enviado com sucesso!",
          description: "Seu embed foi enviado para o Discord via webhook."
        });
      } else {
        throw new Error(`Erro ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao enviar webhook:', error);
      toast({
        title: "Erro ao enviar embed",
        description: "Verifique a URL do webhook e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="cyber-card">
      <CardHeader>
        <CardTitle className="flex items-center gradient-text">
          <MessageSquare className="mr-2 h-5 w-5" />
          Editor Visual de Embeds
        </CardTitle>
        <CardDescription className="text-cyber-cyan">
          Crie embeds profissionais com preview em tempo real e envio direto para Discord
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/40">
            <TabsTrigger value="editor">
              <MessageSquare className="mr-1 h-3 w-3" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="mr-1 h-3 w-3" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="webhook">
              <Send className="mr-1 h-3 w-3" />
              Webhook
            </TabsTrigger>
            <TabsTrigger value="code">
              <Code className="mr-1 h-3 w-3" />
              Código
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-medium text-cyber-blue">Informações Básicas</h3>
                
                <div>
                  <label className="text-sm font-medium mb-2 block text-cyber-cyan">Título</label>
                  <Input 
                    value={embedData.title}
                    onChange={(e) => updateEmbedData('title', e.target.value)}
                    placeholder="Título do embed"
                    className="bg-black/40 border-cyber-cyan/30"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block text-cyber-cyan">Descrição</label>
                  <Textarea 
                    value={embedData.description}
                    onChange={(e) => updateEmbedData('description', e.target.value)}
                    placeholder="Descrição do embed..."
                    className="bg-black/40 border-cyber-cyan/30"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block text-cyber-cyan">Cor</label>
                  <div className="flex space-x-2">
                    <Input 
                      type="color"
                      value={embedData.color}
                      onChange={(e) => updateEmbedData('color', e.target.value)}
                      className="w-16 h-10 p-1 bg-black/40 border-cyber-cyan/30"
                    />
                    <Input 
                      value={embedData.color}
                      onChange={(e) => updateEmbedData('color', e.target.value)}
                      placeholder="#5865f2"
                      className="flex-1 bg-black/40 border-cyber-cyan/30"
                    />
                  </div>
                </div>
              </div>

              {/* Media & Footer */}
              <div className="space-y-4">
                <h3 className="font-medium text-cyber-blue">Mídia e Rodapé</h3>
                
                <div>
                  <label className="text-sm font-medium mb-2 block text-cyber-cyan">Thumbnail URL</label>
                  <Input 
                    value={embedData.thumbnail}
                    onChange={(e) => updateEmbedData('thumbnail', e.target.value)}
                    placeholder="https://exemplo.com/imagem.png"
                    className="bg-black/40 border-cyber-cyan/30"
                  />
                  {embedData.thumbnail && (
                    <div className="mt-2">
                      <img 
                        src={embedData.thumbnail} 
                        alt="Thumbnail preview" 
                        className="w-16 h-16 object-cover rounded border border-cyber-cyan/30"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block text-cyber-cyan">Imagem URL</label>
                  <Input 
                    value={embedData.image}
                    onChange={(e) => updateEmbedData('image', e.target.value)}
                    placeholder="https://exemplo.com/imagem-grande.png"
                    className="bg-black/40 border-cyber-cyan/30"
                  />
                  {embedData.image && (
                    <div className="mt-2">
                      <img 
                        src={embedData.image} 
                        alt="Image preview" 
                        className="w-32 h-20 object-cover rounded border border-cyber-cyan/30"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block text-cyber-cyan">Footer</label>
                  <Input 
                    value={embedData.footer}
                    onChange={(e) => updateEmbedData('footer', e.target.value)}
                    placeholder="Texto do footer"
                    className="bg-black/40 border-cyber-cyan/30"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox"
                    checked={embedData.timestamp}
                    onChange={(e) => updateEmbedData('timestamp', e.target.checked)}
                    className="rounded"
                  />
                  <label className="text-sm font-medium text-cyber-cyan">Incluir timestamp</label>
                </div>
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-cyber-blue">Campos</h3>
                <Button onClick={addField} size="sm" className="cyber-button">
                  <Plus className="mr-1 h-3 w-3" />
                  Adicionar Campo
                </Button>
              </div>

              {embedData.fields.map((field, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-black/40 rounded-lg border border-cyber-cyan/30">
                  <Input 
                    value={field.name}
                    onChange={(e) => updateField(index, 'name', e.target.value)}
                    placeholder="Nome do campo"
                    className="bg-black/60 border-cyber-cyan/30"
                  />
                  <Input 
                    value={field.value}
                    onChange={(e) => updateField(index, 'value', e.target.value)}
                    placeholder="Valor do campo"
                    className="bg-black/60 border-cyber-cyan/30"
                  />
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox"
                      checked={field.inline}
                      onChange={(e) => updateField(index, 'inline', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-cyber-cyan">Inline</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeField(index)}
                      className="ml-auto border-red-500/30 hover:bg-red-500/10 text-red-400"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <div className="max-w-md mx-auto">
              <div className="bg-[#36393f] rounded-lg p-4 shadow-lg">
                {/* Author */}
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-[#5865f2] rounded-full"></div>
                  <span className="text-sm font-medium text-white">Seu Bot</span>
                  <span className="text-xs text-gray-400">hoje às {new Date().toLocaleTimeString()}</span>
                </div>

                {/* Embed */}
<div 
  className="bg-[#2f3136] rounded border-l-4 p-3 text-white max-w-xl"
  style={{ borderLeftColor: embedData.color }}
>
  {/* Título, descrição e thumbnail lado a lado */}
 <div className="flex mb-2">
  <div className="flex-1">
    {embedData.title && (
      <h3 className="font-semibold text-lg mb-1">
        {embedData.title}
      </h3>
    )}

    {embedData.description && (
      <p className="text-sm text-gray-300">
        {embedData.description}
      </p>
    )}
  </div>

  {embedData.thumbnail && (
    <div className="ml-4 self-start mt-1">
      <img 
        src={embedData.thumbnail} 
        alt="Thumbnail" 
        className="w-16 h-16 object-cover rounded"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  )}
</div>

  {/* Campos adicionais (fields) */}
  {embedData.fields.length > 0 && (
    <div className="grid grid-cols-1 gap-2 mb-3 mt-2">
      {embedData.fields.map((field, index) => (
        <div key={index} className={field.inline ? 'inline-block w-1/2 pr-2' : 'block'}>
          <div className="font-medium text-sm text-white">{field.name}</div>
          <div className="text-xs text-gray-300">{field.value}</div>
        </div>
      ))}
    </div>
  )}

  {/* Imagem principal */}
  {embedData.image && (
    <div className="mb-3">
      <img 
        src={embedData.image} 
        alt="Embed image" 
        className="max-w-full h-auto rounded"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  )}

  {/* Rodapé e timestamp */}
  {(embedData.footer || embedData.timestamp) && (
    <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-600">
      <span>{embedData.footer}</span>
      {embedData.timestamp && (
        <span>{new Date().toLocaleString()}</span>
      )}
    </div>
  )}
</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="webhook" className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-cyber-cyan">
                  URL do Webhook do Discord
                </label>
                <Input 
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://discord.com/api/webhooks/..."
                  className="bg-black/40 border-cyber-cyan/30"
                />
                <p className="text-xs text-cyber-blue mt-1">
                  Cole aqui a URL do webhook criado no seu servidor Discord
                </p>
              </div>

              <div className="bg-cyber-blue/10 border border-cyber-blue/30 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-cyber-blue mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Como criar um webhook:</span>
                </div>
                <ol className="text-sm text-cyber-cyan space-y-1 list-decimal list-inside">
                  <li>Vá nas configurações do seu servidor Discord</li>
                  <li>Clique em "Integrações" → "Webhooks"</li>
                  <li>Clique em "Criar Webhook"</li>
                  <li>Escolha o canal e copie a URL</li>
                </ol>
              </div>

              <Button 
                onClick={sendToWebhook}
                disabled={sending || !webhookUrl.trim()}
                className="w-full cyber-button"
                size="lg"
              >
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyber-cyan mr-2"></div>
                    Enviando embed...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Embed para Discord
                  </>
                )}
              </Button>

              {webhookUrl && !webhookUrl.includes('discord.com/api/webhooks/') && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">URL inválida</span>
                  </div>
                  <p className="text-sm text-red-300 mt-1">
                    A URL deve começar com "https://discord.com/api/webhooks/"
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="code" className="space-y-4">
            <div className="bg-black/80 text-cyber-green p-4 rounded-lg font-mono text-sm border border-cyber-cyan/30">
              <pre className="whitespace-pre-wrap overflow-x-auto">
{`const embed = new EmbedBuilder()
  .setTitle('${embedData.title}')
  .setDescription('${embedData.description}')
  .setColor('${embedData.color}')${embedData.thumbnail ? `
  .setThumbnail('${embedData.thumbnail}')` : ''}${embedData.image ? `
  .setImage('${embedData.image}')` : ''}
  .setFooter({ text: '${embedData.footer}' })${embedData.timestamp ? `
  .setTimestamp()` : ''}${embedData.fields.length > 0 ? `
  .addFields(${embedData.fields.map(field => `
    { name: '${field.name}', value: '${field.value}', inline: ${field.inline} }`).join(',')})` : ''};

await interaction.reply({ embeds: [embed] });`}
              </pre>
            </div>
            
            <Button onClick={generateCode} className="w-full cyber-button">
              <Code className="mr-2 h-4 w-4" />
              Copiar Código
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmbedVisualEditor;