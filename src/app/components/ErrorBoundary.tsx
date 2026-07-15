import { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
    try {
      // Exponer último error en window para debugging rápido
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.__LAST_ERROR__ = { error: error?.toString(), stack: errorInfo?.componentStack };
    } catch {}
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0C0C0E] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#141416] border border-red-500/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="size-6 text-red-400" />
              <h1 className="text-lg font-semibold text-red-400">Error en la aplicación</h1>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-[#6E6E7E]">
                Ha ocurrido un error inesperado. Por favor, recarga la página.
              </p>
              
              {this.state.error && (
                <details open className="text-xs text-[#6E6E7E] bg-[#0A0A0C] p-3 rounded border border-[#C9A84C]/10">
                  <summary className="cursor-pointer font-semibold text-[#C9A84C] mb-2">
                    Detalles técnicos
                  </summary>
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={() => {
                        const txt = `${this.state.error?.toString() || ''}\n\n${this.state.errorInfo?.componentStack || ''}`;
                        navigator.clipboard?.writeText(txt).catch(() => {});
                      }}
                      className="text-xs px-2 py-1 bg-[#C9A84C] text-[#0A0A0C] rounded"
                    >
                      Copiar detalles
                    </button>
                    <span className="text-[11px] text-[#6E6E7E]">(se han copiado al portapapeles si el navegador lo permite)</span>
                  </div>
                  <pre className="overflow-auto max-h-72 whitespace-pre-wrap break-words text-[12px]">
{`${this.state.error.toString()}

${this.state.errorInfo?.componentStack || ''}`}
                  </pre>
                </details>
              )}
              
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-[#C9A84C] hover:bg-[#D4B55A] text-[#0A0A0C] font-semibold py-2 rounded transition-colors"
              >
                Recargar página
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
