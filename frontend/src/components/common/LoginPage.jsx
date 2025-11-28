import { useState } from 'react'
import sadLogo from '../../assets/logos/sad.png'
import sadExtractorLogo from '../../assets/logos/sad-extractor.png'
import { deriveRoleFromEmail } from '../../utils/roleUtils'

export default function LoginPage({ onLogin, initialDarkMode }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    // TODO: Integrar com backend - validar credenciais
    // const response = await login(email, password)
    
    // Validação mockada para testes
    if (password !== 'password') {
      alert('Senha incorreta. Use "password" para todos os emails de teste.')
      return
    }

    const role = deriveRoleFromEmail(email)
    if (!role) {
      alert('Email inválido. Use: admin@sad, gestor@sad ou cadastro@sad')
      return
    }

    onLogin({ role, email, darkMode: initialDarkMode })
  }

  return (
    <div className={`app-root ${initialDarkMode ? 'dark-mode' : ''}`}>
      <header className="top-bar">
        <div className="top-bar-left">
          <div className="brand">
            <img
              src={sadExtractorLogo}
              alt="SAD Extractor"
              className="brand-icon"
            />
            <div className="brand-text">
              <span className="brand-title">SAD Extractor</span>
            <span className="brand-subtitle">
              Sistema de Extração de Dados Imobiliários
            </span>
            </div>
          </div>
        </div>
        <div className="top-bar-right">
          <img
            src={sadLogo}
            alt="SAD"
            className="sad-logo"
          />
        </div>
      </header>

      <main className="main-layout login-only">
        <section className="login-section">
          <div className="login-card">
            <h1 className="login-title">Extractor - Acesso</h1>
            <div className="login-divider" />

            <form className="login-form" onSubmit={handleSubmit}>
              <label className="field-label" htmlFor="email">
                E-mail
              </label>
              <div className="field-wrapper">
                <input
                  id="email"
                  type="email"
                  className="field-input"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              <label className="field-label" htmlFor="password">
                Senha
              </label>
              <div className="field-wrapper">
                <input
                  id="password"
                  type="password"
                  className="field-input"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              <button type="submit" className="primary-button">
                Entrar
              </button>

              <p className="forgot-text">
                Esqueceu a senha?{' '}
                <button type="button" className="link-button">
                  Clique aqui
                </button>
              </p>
            </form>

            <div className="login-test-info">
              <p className="test-info-title">Dados para teste:</p>
              <p className="test-info-item">admin@sad - password</p>
              <p className="test-info-item">gestor@sad - password</p>
              <p className="test-info-item">cadastro@sad - password</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer-bar">
        <span>
          ©Todos os direitos reservados à Secretaria de Administração de Pernambuco - 2025
        </span>
      </footer>
    </div>
  )
}

