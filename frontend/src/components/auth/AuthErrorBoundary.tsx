import { Component, ErrorInfo, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class AuthErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Auth error:", error, errorInfo);
    toast.error("Authentication Error", {
      description:
        "An error occurred with authentication. Please try logging in again.",
    });
  }

  public render() {
    if (this.state.hasError) {
      return <Navigate to="/login" replace />;
    }

    return this.props.children;
  }
}

export default AuthErrorBoundary;
