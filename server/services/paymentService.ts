import { z } from "zod";

// Payment method validation schema
export const paymentMethodSchema = z.enum([
  'telebirr', 
  'cbe', 
  'awashBank', 
  'bankOfAbyssinia', 
  'cooperativeBank', 
  'helloMoney', 
  'mpesa', 
  'card'
]);

// Payment request schema
export const paymentRequestSchema = z.object({
  amount: z.number().positive(),
  paymentMethod: paymentMethodSchema,
  routeId: z.string(),
  userId: z.string().optional(),
  phoneNumber: z.string().optional(),
  cardDetails: z.object({
    cardNumber: z.string(),
    expiryMonth: z.string(),
    expiryYear: z.string(),
    cvv: z.string(),
  }).optional(),
});

export type PaymentRequest = z.infer<typeof paymentRequestSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  message: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'cancelled';
  error?: string;
  qrCode?: string;
}

export class PaymentService {
  /**
   * Process payment for different Ethiopian payment methods
   */
  static async processPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Validate payment request
      const validatedRequest = paymentRequestSchema.parse(paymentRequest);
      
      switch (validatedRequest.paymentMethod) {
        case 'telebirr':
          return await this.processTeleBirrPayment(validatedRequest);
        case 'cbe':
          return await this.processCBEMobilePayment(validatedRequest);
        case 'awashBank':
          return await this.processAwashBankPayment(validatedRequest);
        case 'bankOfAbyssinia':
          return await this.processBankOfAbyssiniaPayment(validatedRequest);
        case 'cooperativeBank':
          return await this.processCooperativeBankPayment(validatedRequest);
        case 'helloMoney':
          return await this.processHelloMoneyPayment(validatedRequest);
        case 'mpesa':
          return await this.processMPesaPayment(validatedRequest);
        case 'card':
          return await this.processCardPayment(validatedRequest);
        default:
          throw new Error('Unsupported payment method');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        transactionId: this.generateTransactionId(),
        message: 'Payment failed due to an error',
        paymentStatus: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Process TeleBirr mobile money payment
   */
  private static async processTeleBirrPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Simulate TeleBirr API call
      if (!request.phoneNumber) {
        throw new Error('Phone number is required for TeleBirr payments');
      }

      const transactionId = this.generateTransactionId();
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real implementation, you would call TeleBirr API here
      // const telebirrResponse = await fetch('https://api.telebirr.com/payment', {...});

      // Simulate successful payment (90% success rate for demo)
      const isSuccessful = Math.random() > 0.1;
      
      if (isSuccessful) {
        return {
          success: true,
          transactionId,
          message: 'TeleBirr payment processed successfully - በቴሌብር በተሳካ ሁኔታ ተከፍሏል',
          paymentStatus: 'paid',
          qrCode: `TELEBIRR-${transactionId}`
        };
      } else {
        throw new Error('TeleBirr payment failed - insufficient balance');
      }
    } catch (error) {
      return {
        success: false,
        transactionId: this.generateTransactionId(),
        message: 'TeleBirr payment failed',
        paymentStatus: 'failed',
        error: error instanceof Error ? error.message : 'TeleBirr service error'
      };
    }
  }

  /**
   * Process CBE Mobile Banking payment
   */
  private static async processCBEMobilePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      if (!request.phoneNumber) {
        throw new Error('Phone number is required for CBE Mobile Banking');
      }

      const transactionId = this.generateTransactionId();
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Simulate CBE Mobile Banking API
      const isSuccessful = Math.random() > 0.15;
      
      if (isSuccessful) {
        return {
          success: true,
          transactionId,
          message: 'CBE Mobile Banking payment successful - በሲቢኢ ሞባይል ባንኪንግ በተሳካ ሁኔታ ተከፍሏል',
          paymentStatus: 'paid',
          qrCode: `CBE-${transactionId}`
        };
      } else {
        throw new Error('CBE Mobile Banking payment failed');
      }
    } catch (error) {
      return {
        success: false,
        transactionId: this.generateTransactionId(),
        message: 'CBE Mobile Banking payment failed',
        paymentStatus: 'failed',
        error: error instanceof Error ? error.message : 'CBE service error'
      };
    }
  }

  /**
   * Process Awash Bank Mobile payment
   */
  private static async processAwashBankPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      if (!request.phoneNumber) {
        throw new Error('Phone number is required for Awash Bank Mobile');
      }

      const transactionId = this.generateTransactionId();
      await new Promise(resolve => setTimeout(resolve, 3000));

      const isSuccessful = Math.random() > 0.2;
      
      if (isSuccessful) {
        return {
          success: true,
          transactionId,
          message: 'Awash Bank Mobile payment successful - በአዋሽ ባንክ ሞባይል በተሳካ ሁኔታ ተከፍሏል',
          paymentStatus: 'paid',
          qrCode: `AWASH-${transactionId}`
        };
      } else {
        throw new Error('Awash Bank Mobile payment failed');
      }
    } catch (error) {
      return {
        success: false,
        transactionId: this.generateTransactionId(),
        message: 'Awash Bank Mobile payment failed',
        paymentStatus: 'failed',
        error: error instanceof Error ? error.message : 'Awash Bank service error'
      };
    }
  }

  /**
   * Process Bank of Abyssinia Mobile payment
   */
  private static async processBankOfAbyssiniaPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      if (!request.phoneNumber) {
        throw new Error('Phone number is required for Bank of Abyssinia Mobile');
      }

      const transactionId = this.generateTransactionId();
      await new Promise(resolve => setTimeout(resolve, 2800));

      const isSuccessful = Math.random() > 0.18;
      
      if (isSuccessful) {
        return {
          success: true,
          transactionId,
          message: 'Bank of Abyssinia Mobile payment successful',
          paymentStatus: 'paid',
          qrCode: `BOA-${transactionId}`
        };
      } else {
        throw new Error('Bank of Abyssinia Mobile payment failed');
      }
    } catch (error) {
      return {
        success: false,
        transactionId: this.generateTransactionId(),
        message: 'Bank of Abyssinia Mobile payment failed',
        paymentStatus: 'failed',
        error: error instanceof Error ? error.message : 'Bank of Abyssinia service error'
      };
    }
  }

  /**
   * Process Cooperative Bank Mobile payment
   */
  private static async processCooperativeBankPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      if (!request.phoneNumber) {
        throw new Error('Phone number is required for Cooperative Bank Mobile');
      }

      const transactionId = this.generateTransactionId();
      await new Promise(resolve => setTimeout(resolve, 2600));

      const isSuccessful = Math.random() > 0.25;
      
      if (isSuccessful) {
        return {
          success: true,
          transactionId,
          message: 'Cooperative Bank Mobile payment successful',
          paymentStatus: 'paid',
          qrCode: `COOP-${transactionId}`
        };
      } else {
        throw new Error('Cooperative Bank Mobile payment failed');
      }
    } catch (error) {
      return {
        success: false,
        transactionId: this.generateTransactionId(),
        message: 'Cooperative Bank Mobile payment failed',
        paymentStatus: 'failed',
        error: error instanceof Error ? error.message : 'Cooperative Bank service error'
      };
    }
  }

  /**
   * Process Hello Money payment
   */
  private static async processHelloMoneyPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      if (!request.phoneNumber) {
        throw new Error('Phone number is required for Hello Money');
      }

      const transactionId = this.generateTransactionId();
      await new Promise(resolve => setTimeout(resolve, 2200));

      const isSuccessful = Math.random() > 0.12;
      
      if (isSuccessful) {
        return {
          success: true,
          transactionId,
          message: 'Hello Money payment successful',
          paymentStatus: 'paid',
          qrCode: `HELLO-${transactionId}`
        };
      } else {
        throw new Error('Hello Money payment failed');
      }
    } catch (error) {
      return {
        success: false,
        transactionId: this.generateTransactionId(),
        message: 'Hello Money payment failed',
        paymentStatus: 'failed',
        error: error instanceof Error ? error.message : 'Hello Money service error'
      };
    }
  }

  /**
   * Process M-Pesa payment
   */
  private static async processMPesaPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      if (!request.phoneNumber) {
        throw new Error('Phone number is required for M-Pesa');
      }

      const transactionId = this.generateTransactionId();
      await new Promise(resolve => setTimeout(resolve, 1800));

      const isSuccessful = Math.random() > 0.08;
      
      if (isSuccessful) {
        return {
          success: true,
          transactionId,
          message: 'M-Pesa payment successful',
          paymentStatus: 'paid',
          qrCode: `MPESA-${transactionId}`
        };
      } else {
        throw new Error('M-Pesa payment failed');
      }
    } catch (error) {
      return {
        success: false,
        transactionId: this.generateTransactionId(),
        message: 'M-Pesa payment failed',
        paymentStatus: 'failed',
        error: error instanceof Error ? error.message : 'M-Pesa service error'
      };
    }
  }

  /**
   * Process credit/debit card payment
   */
  private static async processCardPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      if (!request.cardDetails) {
        throw new Error('Card details are required for card payments');
      }

      const { cardNumber, expiryMonth, expiryYear, cvv } = request.cardDetails;
      
      // Basic card validation
      if (!cardNumber || cardNumber.length < 13) {
        throw new Error('Invalid card number');
      }
      
      if (!cvv || cvv.length < 3) {
        throw new Error('Invalid CVV');
      }

      const transactionId = this.generateTransactionId();
      await new Promise(resolve => setTimeout(resolve, 3500));

      // Simulate card processing
      const isSuccessful = Math.random() > 0.1;
      
      if (isSuccessful) {
        return {
          success: true,
          transactionId,
          message: 'Card payment processed successfully',
          paymentStatus: 'paid',
          qrCode: `CARD-${transactionId}`
        };
      } else {
        throw new Error('Card payment declined');
      }
    } catch (error) {
      return {
        success: false,
        transactionId: this.generateTransactionId(),
        message: 'Card payment failed',
        paymentStatus: 'failed',
        error: error instanceof Error ? error.message : 'Card processing error'
      };
    }
  }

  /**
   * Generate a unique transaction ID
   */
  private static generateTransactionId(): string {
    const timestamp = Date.now().toString();
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TXN-${timestamp}-${randomSuffix}`;
  }

  /**
   * Get supported payment methods with their details
   */
  static getSupportedPaymentMethods() {
    return [
      {
        id: 'telebirr',
        name: 'TeleBirr',
        type: 'mobile_wallet',
        description: 'Ethiopia\'s leading mobile money service',
        requiresPhone: true,
        processingTime: '1-3 minutes',
        icon: 'smartphone'
      },
      {
        id: 'cbe',
        name: 'CBE Mobile Banking',
        type: 'mobile_banking',
        description: 'Commercial Bank of Ethiopia Mobile Banking',
        requiresPhone: true,
        processingTime: '2-5 minutes',
        icon: 'building'
      },
      {
        id: 'awashBank',
        name: 'Awash Bank Mobile',
        type: 'mobile_banking',
        description: 'Awash Bank Mobile Banking',
        requiresPhone: true,
        processingTime: '3-5 minutes',
        icon: 'building'
      },
      {
        id: 'bankOfAbyssinia',
        name: 'Bank of Abyssinia Mobile',
        type: 'mobile_banking',
        description: 'Bank of Abyssinia Mobile Banking',
        requiresPhone: true,
        processingTime: '2-4 minutes',
        icon: 'building'
      },
      {
        id: 'cooperativeBank',
        name: 'Cooperative Bank Mobile',
        type: 'mobile_banking',
        description: 'Cooperative Bank Mobile Banking',
        requiresPhone: true,
        processingTime: '2-5 minutes',
        icon: 'building'
      },
      {
        id: 'helloMoney',
        name: 'Hello Money',
        type: 'mobile_wallet',
        description: 'Hello Money Mobile Wallet',
        requiresPhone: true,
        processingTime: '1-3 minutes',
        icon: 'smartphone'
      },
      {
        id: 'mpesa',
        name: 'M-Pesa',
        type: 'mobile_wallet',
        description: 'M-Pesa Mobile Money',
        requiresPhone: true,
        processingTime: '1-2 minutes',
        icon: 'smartphone'
      },
      {
        id: 'card',
        name: 'Credit/Debit Card',
        type: 'card',
        description: 'Visa, Mastercard, and local cards',
        requiresPhone: false,
        processingTime: '1-2 minutes',
        icon: 'credit-card'
      }
    ];
  }

  /**
   * Validate phone number format for Ethiopian numbers
   */
  static validateEthiopianPhoneNumber(phoneNumber: string): boolean {
    // Ethiopian phone number format: +251XXXXXXXXX or 09XXXXXXXX
    const ethiopianPhoneRegex = /^(\+251|0)[79]\d{8}$/;
    return ethiopianPhoneRegex.test(phoneNumber);
  }
}
