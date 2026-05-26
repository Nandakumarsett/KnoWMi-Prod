import React from 'react';

export class DashboardErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Dashboard Error:", error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red', fontFamily: 'monospace' }}>
          <h2>iOS Safari Crash Detected!</h2>
          <p>Please screenshot this and send it to the developer:</p>
          <hr />
          <p><strong>Error:</strong> {this.state.error?.toString()}</p>
          <pre style={{ fontSize: '10px', overflowX: 'auto' }}>
            {this.state.error?.stack}
          </pre>
          <pre style={{ fontSize: '10px', overflowX: 'auto' }}>
            {this.state.info?.componentStack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
