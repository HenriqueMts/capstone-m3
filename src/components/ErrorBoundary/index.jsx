import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // You can log the error to an error reporting service
    console.error("Uncaught error:", error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, fontFamily: "sans-serif" }}>
          <h1>Algo deu errado</h1>
          <pre style={{ whiteSpace: "pre-wrap", color: "#b00020" }}>
            {String(this.state.error && this.state.error.toString())}
          </pre>
          {this.state.info && (
            <details style={{ whiteSpace: "pre-wrap" }}>
              {this.state.info.componentStack}
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
