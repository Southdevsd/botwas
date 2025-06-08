import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const DiscordCallback = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Montar corretamente a URL do avatar do Discord
  const getAvatarUrl = () => {
    if (!user) return undefined;

    if (user.avatar) {
      return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
    } else {
      // Se não tiver avatar, usar um dos padrões do Discord
      const defaultAvatarIndex = parseInt(user.discriminator) % 5;
      return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000); // Dá tempo de exibir as informações antes do redirecionamento

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto">
        {user ? (
          <div className="space-y-6">
            <div className="animate-fade-in">
              <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-cyber-cyan shadow-[0_0_20px_rgba(0,255,255,0.5)]">
                <AvatarImage src={getAvatarUrl()} alt={user.username} />
                <AvatarFallback className="bg-gradient-to-r from-cyber-cyan to-cyber-blue text-black font-bold text-2xl">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2">
                <h1 className="text-3xl font-bold gradient-text">{user.username}</h1>
                <div className="flex items-center justify-center space-x-2">
                  <Badge className="bg-gradient-to-r from-[#5865F2] to-[#7289DA] text-white font-bold">
                    Discord
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-discord-green rounded-full animate-pulse"></div>
                <p className="text-discord-green font-medium">Conectado com sucesso!</p>
              </div>
              <p className="text-muted-foreground">Redirecionando para o dashboard...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyber-cyan mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold mb-2 gradient-text">Conectando com Discord...</h1>
            <p className="text-muted-foreground">Aguarde enquanto processamos sua autorização.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscordCallback;
