import { useState } from 'react';
import Header from '@/components/Header';
import PaymentSystem from '@/components/PaymentSystem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Zap, Shield, Rocket, Users, BarChart3, Github, ArrowLeft } from 'lucide-react';

const Premium = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="mb-6 border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          
          <h1 className="text-5xl font-bold mb-4 gradient-text animate-glow">
            BotCraft Premium
          </h1>
          <p className="text-xl text-cyan-300 max-w-2xl mx-auto">
            Desbloqueie todo o potencial da criação de bots Discord com recursos avançados, 
            IA integrada e deploy automático.
          </p>
        </div>

        {/* Benefícios Premium */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="cyber-card hover-scale">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="gradient-text">Bots Ilimitados</CardTitle>
              <CardDescription className="text-cyan-300">
                Crie quantos bots quiser, sem limitações de quantidade ou funcionalidades
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="cyber-card hover-scale">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="gradient-text">IA Avançada</CardTitle>
              <CardDescription className="text-cyan-300">
                Comandos gerados automaticamente, correção de código e sugestões inteligentes
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="cyber-card hover-scale">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="gradient-text">Deploy Automático</CardTitle>
              <CardDescription className="text-cyan-300">
                Hospedagem automática em Heroku, Railway, Vercel ou VPS personalizado
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="cyber-card hover-scale">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="gradient-text">Suporte Prioritário</CardTitle>
              <CardDescription className="text-cyan-300">
                Atendimento 24/7 com resposta em até 1 hora e suporte técnico especializado
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="cyber-card hover-scale">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="gradient-text">Analytics Avançado</CardTitle>
              <CardDescription className="text-cyan-300">
                Relatórios detalhados de uso, performance e estatísticas em tempo real
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="cyber-card hover-scale">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Github className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="gradient-text">Integração GitHub</CardTitle>
              <CardDescription className="text-cyan-300">
                Sincronização automática com repositórios e controle de versão completo
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Sistema de Pagamento */}
        <div className="max-w-6xl mx-auto">
          <PaymentSystem />
        </div>

        {/* Testimonials */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-8 gradient-text">
            O que nossos usuários dizem
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="cyber-card">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-black font-bold">
                    D
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-cyan-100">DevMaster</p>
                    <p className="text-sm text-cyan-300">Criador de 15+ bots</p>
                  </div>
                </div>
                <p className="text-cyan-200 text-sm">
                  "O BotCraft Premium revolucionou minha forma de criar bots. 
                  Em 2 horas criei um bot completo que antes levaria semanas!"
                </p>
              </CardContent>
            </Card>

            <Card className="cyber-card">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    C
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-cyan-100">CommunityAdmin</p>
                    <p className="text-sm text-cyan-300">50K+ membros</p>
                  </div>
                </div>
                <p className="text-cyan-200 text-sm">
                  "A IA do BotCraft entendeu exatamente o que eu precisava. 
                  Meu servidor nunca esteve tão organizado e automatizado."
                </p>
              </CardContent>
            </Card>

            <Card className="cyber-card">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-black font-bold">
                    S
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-cyan-100">StartupOwner</p>
                    <p className="text-sm text-cyan-300">Tech Startup</p>
                  </div>
                </div>
                <p className="text-cyan-200 text-sm">
                  "Deploy automático salvou nossa startup. Agora focamos no negócio 
                  enquanto o BotCraft cuida da infraestrutura."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8 gradient-text">
            Perguntas Frequentes
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-4">
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-cyan-100">Como funciona o pagamento?</CardTitle>
                <CardDescription className="text-cyan-300">
                  Aceitamos PIX (aprovação instantânea) e cartão de crédito via Mercado Pago. 
                  Sua assinatura é renovada automaticamente todo mês.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-cyan-100">Posso cancelar a qualquer momento?</CardTitle>
                <CardDescription className="text-cyan-300">
                  Sim! Você pode cancelar sua assinatura a qualquer momento sem multas. 
                  Seus bots continuarão funcionando até o final do período pago.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-cyan-100">Há limite de servidores para os bots?</CardTitle>
                <CardDescription className="text-cyan-300">
                  Não! Com o Premium, seus bots podem estar em quantos servidores você quiser, 
                  sem limitações de membros ou funcionalidades.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;