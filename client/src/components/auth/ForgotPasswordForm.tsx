import { useState } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ForgotPasswordFormProps {
  onSwitchToLogin: () => void;
}

export default function ForgotPasswordForm({ onSwitchToLogin }: ForgotPasswordFormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email');
      }

      setIsSuccess(true);
      toast({
        title: t('auth.resetEmailSent') as string,
        description: t('auth.checkEmail') as string,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send reset email');
      toast({
        title: t('auth.resetEmailError') as string,
        description: error instanceof Error ? error.message : 'Failed to send reset email',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center space-x-2">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <CardTitle className="text-2xl font-bold flex items-center">
                <CheckCircle className="h-6 w-6 mr-2 text-green-500" />
                {t('auth.resetEmailSent')}
              </CardTitle>
            </div>
            <CardDescription>
              {t('auth.resetEmailDescription')}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                {t('auth.resetEmailInstructions')}
              </AlertDescription>
            </Alert>

            <Button
              onClick={onSwitchToLogin}
              className="w-full"
            >
              {t('auth.backToLogin')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-auto"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <CardTitle className="text-2xl font-bold">
              {t('auth.forgotPassword')}
            </CardTitle>
          </div>
          <CardDescription>
            {t('auth.forgotPasswordDescription')}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t('auth.emailPlaceholder') as string}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (t('auth.sendingEmail') as string) : (t('auth.sendResetEmail') as string)}
            </Button>

            <div className="text-center text-sm">
              {t('auth.rememberPassword')}{' '}
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-sm"
                onClick={onSwitchToLogin}
              >
                {t('auth.backToLogin')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 