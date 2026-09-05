import { Component, type ReactNode } from 'react'

export default class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (!this.state.failed) return this.props.children
    const en = document.documentElement.lang === 'en'
    return <section className="st-page" role="alert"><h1>{en ? 'This page could not be displayed' : 'No se ha podido mostrar esta página'}</h1><p>{en ? 'Your saved work has not been deleted. Reload the page or return to Home.' : 'Tu trabajo guardado no se ha borrado. Recarga la página o vuelve a Inicio.'}</p><button className="st-btn" onClick={() => window.location.reload()}>{en ? 'Reload' : 'Recargar'}</button> <a className="st-btn-ghost" href="#/" onClick={() => this.setState({ failed: false })}>{en ? 'Home' : 'Inicio'}</a></section>
  }
}
