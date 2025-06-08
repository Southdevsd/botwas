export interface EmailData {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  async sendPaymentConfirmation(userEmail: string, planType: string, userName: string) {
    const emailData = {
      to: userEmail,
      subject: `🎉 Pagamento Confirmado - BotCraft ${planType}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; border-radius: 10px; padding: 20px;">
          <div style="text-align: center; border-bottom: 2px solid #00ffff; padding-bottom: 20px; margin-bottom: 20px;">
            <h1 style="color: #00ffff; margin: 0;">BotCraft</h1>
            <p style="color: #888; margin: 5px 0;">Plataforma de Criação de Bots Discord</p>
          </div>
          
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 80px; height: 80px; background: linear-gradient(45deg, #00ffff, #0080ff); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 40px;">✅</span>
            </div>
            <h2 style="color: #00ffff; margin: 0 0 10px 0;">Pagamento Confirmado!</h2>
            <p style="color: #ccc; margin: 0;">Olá ${userName}, seu plano ${planType} foi ativado com sucesso!</p>
          </div>
          
          <div style="background: #111; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #00ffff; margin: 0 0 15px 0;">Detalhes do Plano</h3>
            <p style="margin: 5px 0; color: #ccc;"><strong>Plano:</strong> ${planType}</p>
            <p style="margin: 5px 0; color: #ccc;"><strong>Status:</strong> Ativo</p>
            <p style="margin: 5px 0; color: #ccc;"><strong>Renovação:</strong> ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
          </div>
          
          <div style="background: #111; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #00ffff; margin: 0 0 15px 0;">O que você ganhou:</h3>
            <ul style="color: #ccc; padding-left: 20px;">
              <li>Bots ilimitados</li>
              <li>IA para comandos personalizados</li>
              <li>Deploy automático</li>
              <li>Suporte prioritário</li>
              <li>Templates premium</li>
            </ul>
          </div>
          
          <div style="text-align: center;">
            <a href="${window.location.origin}" style="display: inline-block; background: linear-gradient(45deg, #00ffff, #0080ff); color: #000; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Acessar BotCraft
            </a>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #333; color: #888; font-size: 12px;">
            <p>Este é um e-mail automático. Para suporte, entre em contato conosco.</p>
          </div>
        </div>
      `
    };

    try {
      // Simulação do envio de email - em produção, usar serviço real
      console.log('Enviando email de confirmação:', emailData);
      
      // Simular delay do envio
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true, message: 'Email enviado com sucesso!' };
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return { success: false, message: 'Erro ao enviar email' };
    }
  }
}

export const emailService = new EmailService();