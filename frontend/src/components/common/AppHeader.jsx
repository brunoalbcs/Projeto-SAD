import { useState, useEffect, useRef } from 'react'
import sadLogo from '../../assets/logos/sad.png'
import sadExtractorLogo from '../../assets/logos/sad-extractor.png'

export default function AppHeader({ activePage, user, onNavigate, onLogout, onToggleSidebar, darkMode, onToggleDarkMode }) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const toggleRef = useRef(null)

  const handleAvatarClick = () => {
    setIsUserMenuOpen((prev) => !prev)
  }

  const handleLogoutClick = () => {
    setIsUserMenuOpen(false)
    onLogout()
  }

  const handleToggleDarkMode = () => {
    onToggleDarkMode()
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isUserMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false)
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen])

  return (
    <header className="top-bar">
      <div className="top-bar-left">
        {user && (
          <button
            type="button"
            className="menu-toggle"
            onClick={onToggleSidebar}
          >
            <span />
            <span />
            <span />
          </button>
        )}
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
        {user && (
          <div className="user-info">
            <span className="user-greeting">
              Olá, <strong>{user.email}</strong>
            </span>
            <div className="user-avatar-wrapper">
              <button
                ref={toggleRef}
                type="button"
                className="user-avatar"
                onClick={handleAvatarClick}
              >
                TT
                <span className="avatar-chevron">▼</span>
              </button>
              {isUserMenuOpen && (
                <div ref={menuRef} className="user-menu">
                  <div className="user-menu-item dark-mode-toggle-item">
                    <span className="dark-mode-label">Modo Escuro</span>
                    <button
                      type="button"
                      className={`dark-mode-toggle ${darkMode ? 'dark-mode-toggle-on' : 'dark-mode-toggle-off'}`}
                      onClick={handleToggleDarkMode}
                      aria-label="Toggle dark mode"
                    >
                      <span className="dark-mode-toggle-thumb" />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="user-menu-item"
                    onClick={handleLogoutClick}
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

