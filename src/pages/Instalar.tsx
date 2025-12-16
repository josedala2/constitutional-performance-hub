import { useState, useEffect } from 'react';
import { Download, Smartphone, Monitor, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import tribunalLogo from '@/assets/tribunal-logo.png';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Instalar = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <img 
            src={tribunalLogo} 
            alt="SGAD Logo" 
            className="h-20 mx-auto mb-4"
          />
          <CardTitle className="text-2xl">Instalar SGAD</CardTitle>
          <CardDescription>
            Instale a aplicação no seu dispositivo para acesso rápido
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isInstalled ? (
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <p className="text-lg font-medium text-foreground">
                A aplicação já está instalada!
              </p>
              <p className="text-muted-foreground">
                Pode encontrá-la no ecrã inicial do seu dispositivo.
              </p>
            </div>
          ) : isIOS ? (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Instalar no iPhone/iPad
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Toque no ícone de <strong>Partilhar</strong> (quadrado com seta)</li>
                  <li>Deslize e toque em <strong>"Adicionar ao Ecrã Principal"</strong></li>
                  <li>Toque em <strong>"Adicionar"</strong> no canto superior direito</li>
                </ol>
              </div>
            </div>
          ) : deferredPrompt ? (
            <div className="space-y-4">
              <Button 
                onClick={handleInstall} 
                className="w-full"
                size="lg"
              >
                <Download className="h-5 w-5 mr-2" />
                Instalar Aplicação
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                A aplicação será instalada e ficará disponível no seu dispositivo.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Instalar no Computador
                </h3>
                <p className="text-sm text-muted-foreground">
                  Procure o ícone de instalação na barra de endereços do navegador ou no menu do navegador.
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Instalar no Android
                </h3>
                <p className="text-sm text-muted-foreground">
                  Abra o menu do navegador e selecione "Instalar aplicação" ou "Adicionar ao ecrã inicial".
                </p>
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Vantagens da instalação:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Acesso rápido a partir do ecrã inicial</li>
              <li>• Funciona offline</li>
              <li>• Experiência similar a uma aplicação nativa</li>
              <li>• Carregamento mais rápido</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Instalar;
