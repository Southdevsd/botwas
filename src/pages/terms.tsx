import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertTriangle, Users, Gavel } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Termos de Uso</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Condições para uso da plataforma BotCraft
            </p>
          </div>

          <div className="grid gap-6">
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Aceitação dos Termos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Ao usar o BotCraft, você concorda com estes termos de uso. Se não concordar 
                  com qualquer parte destes termos, não use nossos serviços.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Uso Aceitável
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 text-discord-green">Permitido:</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Criar bots para seus servidores Discord</li>
                    <li>• Usar comandos gerados para fins legítimos</li>
                    <li>• Compartilhar bots criados com outros usuários</li>
                    <li>• Modificar código gerado conforme necessário</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-discord-red">Proibido:</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Criar bots para spam, assédio ou conteúdo ilegal</li>
                    <li>• Violar os Termos de Serviço do Discord</li>
                    <li>• Fazer engenharia reversa da plataforma</li>
                    <li>• Revender ou redistribuir nossos serviços</li>
                    <li>• Usar para atividades maliciosas ou prejudiciais</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gavel className="mr-2 h-5 w-5" />
                  Responsabilidades
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Suas Responsabilidades:</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Manter suas credenciais de acesso seguras</li>
                    <li>• Usar bots criados de forma responsável</li>
                    <li>• Respeitar direitos de propriedade intelectual</li>
                    <li>• Reportar bugs ou problemas de segurança</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Nossas Responsabilidades:</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Manter a plataforma funcionando adequadamente</li>
                    <li>• Proteger seus dados conforme nossa Política de Privacidade</li>
                    <li>• Fornecer suporte técnico quando necessário</li>
                    <li>• Notificar sobre mudanças importantes nos serviços</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Limitações e Isenções
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Disponibilidade do Serviço</h3>
                  <p className="text-muted-foreground">
                    Nos esforçamos para manter 99% de uptime, mas não garantimos disponibilidade 
                    ininterrupta. Manutenções programadas serão comunicadas com antecedência.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Limitação de Responsabilidade</h3>
                  <p className="text-muted-foreground">
                    Não nos responsabilizamos por danos indiretos, perda de dados ou lucros 
                    cessantes relacionados ao uso de nossos serviços.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Conformidade com Discord</h3>
                  <p className="text-muted-foreground">
                    Você é responsável por garantir que seus bots estejam em conformidade 
                    com os Termos de Serviço e Diretrizes da Comunidade do Discord.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle>Planos e Pagamentos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Plano Gratuito</h3>
                  <p className="text-muted-foreground">
                    Limitado a 5 bots com funcionalidades básicas. Pode ser modificado a qualquer momento.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Plano Premium</h3>
                  <p className="text-muted-foreground">
                    Cobrança mensal recorrente. Pode ser cancelado a qualquer momento, 
                    mantendo acesso até o fim do período pago.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Reembolsos</h3>
                  <p className="text-muted-foreground">
                    Política de reembolso de 7 dias para novos usuários premium. 
                    Entre em contato via suporte para solicitar.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle>Modificações dos Termos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Podemos atualizar estes termos periodicamente. Mudanças significativas serão 
                  comunicadas por email ou através da plataforma com pelo menos 30 dias de antecedência.
                </p>
              </CardContent>
            </Card>

            <div className="text-center text-muted-foreground text-sm">
              <p>Última atualização: {new Date().toLocaleDateString()}</p>
              <p>Para dúvidas sobre estes termos, entre em contato: legal@botcraft.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;