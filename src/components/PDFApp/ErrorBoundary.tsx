import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  ErrorComponent?: React.ComponentType;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    const { children, ErrorComponent } = this.props;

    if (this.state.hasError) {
      return ErrorComponent ? (
        <ErrorComponent />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="space-y-8 text-md">
            <h1 className="font-medium text-xl">Oops, something went wrong!</h1>
            <div className="space-y-2 text-md">
              <h2>Try refreshing the page.</h2>
              <h2>Contact us if you continue seeing this error.</h2>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
