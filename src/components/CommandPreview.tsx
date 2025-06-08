import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Play, Hash, User, Calendar, Shield } from 'lucide-react';

interface CommandPreviewProps {
  command: string;
  commandType: string;
}

const CommandPreview = ({ command, commandType }: CommandPreviewProps) => {
  const [testInput, setTestInput] = useState('');
  const [previewResult, setPreviewResult] = useState<any>(null);

  const previewCommand = () => {
    let result;
    
    switch (commandType) {
      case 'ban':
        result = {
          type: 'embed',
          title: '🔨 Usuário Banido',
          description: `**${testInput || '@usuario'}** foi banido do servidor`,
          color: 'red',
          fields: [
            { name: 'Moderador', value: '@DevUser#1234' },
            { name: 'Motivo', value: 'Comportamento inadequado' },
            { name: 'Data', value: new Date().toLocaleString() }
          ]
        };
        break;
        
      case 'userinfo':
        result = {
          type: 'embed',
          title: '👤 Informações do Usuário',
          color: 'blue',
          fields: [
            { name: 'Usuário', value: testInput || '@usuario#1234' },
            { name: 'ID', value: '123456789012345678' },
            { name: 'Conta criada', value: '15 de Janeiro de 2020' },
            { name: 'Entrou no servidor', value: '10 de Março de 2024' },
            { name: 'Cargos', value: '@Membro, @Verificado' }
          ]
        };
        break;
        
      case 'ticket':
        result = {
          type: 'message',
          content: '🎫 **Sistema de Tickets**',
          components: [
            {
              type: 'button',
              label: '📞 Suporte Geral',
              style: 'primary'
            },
            {
              type: 'button', 
              label: '💰 Vendas',
              style: 'success'
            },
            {
              type: 'button',
              label: '🐛 Bug Report',
              style: 'danger'
            }
          ]
        };
        break;
        
      default:
        result = {
          type: 'message',
          content: `Comando **/${command}** executado com sucesso!`
        };
    }
    
    setPreviewResult(result);
  };

  return (
    <div className="space-y-4">
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Play className="mr-2 h-5 w-5" />
            Preview do Comando
          </CardTitle>
          <CardDescription>
            Teste como o comando funcionará no Discord
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Digite um valor para testar (ex: @usuario, texto, etc)"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              className="bg-background border-border"
            />
            <Button onClick={previewCommand} className="bg-discord hover:bg-discord-dark text-white">
              <Play className="mr-2 h-4 w-4" />
              Testar
            </Button>
          </div>
        </CardContent>
      </Card>

      {previewResult && (
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle>Simulação Discord</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Simulação da interface do Discord */}
            <div className="bg-[#36393f] rounded-lg p-4 text-white font-['Whitney']">
              {/* Header do canal */}
              <div className="flex items-center mb-4 pb-2 border-b border-gray-600">
                <Hash className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-300">geral</span>
              </div>
              
              {/* Mensagem do usuário */}
              <div className="flex items-start space-x-3 mb-4">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-discord text-white text-xs">
                    DU
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-white">DevUser</span>
                    <span className="text-xs text-gray-400">hoje às {new Date().toLocaleTimeString()}</span>
                  </div>
                  <div className="text-gray-300">/{command} {testInput}</div>
                </div>
              </div>
              
              {/* Resposta do bot */}
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-discord text-white text-xs">
                    MB
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-semibold text-white">MeuBot</span>
                    <Badge className="bg-discord text-white text-xs">BOT</Badge>
                    <span className="text-xs text-gray-400">hoje às {new Date().toLocaleTimeString()}</span>
                  </div>
                  
                  {previewResult.type === 'embed' ? (
                    <div className="bg-[#2f3136] border-l-4 border-discord rounded p-4 max-w-md">
                      {previewResult.title && (
                        <div className="font-semibold text-white mb-2">{previewResult.title}</div>
                      )}
                      {previewResult.description && (
                        <div className="text-gray-300 mb-3">{previewResult.description}</div>
                      )}
                      {previewResult.fields && (
                        <div className="space-y-2">
                          {previewResult.fields.map((field: any, index: number) => (
                            <div key={index} className="grid grid-cols-2 gap-2">
                              <div className="font-semibold text-gray-300">{field.name}</div>
                              <div className="text-gray-400">{field.value}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="text-gray-300 mb-2">{previewResult.content}</div>
                      {previewResult.components && (
                        <div className="flex space-x-2">
                          {previewResult.components.map((component: any, index: number) => (
                            <button
                              key={index}
                              className={`px-4 py-2 rounded text-sm font-medium ${
                                component.style === 'primary' ? 'bg-discord text-white' :
                                component.style === 'success' ? 'bg-discord-green text-black' :
                                component.style === 'danger' ? 'bg-discord-red text-white' :
                                'bg-gray-600 text-white'
                              }`}
                            >
                              {component.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CommandPreview;