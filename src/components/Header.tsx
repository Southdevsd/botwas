import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Settings, LogOut, User, Github, Crown, GitBranch } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

const Header = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [isConnectingGithub, setIsConnectingGithub] = useState(false);

  const userPlan = JSON.parse(localStorage.getItem('userPlan') || '{}');
  const hasPremium = userPlan.type && (userPlan.type === 'premium' || userPlan.type === 'enterprise');
  const currentUserId = user?.id;
  const planUserId = userPlan.userId;
  const isPlanOwner = currentUserId === planUserId;

  const connectToGithub = async () => {
    setIsConnectingGithub(true);
    try {
      const clientId = 'your_github_client_id';
      const redirectUri = encodeURIComponent(window.location.origin + '/auth/github/callback');
      const scope = 'repo,user,write:repo_hook';

      const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=github_connect`;

      localStorage.setItem('githubConnectionAttempt', JSON.stringify({
        userId: user?.id,
        timestamp: Date.now()
      }));

      window.location.href = githubAuthUrl;
    } catch (error) {
      console.error('Erro ao conectar GitHub:', error);
      setIsConnectingGithub(false);
    }
  };

  return (
    <header className="border-b border-cyber-cyan/20 bg-black/90 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img 
              src="https://i.ibb.co/tp4391yR/88b15277-6f21-48f9-bff0-b823e55a8dfe.png" 
              alt="BotCraft" 
              className="h-12 w-auto filter drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]"
            />
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-cyber-cyan hover:text-cyber-blue transition-colors font-medium">
            Recursos
          </a>
          <a href="/docs" className="text-cyber-cyan hover:text-cyber-blue transition-colors font-medium">
            Documentação
          </a>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-cyber-cyan hover:text-cyber-blue hover:bg-cyber-cyan/10 border border-cyber-cyan/30"
            onClick={() => window.location.href = '/premium'}
          >
            <Crown className="mr-2 h-4 w-4" />
            {hasPremium && isPlanOwner ? userPlan.type.charAt(0).toUpperCase() + userPlan.type.slice(1) : 'Premium'}
          </Button>
        </nav>

        <div className="flex items-center space-x-4">
          {isAuthenticated && user ? (
            <>
              {hasPremium && isPlanOwner && (
                <div className="flex items-center space-x-2">
                  <Badge className="bg-gradient-to-r from-cyber-cyan to-cyber-blue text-black font-bold">
                    {userPlan.type === 'enterprise' ? 'Enterprise' : 'Premium'}
                  </Badge>
                  <Button
                    onClick={connectToGithub}
                    disabled={isConnectingGithub}
                    variant="outline"
                    size="sm"
                    className="border-cyber-cyan/30 hover:bg-cyber-cyan/10 text-cyber-cyan hover:text-cyber-blue"
                  >
                    <GitBranch className="mr-2 h-4 w-4" />
                    {isConnectingGithub ? 'Conectando...' : 'Conectar GitHub'}
                  </Button>
                </div>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-cyber-cyan/30 hover:border-cyber-cyan">
                    <Avatar className="h-10 w-10">
                      <AvatarImage 
                        src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`} 
                        alt={user.username} 
                      />
                      <AvatarFallback className="bg-gradient-to-r from-cyber-cyan to-cyber-blue text-black font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-black/95 border-cyber-cyan/30 backdrop-blur-md" align="end">
                  <div className="px-2 py-1.5 text-sm">
                    <p className="font-medium text-cyber-blue">{user.username}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-cyber-cyan">#{user.discriminator}</p>
                      <Badge className="bg-gradient-to-r from-cyber-cyan to-cyber-blue text-black text-xs font-bold">
                        {user.provider === 'discord' ? 'Discord' : 'GitHub'}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenuItem className="text-cyber-cyan hover:text-cyber-blue hover:bg-cyber-cyan/10">
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-cyber-cyan hover:text-cyber-blue hover:bg-cyber-cyan/10">
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </DropdownMenuItem>
                  {!hasPremium || !isPlanOwner ? (
                    <DropdownMenuItem 
                      onClick={() => window.location.href = '/premium'}
                      className="text-cyber-cyan hover:text-cyber-blue hover:bg-cyber-cyan/10"
                    >
                      <Crown className="mr-2 h-4 w-4" />
                      Upgrade Premium
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuItem 
                    onClick={logout}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex space-x-2">

              <Button 
                onClick={() => login('discord')}
                className="bg-gradient-to-r from-cyber-cyan to-cyber-blue hover:from-cyber-green hover:to-cyber-cyan text-black font-bold shadow-[0_0_20px_rgba(0,255,255,0.3)]"
              >
                Entrar com Discord
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
