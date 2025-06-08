import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Lock, Database, UserCheck } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Política de Privacidade</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Sua privacidade é nossa prioridade. Saiba como coletamos e protegemos seus dados.
            </p>
          </div>

          <div className="grid gap-6">
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="mr-2 h-5 w-5" />
                  Dados Coletados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Dados de Autenticação</h3>
                  <p className="text-muted-foreground">
                    Coletamos informações básicas do seu perfil Discord/GitHub: nome de usuário, 
                    avatar, ID único e endereço de email para autenticação e personalização.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Dados de Uso</h3>
                  <p className="text-muted-foreground">
                    Registramos logs de atividade, comandos criados, bots configurados e 
                    estatísticas de uso para melhorar nossos serviços.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="mr-2 h-5 w-5" />
                  Como Usamos Seus Dados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <UserCheck className="h-4 w-4 mt-1 text-discord-green" />
                    <span>Autenticação e gerenciamento de conta</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <UserCheck className="h-4 w-4 mt-1 text-discord-green" />
                    <span>Personalização da experiência do usuário</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <UserCheck className="h-4 w-4 mt-1 text-discord-green" />
                    <span>Geração e armazenamento de configurações de bots</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <UserCheck className="h-4 w-4 mt-1 text-discord-green" />
                    <span>Análise de uso para melhorias do serviço</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <UserCheck className="h-4 w-4 mt-1 text-discord-green" />
                    <span>Comunicação sobre atualizações e novidades</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="mr-2 h-5 w-5" />
                  Segurança e Proteção
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Criptografia</h3>
                  <p className="text-muted-foreground">
                    Todos os dados são transmitidos usando HTTPS e armazenados com criptografia AES-256.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Tokens de Bot</h3>
                  <p className="text-muted-foreground">
                    Tokens do Discord nunca são armazenados permanentemente. Usamos apenas para 
                    análise temporária e são descartados imediatamente após o processamento.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Acesso Limitado</h3>
                  <p className="text-muted-foreground">
                    Apenas membros autorizados da equipe têm acesso aos dados, sempre com logs de auditoria.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Seus Direitos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Acesso e Portabilidade</h3>
                  <p className="text-muted-foreground">
                    Você pode solicitar uma cópia de todos os seus dados a qualquer momento.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Correção</h3>
                  <p className="text-muted-foreground">
                    Pode corrigir informações incorretas em sua conta através das configurações.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Exclusão</h3>
                  <p className="text-muted-foreground">
                    Pode solicitar a exclusão completa de sua conta e todos os dados associados.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle>Contato</CardTitle>
                <CardDescription>
                  Para questões sobre privacidade ou exercer seus direitos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Email:</strong> privacy@botcraft.com</p>
                  <p><strong>Discord:</strong> BotCraft#1234</p>
                  <p><strong>Resposta:</strong> Até 48 horas</p>
                </div>
              </CardContent>
            </Card>

            <div className="text-center text-muted-foreground text-sm">
              <p>Última atualização: {new Date().toLocaleDateString()}</p>
              <p>Esta política pode ser atualizada periodicamente. Notificaremos sobre mudanças significativas.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;