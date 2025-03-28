import React, { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Ошибка в компоненте:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Что-то пошло не так. Пожалуйста, попробуйте позже.</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;