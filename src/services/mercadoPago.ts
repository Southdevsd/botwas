const MERCADO_PAGO_ACCESS_TOKEN = 'APP_USR-7606973127275950-111219-a97a24579776575e3c67b18fdffca6a3-227310969';

export interface PaymentPreference {
  id: string;
  init_point: string;
  qr_code?: string;
  qr_code_base64?: string;
}

export interface PaymentStatus {
  id: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  status_detail: string;
  payment_type: string;
  payment_method_id: string;
}

export interface PixPayment {
  id: string;
  status: string;
  point_of_interaction: {
    transaction_data: {
      qr_code: string;
      qr_code_base64: string;
    }
  }
}

class MercadoPagoService {
  private baseUrl = 'https://api.mercadopago.com';

  async createPreference(planType: 'premium' | 'enterprise'): Promise<PaymentPreference> {
    const planData = {
      premium: {
        title: 'BotCraft Premium',
        price: 19.90,
        description: 'Plano Premium - Bots ilimitados + IA + Deploy automático'
      },
      enterprise: {
        title: 'BotCraft Enterprise',
        price: 49.90,
        description: 'Plano Enterprise - Tudo do Premium + Suporte prioritário + White Label'
      }
    };

    const plan = planData[planType];

    const preference = {
      items: [
        {
          title: plan.title,
          description: plan.description,
          unit_price: plan.price,
          quantity: 1,
          currency_id: 'BRL'
        }
      ],
      payer: {
        email: 'customer@email.com'
      },
      payment_methods: {
        excluded_payment_types: [],
        excluded_payment_methods: [],
        installments: 12
      },
      back_urls: {
        success: `${window.location.origin}/payment/success?plan=${planType}`,
        failure: `${window.location.origin}/payment/failure`,
        pending: `${window.location.origin}/payment/pending?plan=${planType}`
      },
      auto_return: 'approved',
      notification_url: `${window.location.origin}/webhooks/mercadopago`,
      statement_descriptor: 'BOTCRAFT',
      external_reference: `botcraft_${planType}_${Date.now()}`
    };

    try {
      const response = await fetch(`${this.baseUrl}/checkout/preferences`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': `pref_${Date.now()}`
        },
        body: JSON.stringify(preference)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Erro na resposta:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Preferência criada:', data);
      
      return {
        id: data.id,
        init_point: data.init_point,
        qr_code: data.qr_code,
        qr_code_base64: data.qr_code_base64
      };
    } catch (error) {
      console.error('Erro ao criar preferência:', error);
      throw error;
    }
  }

  async createPixPayment(planType: 'premium' | 'enterprise'): Promise<PixPayment> {
    const planData = {
      premium: { price: 19.90, title: 'BotCraft Premium' },
      enterprise: { price: 49.90, title: 'BotCraft Enterprise' }
    };

    const plan = planData[planType];

    const payment = {
      transaction_amount: plan.price,
      description: `${plan.title} - Plano ${planType}`,
      payment_method_id: 'pix',
      payer: {
        email: 'customer@email.com',
        first_name: 'Cliente',
        last_name: 'BotCraft',
        identification: {
          type: 'CPF',
          number: '12345678901'
        }
      },
      metadata: {
        plan_type: planType,
        user_id: 'temp_user_' + Date.now()
      }
    };

    try {
      const response = await fetch(`${this.baseUrl}/v1/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': `pix_${Date.now()}`
        },
        body: JSON.stringify(payment)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Erro na resposta PIX:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('PIX criado:', data);
      
      // Salvar informações do pagamento no localStorage
      const paymentInfo = {
        paymentId: data.id,
        planType: planType,
        amount: plan.price,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('pendingPayment', JSON.stringify(paymentInfo));
      
      return data;
    } catch (error) {
      console.error('Erro ao criar PIX:', error);
      throw error;
    }
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Se pagamento aprovado, ativar plano
      if (data.status === 'approved') {
        this.activatePlan(data.metadata.plan_type, data.metadata.user_id);
      }
      
      return {
        id: data.id,
        status: data.status,
        status_detail: data.status_detail,
        payment_type: data.payment_type_id,
        payment_method_id: data.payment_method_id
      };
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      throw error;
    }
  }

  private activatePlan(planType: string, userId: string) {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (currentUser.id) {
      const userPlan = {
        type: planType,
        userId: currentUser.id,
        provider: currentUser.provider,
        activatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 dias
      };
      
      localStorage.setItem('userPlan', JSON.stringify(userPlan));
      localStorage.removeItem('pendingPayment');
      
      console.log(`Plano ${planType} ativado para usuário ${currentUser.username}`);
    }
  }
}

export const mercadoPagoService = new MercadoPagoService();