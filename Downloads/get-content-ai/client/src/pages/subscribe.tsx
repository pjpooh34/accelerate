import { useStripe, Elements, PaymentElement, useElements, PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import { loadStripe, PaymentRequest } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Brain, Zap, Crown, Apple, Smartphone } from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";
import PriceDisplay from "@/components/ui/price-display";
import CurrencySelector from "@/components/ui/currency-selector";
import { useCurrency } from "@/hooks/use-currency";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const SubscribeForm = ({ clientSecret }: { clientSecret: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const { currentCurrency } = useCurrency();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
  const [canMakePayment, setCanMakePayment] = useState(false);

  // Initialize Apple Pay / Google Pay
  useEffect(() => {
    if (stripe && clientSecret) {
      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'Get Content AI Pro Subscription',
          amount: 2900, // $29.00 in cents
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      // Check if Apple Pay / Google Pay is available
      pr.canMakePayment().then(result => {
        if (result) {
          setPaymentRequest(pr);
          setCanMakePayment(true);
        }
      });

      pr.on('paymentmethod', async (ev) => {
        setIsProcessing(true);
        
        // Confirm payment with the payment method from Apple Pay / Google Pay
        const { error: confirmError } = await stripe.confirmPayment({
          elements: elements!,
          confirmParams: {
            return_url: `${window.location.origin}/dashboard?upgraded=true`,
          },
        });

        if (confirmError) {
          ev.complete('fail');
          toast({
            title: "Payment Failed",
            description: confirmError.message,
            variant: "destructive",
          });
        } else {
          ev.complete('success');
          toast({
            title: "Welcome to Pro! 🎉",
            description: "You now have unlimited access to premium AI models!",
          });
        }
        setIsProcessing(false);
      });
    }
  }, [stripe, elements, clientSecret, toast]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard?upgraded=true`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome to Pro! 🎉",
        description: "You now have access to all premium features including Claude AI!",
      });
    }
    setIsProcessing(false);
  }

  if (!stripe || !elements) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-sm text-gray-600">Loading payment form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Apple Pay / Google Pay Button */}
      {canMakePayment && paymentRequest && (
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Quick Payment</span>
            </div>
          </div>
          
          <div className="p-4 border-2 border-dashed border-green-200 rounded-lg bg-green-50">
            <div className="flex items-center gap-2 mb-3">
              <Apple className="w-5 h-5 text-green-600" />
              <Smartphone className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">One-Tap Payment Available</span>
            </div>
            <PaymentRequestButtonElement 
              options={{ 
                paymentRequest,
                style: {
                  paymentRequestButton: {
                    height: '48px',
                    theme: 'dark',
                    type: 'subscribe'
                  }
                }
              }} 
            />
            <p className="text-xs text-green-600 mt-2">
              Pay securely with your saved payment method
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or pay with card</span>
            </div>
          </div>
        </div>
      )}

      {/* Regular Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 border rounded-lg bg-gray-50">
          <PaymentElement 
            options={{
              layout: 'tabs',
              wallets: {
                applePay: 'auto',
                googlePay: 'auto'
              }
            }}
          />
        </div>
        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              Processing Payment...
            </div>
          ) : (
            <span className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Subscribe to Pro - <PriceDisplay usdAmount={29} className="font-bold" />/month
            </span>
          )}
        </Button>
      </form>
    </div>
  );
};

export default function Subscribe() {
  const [clientSecret, setClientSecret] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      // Store redirect path for after login
      localStorage.setItem('redirectAfterLogin', '/subscribe');
      return;
    }
    
    // Create subscription as soon as the page loads
    apiRequest("POST", "/api/get-or-create-subscription")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Subscription response:', data);
        if (data.alreadySubscribed) {
          toast({
            title: "Already Subscribed",
            description: "You already have an active Pro subscription!",
          });
          // Redirect to dashboard
          window.location.href = '/dashboard';
          return;
        }
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          throw new Error('No client secret received from server');
        }
      })
      .catch((error) => {
        console.error('Subscription error:', error);
        toast({
          title: "Payment Setup Error",
          description: "Unable to initialize payment system. Please check your connection and try again.",
          variant: "destructive",
        });
        setClientSecret("error"); // Mark as error state instead of loading
      });
  }, [user, toast]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Crown className="h-6 w-6 text-yellow-500" />
              Login Required
            </CardTitle>
            <CardDescription>Please login to upgrade to Pro and unlock unlimited AI content generation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/login">Login to Continue</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/signup">Create Account</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-yellow-500 mr-2" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Upgrade to Pro
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            Unlock premium AI models and advanced features
          </p>
        </div>

        {/* Features Comparison */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-gray-500" />
                Free Plan
              </CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
              <PriceDisplay usdAmount={0} size="xl" className="text-gray-800 dark:text-gray-200" />
              <span className="text-lg font-normal text-gray-500">/month</span>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm">5 AI generations total</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm">Basic OpenAI model</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm">Standard templates</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm">Basic content history</span>
              </div>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="relative border-2 border-yellow-400 shadow-lg">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900">
              Most Popular
            </Badge>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Crown className="w-5 h-5 mr-2 text-yellow-500" />
                Pro Plan
              </CardTitle>
              <CardDescription>For serious content creators</CardDescription>
              <PriceDisplay usdAmount={29} size="xl" className="text-yellow-600" showOriginal />
              <span className="text-lg font-normal text-gray-500">/month</span>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm font-medium">Unlimited AI generations</span>
              </div>
              <div className="flex items-center">
                <Brain className="w-4 h-4 text-purple-500 mr-2" />
                <span className="text-sm font-medium"><strong>Claude 4.0</strong> (Latest)</span>
              </div>
              <div className="flex items-center">
                <Sparkles className="w-4 h-4 text-blue-500 mr-2" />
                <span className="text-sm font-medium"><strong>OpenAI GPT-4.5 Turbo</strong> (Latest)</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm">Advanced content variations</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm">Priority support</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm">Export to all formats</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm">Advanced analytics</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Form */}
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center">
              <Crown className="w-5 h-5 mr-2 text-yellow-500" />
              Complete Your Upgrade
            </CardTitle>
            <CardDescription>
              Start your Pro subscription today
            </CardDescription>
            <div className="flex justify-center mt-4">
              <CurrencySelector />
            </div>
          </CardHeader>
          <CardContent>
            {clientSecret === "error" ? (
              <div className="text-center py-8">
                <div className="text-red-500 mb-4">
                  <p className="font-medium">Payment Setup Error</p>
                  <p className="text-sm text-gray-600 mt-1">Unable to initialize payment system</p>
                </div>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : !clientSecret ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-3" aria-label="Loading"/>
                <p className="text-sm text-gray-600">Setting up secure payment...</p>
              </div>
            ) : (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <SubscribeForm />
              </Elements>
            )}
          </CardContent>
        </Card>

        {/* FAQ */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>✨ Cancel anytime • 💳 Secure payments • 🔒 Your data is safe</p>
        </div>
      </div>
    </div>
  );
}