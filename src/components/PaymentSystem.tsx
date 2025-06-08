import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, CreditCard, QrCode, Smartphone, Crown, Zap, Loader2, Check, Mail } from 'lucide-react';
import { mercadoPagoService } from '@/services/mercadoPago';
import { emailService } from '@/services/emailService';
import { useAuth } from './AuthProvider';
import { useToast } from '@/hooks/use-toast';

const PaymentSystem = () => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium' | 'enterprise'>('premium');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [showQRCode, setShowQRCode] = useState(false);
  const [pixData, setPixData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [paymentApproved, setPaymentApproved] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const generatePixPayment = async () => {
    if (selectedPlan === 'free') return;
    
    setLoading(true);
    try {
      const pixPayment = await mercadoPagoService.createPixPayment(selectedPlan);
      setPixData(pixPayment);
      setShowQRCode(true);
      
      toast({
        title: "PIX Gerado com Sucesso! 🎉",
        description: "Escaneie o QR Code ou copie o código PIX para pagar",
      });

      // Verificar status do pagamento a cada 3 segundos
      const checkPayment = setInterval(async () => {
        try {
          const status = await mercadoPagoService.getPaymentStatus(pixPayment.id);
          console.log('Status do pagamento:', status);
          
          if (status.status === 'approved') {
            clearInterval(checkPayment);
            setPaymentApproved(true);
            setShowQRCode(false);
            
            // Enviar email de confirmação
            if (user?.email) {
              try {
                const emailResult = await emailService.sendPaymentConfirmation(
                  user.email, 
                  selectedPlan, 
                  user.username
                );
                
                if (emailResult.success) {
                  setEmailSent(true);
                  toast({
                    title: "📧 Email Enviado!",
                    description: "Confirmação enviada para seu email.",
                  });
                }
              } catch (error) {
                console.error('Erro ao enviar email:', error);
              }
            }
            
            toast({
              title: "🎉 Pagamento Aprovado!",
              description: `Seu plano ${selectedPlan} foi ativado com sucesso!`,
            });
            
            // Recarregar a página após 3 segundos para atualizar o header
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          }
        } catch (error) {
          console.error('Erro ao verificar pagamento:', error);
        }
      }, 3000);

      // Para o check após 15 minutos (PIX expira)
      setTimeout(() => {
        clearInterval(checkPayment);
        if (!paymentApproved) {
          setShowQRCode(false);
          toast({
            title: "PIX Expirado ⏰",
            description: "O PIX expirou. Gere um novo para continuar.",
            variant: "destructive"
          });
        }
      }, 900000); // 15 minutos

    } catch (error) {
      console.error('Erro ao gerar PIX:', error);
      toast({
        title: "Erro ao Gerar PIX",
        description: "Tente novamente ou use o pagamento por cartão.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateCardPayment = async () => {
    if (selectedPlan === 'free') return;
    
    setLoading(true);
    try {
      const preference = await mercadoPagoService.createPreference(selectedPlan);
      
      toast({
        title: "Redirecionando para Pagamento... 🔒",
        description: "Você será redirecionado para o checkout seguro do Mercado Pago",
      });

      // Redirecionar para o checkout
      window.open(preference.init_point, '_blank');
      
    } catch (error) {
      console.error('Erro ao gerar checkout:', error);
      toast({
        title: "Erro no Checkout",
        description: "Não foi possível processar o pagamento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyPixCode = () => {
    if (pixData?.point_of_interaction?.transaction_data?.qr_code) {
      navigator.clipboard.writeText(pixData.point_of_interaction.transaction_data.qr_code);
      toast({
        title: "Código PIX Copiado! 📋",
        description: "Cole no seu aplicativo bancário para pagar",
      });
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Gratuito',
      price: 'R$ 0',
      period: '/mês',
      features: [
        'Até 5 bots',
        'Comandos básicos',
        'Suporte por email',
        'Templates gratuitos'
      ],
      buttonText: 'Plano Atual',
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 'R$ 19,90',
      period: '/mês',
      features: [
        'Bots ilimitados',
        'Todos os comandos',
        'IA para comandos personalizados',
        'Suporte prioritário',
        'Templates premium',
        'Sistema de tickets avançado',
        'Deploy automático',
        'Estatísticas detalhadas'
      ],
      buttonText: 'Escolher Premium',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'R$ 49,90',
      period: '/mês',
      features: [
        'Tudo do Premium',
        'White Label',
        'API dedicada',
        'Suporte 24/7',
        'Servidores dedicados',
        'SLA 99.9%',
        'Gerente de conta',
        'Relatórios customizados'
      ],
      buttonText: 'Escolher Enterprise',
      popular: false
    }
  ];

  if (paymentApproved) {
    return (
      <Card className="cyber-card text-center">
        <CardContent className="pt-6">
          <div className="w-20 h-20 bg-gradient-to-r from-cyber-green to-cyber-cyan rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Check className="h-10 w-10 text-black" />
          </div>
          <h2 className="text-2xl font-bold gradient-text mb-2">🎉 Pagamento Aprovado!</h2>
          <p className="text-cyber-cyan mb-4">
            Seu plano {selectedPlan === 'premium' ? 'Premium' : 'Enterprise'} foi ativado com sucesso!
          </p>
          
          {emailSent && user?.email && (
            <div className="bg-cyber-blue/10 border border-cyber-blue/30 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-center space-x-2 text-cyber-blue">
                <Mail className="h-4 w-4" />
                <span className="font-medium">Email de confirmação enviado!</span>
              </div>
              <p className="text-sm text-cyber-cyan mt-1">
                Verifique sua caixa de entrada: {user.email}
              </p>
            </div>
          )}
          
          <p className="text-sm text-cyber-blue">
            A página será recarregada automaticamente em alguns segundos...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Planos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative cyber-card cursor-pointer transition-all hover:scale-105 ${
              plan.popular ? 'border-cyber-cyan ring-2 ring-cyber-cyan/20' : ''
            } ${selectedPlan === plan.id ? 'ring-2 ring-cyber-cyan' : ''}`}
            onClick={() => setSelectedPlan(plan.id as 'free' | 'premium' | 'enterprise')}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-cyber-cyan to-cyber-blue text-black">
                  <Crown className="mr-1 h-3 w-3" />
                  Mais Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="text-2xl gradient-text">{plan.name}</CardTitle>
              <div className="text-4xl font-bold text-cyber-blue">
                {plan.price}
                <span className="text-lg text-cyber-cyan">{plan.period}</span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-cyber-cyan" />
                    <span className="text-sm text-cyber-blue">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full ${
                  plan.id === 'free' 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'cyber-button hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]'
                }`}
                disabled={plan.id === 'free'}
              >
                {plan.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sistema de Pagamento */}
      {(selectedPlan === 'premium' || selectedPlan === 'enterprise') && (
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="flex items-center gradient-text">
              <CreditCard className="mr-2 h-5 w-5" />
              Finalizar Pagamento - {selectedPlan === 'premium' ? 'Premium' : 'Enterprise'}
            </CardTitle>
            <CardDescription className="text-cyber-cyan">
              Escolha sua forma de pagamento preferida
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Métodos de Pagamento */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={paymentMethod === 'pix' ? 'default' : 'outline'}
                className={`h-20 ${
                  paymentMethod === 'pix' 
                    ? 'bg-cyber-cyan/20 border-cyber-cyan' 
                    : 'border-cyber-cyan/30 hover:bg-cyber-cyan/10'
                }`}
                onClick={() => setPaymentMethod('pix')}
              >
                <div className="text-center">
                  <QrCode className="h-8 w-8 mx-auto mb-2 text-cyber-cyan" />
                  <div className="text-cyber-blue font-medium">PIX</div>
                  <div className="text-xs text-cyber-cyan">Aprovação instantânea</div>
                </div>
              </Button>
              
              <Button
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                className={`h-20 ${
                  paymentMethod === 'card' 
                    ? 'bg-cyber-cyan/20 border-cyber-cyan' 
                    : 'border-cyber-cyan/30 hover:bg-cyber-cyan/10'
                }`}
                onClick={() => setPaymentMethod('card')}
              >
                <div className="text-center">
                  <CreditCard className="h-8 w-8 mx-auto mb-2 text-cyber-cyan" />
                  <div className="text-cyber-blue font-medium">Cartão</div>
                  <div className="text-xs text-cyber-cyan">Débito ou crédito</div>
                </div>
              </Button>
            </div>

            {/* Resumo */}
            <div className="bg-black/40 rounded-lg p-4 border border-cyber-cyan/30">
              <div className="flex justify-between items-center mb-2 text-cyber-blue">
                <span>Plano {selectedPlan === 'premium' ? 'Premium' : 'Enterprise'}</span>
                <span className="font-medium">{selectedPlan === 'premium' ? 'R$ 19,90' : 'R$ 49,90'}</span>
              </div>
              <div className="flex justify-between items-center mb-2 text-cyber-cyan">
                <span>Taxa Mercado Pago</span>
                <span>R$ 0,00</span>
              </div>
              <hr className="border-cyber-cyan/30 my-2" />
              <div className="flex justify-between items-center font-bold text-cyber-blue">
                <span>Total</span>
                <span className="text-cyber-cyan text-xl">{selectedPlan === 'premium' ? 'R$ 19,90' : 'R$ 49,90'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={generatePixPayment}
                className="cyber-button"
                size="lg"
                disabled={loading || paymentMethod !== 'pix'}
              >
                {loading && paymentMethod === 'pix' ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <QrCode className="mr-2 h-5 w-5" />
                )}
                Pagar com PIX
              </Button>

              <Button 
                onClick={generateCardPayment}
                className="cyber-button"
                size="lg"
                disabled={loading || paymentMethod !== 'card'}
              >
                {loading && paymentMethod === 'card' ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <CreditCard className="mr-2 h-5 w-5" />
                )}
                Pagar com Cartão
              </Button>
            </div>

            {/* QR Code PIX */}
            {showQRCode && pixData && (
              <Card className="bg-black/60 border-cyber-cyan animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-center gradient-text">🎯 PIX Gerado com Sucesso!</CardTitle>
                  <CardDescription className="text-center text-cyber-cyan">
                    Escaneie o QR Code ou copie o código PIX abaixo
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center shadow-lg">
                    {pixData.point_of_interaction?.transaction_data?.qr_code_base64 ? (
                      <img 
                        src={`data:image/png;base64,${pixData.point_of_interaction.transaction_data.qr_code_base64}`}
                        alt="QR Code PIX"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <QrCode className="h-32 w-32 text-black" />
                    )}
                  </div>
                  
                  {pixData.point_of_interaction?.transaction_data?.qr_code && (
                    <div className="bg-black/40 p-3 rounded-lg border border-cyber-cyan/30">
                      <div className="text-xs text-cyber-cyan mb-1 font-medium">Código PIX para Copiar:</div>
                      <div className="font-mono text-sm break-all text-cyber-blue mb-2 bg-black/60 p-2 rounded max-h-20 overflow-y-auto">
                        {pixData.point_of_interaction.transaction_data.qr_code}
                      </div>
                      <Button 
                        onClick={copyPixCode}
                        size="sm"
                        className="cyber-button w-full"
                      >
                        📋 Copiar Código PIX
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center space-x-2 text-sm text-cyber-cyan bg-cyber-blue/10 p-2 rounded">
                    <Smartphone className="h-4 w-4" />
                    <span>⚡ Pagamento será confirmado automaticamente</span>
                  </div>
                  
                  <div className="text-xs text-cyber-blue bg-black/40 p-2 rounded border border-yellow-500/30">
                    ⏱️ <strong>PIX expira em 15 minutos</strong> - Pague agora para garantir o desconto!
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentSystem;