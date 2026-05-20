import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary Atom - Catches JS errors anywhere in child component tree
 * Logs with Rule 9 format: [ErrorBoundary] Action: detail
 * Displays fallback UI instead of crashing the whole app
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    console.error('[ErrorBoundary] Caught error:', error.message);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const timestamp = new Date().toISOString();
    console.error(`[ErrorBoundary] Error caught at ${timestamp}: ${error.message}`);
    console.error(`[ErrorBoundary] ComponentStack: ${errorInfo.componentStack}`);
    console.error(`[ErrorBoundary] Stack: ${error.stack}`);
    
    this.setState({ errorInfo });
  }

  handleReset = (): void => {
    console.log('[ErrorBoundary] Reset triggered by user');
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8 text-center space-y-4">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800">
              Terjadi Kesalahan
            </h2>
            <p className="text-gray-600">
              Maaf, terjadi error pada komponen ini.
            </p>
            {this.state.error && (
              <details className="text-left bg-gray-100 p-4 rounded-xl text-sm text-gray-700">
                <summary className="cursor-pointer font-semibold mb-2">
                  Detail Error
                </summary>
                <p className="font-mono text-xs break-all">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <pre className="mt-2 text-xs overflow-auto max-h-32">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </details>
            )}
            <button
              onClick={this.handleReset}
              className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
