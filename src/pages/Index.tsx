import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import Header from '@/components/Header';
import PaymentSystem from '@/components/PaymentSystem';
import CommandLibrary from '@/components/CommandLibrary';
import EmbedVisualEditor from '@/components/EmbedVisualEditor';
import AICommandGenerator from '@/components/AICommandGenerator';
import SourceManager from '@/components/SourceManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Crown, Code, MessageSquare, Package, CreditCard, Zap, Bot, Users, BarChart3, Github, Video } from 'lucide-react';

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('commands');

  const userPlan = JSON.parse(localStorage.getItem('userPlan') || '{}');
  const hasActivePlan = userPlan?.type && new Date(userPlan.expiresAt) > new Date();

  // Verificar se o usuário pode postar sources
  const isMainAdmin = user?.email === 'mariadosocorrogomes1808@gmail.com';
  const authorizedPosters = JSON.parse(localStorage.getItem('authorizedSourcePosters') || '[]');
  const canPostSources = isMainAdmin || authorizedPosters.includes(user?.email);

  const stats = [
    { label: 'Bots Criados', value: '15,847', icon: Bot },
    { label: 'Desenvolvedores', value: '3,254', icon: Users },
    { label: 'Comandos Gerados', value: '89,234', icon: Code },
    { label: 'Uptime', value: '99.9%', icon: BarChart3 }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <Header />
        
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold mb-6 gradient-text animate-glow">
              BotCraft
            </h1>
            <p className="text-xl text-cyber-cyan max-w-3xl mx-auto mb-8">
              A plataforma mais avançada para criar bots Discord profissionais. 
              Com IA integrada, correção automática de código e deploy instantâneo.
            </p>
            <Button 
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              className="cyber-button text-lg px-8 py-4"
              size="lg"
            >
              <Zap className="mr-2 h-5 w-5" />
              Começar Agora
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="cyber-card text-center">
                <CardContent className="pt-6">
                  <stat.icon className="h-8 w-8 mx-auto mb-2 text-cyber-cyan" />
                  <div className="text-2xl font-bold text-cyber-blue">{stat.value}</div>
                  <div className="text-sm text-cyber-cyan">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="cyber-card hover-scale">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-cyber-cyan to-cyber-blue rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-black" />
                </div>
                <CardTitle className="gradient-text">Editor Visual</CardTitle>
                <CardDescription className="text-cyber-cyan">
                  Crie embeds profissionais com preview em tempo real e envio direto para Discord
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="cyber-card hover-scale">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="gradient-text">Correção com IA</CardTitle>
                <CardDescription className="text-cyber-cyan">
                  Cole seu código com erro e nossa IA corrige automaticamente
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="cyber-card hover-scale">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="gradient-text">Comandos Prontos</CardTitle>
                <CardDescription className="text-cyber-cyan">
                  Biblioteca com centenas de comandos prontos para download
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 gradient-text">
              Pronto para revolucionar seus bots Discord?
            </h2>
            <p className="text-cyber-cyan mb-8">
              Junte-se a milhares de desenvolvedores que já usam o BotCraft
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-text">
            Bem-vindo ao BotCraft, {user?.username}
          </h1>
          <p className="text-cyber-cyan mb-4">
            Sua plataforma completa para criação de bots Discord
          </p>
          
          <div className="flex justify-center gap-2 flex-wrap">
            {hasActivePlan && (
              <Badge className="bg-gradient-to-r from-cyber-cyan to-cyber-blue text-black">
                <Crown className="mr-1 h-3 w-3" />
                Plano {userPlan.type} Ativo
              </Badge>
            )}
            {canPostSources && (
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                <Video className="mr-1 h-3 w-3" />
                Autorizado a Postar Sources
              </Badge>
            )}
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-black/40 mb-8">
            <TabsTrigger value="commands" className="text-cyber-cyan">
              <Package className="mr-1 h-4 w-4" />
              Comandos
            </TabsTrigger>
            <TabsTrigger value="embeds" className="text-cyber-cyan">
              <MessageSquare className="mr-1 h-4 w-4" />
              Embeds
            </TabsTrigger>
            <TabsTrigger value="corrector" className="text-cyber-cyan">
              <Code className="mr-1 h-4 w-4" />
              Corretor IA
            </TabsTrigger>
            <TabsTrigger value="sources" className="text-cyber-cyan">
              <Video className="mr-1 h-4 w-4" />
              Sources
            </TabsTrigger>
            <TabsTrigger value="premium" className="text-cyber-cyan">
              <Crown className="mr-1 h-4 w-4" />
              Premium
            </TabsTrigger>
          </TabsList>

          <TabsContent value="commands" className="space-y-6">
            <CommandLibrary />
          </TabsContent>

          <TabsContent value="embeds" className="space-y-6">
            <EmbedVisualEditor />
          </TabsContent>

          <TabsContent value="corrector" className="space-y-6">
            <AICommandGenerator />
          </TabsContent>

          <TabsContent value="sources" className="space-y-6">
            <SourceManager 
              isAdmin={isMainAdmin} 
              canPost={canPostSources}
              userEmail={user?.email || ''}
            />
          </TabsContent>

          <TabsContent value="premium" className="space-y-6">
            {hasActivePlan ? (
              <Card className="cyber-card text-center">
                <CardContent className="pt-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-cyber-green to-cyber-cyan rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="h-10 w-10 text-black" />
                  </div>
                  <h2 className="text-2xl font-bold gradient-text mb-2">
                    Plano {userPlan.type} Ativo! 🎉
                  </h2>
                  <p className="text-cyber-cyan mb-4">
                    Você tem acesso a todos os recursos premium
                  </p>
                  <p className="text-sm text-cyber-blue">
                    Renovação em: {new Date(userPlan.expiresAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <PaymentSystem />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;