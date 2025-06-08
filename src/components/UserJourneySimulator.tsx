import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Plus, Trash2, Users, Clock, BarChart3, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Journey {
  id: string;
  name: string;
  steps: string[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  duration?: number;
  successRate?: number;
}

const UserJourneySimulator = () => {
  const [journeys, setJourneys] = useState<Journey[]>([
    {
      id: '1',
      name: 'Novo Usuário - Primeira Interação',
      steps: [
        'Usuário entra no servidor',
        'Executa comando !help',
        'Lê as regras com !rules',
        'Executa comando !verify'
      ],
      status: 'completed',
      duration: 45,
      successRate: 95
    }
  ]);

  const [newJourney, setNewJourney] = useState({
    name: '',
    steps: ['']
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const { toast } = useToast();

  const addStep = () => {
    setNewJourney({
      ...newJourney,
      steps: [...newJourney.steps, '']
    });
  };

  const updateStep = (index: number, value: string) => {
    const updatedSteps = [...newJourney.steps];
    updatedSteps[index] = value;
    setNewJourney({
      ...newJourney,
      steps: updatedSteps
    });
  };

  const removeStep = (index: number) => {
    const updatedSteps = newJourney.steps.filter((_, i) => i !== index);
    setNewJourney({
      ...newJourney,
      steps: updatedSteps
    });
  };

  const createJourney = () => {
    if (!newJourney.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para a jornada",
        variant: "destructive"
      });
      return;
    }

    const journey: Journey = {
      id: Date.now().toString(),
      name: newJourney.name,
      steps: newJourney.steps.filter(step => step.trim()),
      status: 'pending'
    };

    setJourneys([...journeys, journey]);
    setNewJourney({ name: '', steps: [''] });
    
    toast({
      title: "Jornada criada!",
      description: "Nova jornada de usuário foi adicionada"
    });
  };

  const simulateJourney = async (journeyId: string) => {
    setIsSimulating(true);
    
    // Simular execução
    setJourneys(journeys.map(j => 
      j.id === journeyId ? { ...j, status: 'running' } : j
    ));

    // Simular tempo de execução
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Resultados simulados
    const duration = Math.floor(Math.random() * 120) + 30;
    const successRate = Math.floor(Math.random() * 20) + 80;

    setJourneys(journeys.map(j => 
      j.id === journeyId 
        ? { ...j, status: 'completed', duration, successRate }
        : j
    ));

    setIsSimulating(false);

    toast({
      title: "Simulação concluída!",
      description: `Jornada executada em ${duration}s com ${successRate}% de sucesso`
    });
  };

  const getStatusColor = (status: Journey['status']) => {
    switch (status) {
      case 'pending': return 'bg-gray-500';
      case 'running': return 'bg-blue-500 animate-pulse';
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Journey['status']) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'running': return 'Executando';
      case 'completed': return 'Concluída';
      case 'failed': return 'Falhou';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="space-y-6">
      {/* Criar Nova Jornada */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Simulação de Jornadas de Usuário
          </CardTitle>
          <CardDescription>
            Crie e teste fluxos completos de interação do usuário com seu bot
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Nome da Jornada</label>
            <Input 
              value={newJourney.name}
              onChange={(e) => setNewJourney({ ...newJourney, name: e.target.value })}
              placeholder="Ex: Fluxo de Moderação Completo"
              className="bg-background border-border"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Passos da Jornada</label>
              <Button onClick={addStep} size="sm" variant="outline">
                <Plus className="mr-1 h-3 w-3" />
                Adicionar
              </Button>
            </div>
            
            {newJourney.steps.map((step, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
                <Input
                  value={step}
                  onChange={(e) => updateStep(index, e.target.value)}
                  placeholder="Ex: Usuário executa comando !ban @usuario"
                  className="bg-background border-border flex-1"
                />
                {newJourney.steps.length > 1 && (
                  <Button 
                    onClick={() => removeStep(index)}
                    size="sm" 
                    variant="outline"
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button onClick={createJourney} className="w-full">
            Criar Jornada
          </Button>
        </CardContent>
      </Card>

      {/* Lista de Jornadas */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle>Jornadas Criadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {journeys.map((journey) => (
              <div key={journey.id} className="p-4 bg-background rounded-lg border space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{journey.name}</h3>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(journey.status)}>
                      {getStatusText(journey.status)}
                    </Badge>
                    <Button 
                      onClick={() => simulateJourney(journey.id)}
                      disabled={isSimulating || journey.status === 'running'}
                      size="sm"
                      className="bg-discord hover:bg-discord-dark text-white"
                    >
                      <Play className="mr-1 h-3 w-3" />
                      Simular
                    </Button>
                  </div>
                </div>

                {/* Passos */}
                <div className="space-y-1">
                  {journey.steps.map((step, index) => (
                    <div key={index} className="text-sm text-muted-foreground flex items-center">
                      <span className="w-6">{index + 1}.</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>

                {/* Métricas */}
                {journey.status === 'completed' && (
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Duração: {journey.duration}s</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Sucesso: {journey.successRate}%</span>
                    </div>
                  </div>
                )}

                {journey.status === 'running' && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      <span className="text-sm">Executando simulação...</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                )}
              </div>
            ))}

            {journeys.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma jornada criada ainda</p>
                <p className="text-sm">Crie sua primeira jornada acima</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserJourneySimulator;