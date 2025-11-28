import { useState } from 'react'
import './App.css'
import { PAGES, ROLE_ACCESS } from './constants/pages'
import LoginPage from './components/common/LoginPage'
import AppHeader from './components/common/AppHeader'
import Sidebar from './components/common/Sidebar'
import Footer from './components/common/Footer'
import UploadPage from './pages/UploadPage'
// TODO: Importar as outras páginas quando criadas
// import EditDataPage from './pages/EditDataPage'
// import ExportPage from './pages/ExportPage'
// import HistoryReportsPage from './pages/HistoryReportsPage'
// import HistoryUsersPage from './pages/HistoryUsersPage'
// import IndicatorsPage from './pages/IndicatorsPage'
// import ConfigPage from './pages/ConfigPage'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [activePage, setActivePage] = useState(PAGES.UPLOAD)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [laudos, setLaudos] = useState([])
  const [laudosValidados, setLaudosValidados] = useState([])
  const [darkMode, setDarkMode] = useState(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true
    }
    return false
  })
  
  const handleAddLaudos = (novosLaudos) => {
    setLaudos((prev) => [...prev, ...novosLaudos])
  }
  
  const handleNavigate = (page, data = null) => {
    if (page === PAGES.EXPORT && data) {
      setLaudosValidados(data)
    }
    setActivePage(page)
  }

  const handleLogin = (user) => {
    setCurrentUser(user)
    setActivePage(PAGES.UPLOAD)
    setIsSidebarOpen(false)
    if (user.darkMode !== undefined) {
      setDarkMode(user.darkMode)
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setIsSidebarOpen(false)
    // Resetar para o tema do dispositivo ao deslogar
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true)
    } else {
      setDarkMode(false)
    }
  }

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => !prev)
  }

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} initialDarkMode={darkMode} />
  }

  let pageContent = null

  if (activePage === PAGES.UPLOAD) {
    pageContent = <UploadPage onNavigate={setActivePage} onAddLaudos={handleAddLaudos} />
  }
  // TODO: Descomentar quando as páginas forem criadas
  // else if (activePage === PAGES.EDIT) {
  //   pageContent = <EditDataPage onNavigate={handleNavigate} laudos={laudos} setLaudos={setLaudos} />
  // }
  // else if (activePage === PAGES.EXPORT) {
  //   pageContent = <ExportPage laudosValidados={laudosValidados} />
  // }
  // else if (activePage === PAGES.HISTORY_REPORTS) {
  //   pageContent = <HistoryReportsPage />
  // }
  // else if (activePage === PAGES.HISTORY_USERS) {
  //   pageContent = <HistoryUsersPage />
  // }
  // else if (activePage === PAGES.INDICATORS) {
  //   pageContent = <IndicatorsPage />
  // }
  // else if (activePage === PAGES.CONFIG) {
  //   pageContent = <ConfigPage />
  // }

  return (
    <div className={`app-root ${darkMode ? 'dark-mode' : ''}`}>
      <AppHeader
        activePage={activePage}
        user={currentUser}
        onLogout={handleLogout}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onNavigate={(page) => {
          if (ROLE_ACCESS[currentUser.role].includes(page)) {
            setActivePage(page)
          }
        }}
      />

      {currentUser && (
        <Sidebar
          currentUser={currentUser}
          activePage={activePage}
          onNavigate={(page) => {
            if (ROLE_ACCESS[currentUser.role].includes(page)) {
              setActivePage(page)
            }
          }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}

      {pageContent}
      <Footer />
    </div>
  )
}

export default App

