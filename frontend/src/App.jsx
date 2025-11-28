import { useState, useEffect, useRef } from 'react'
import './App.css'
import sadLogo from './assets/logos/sad.png'
import sadExtractorLogo from './assets/logos/sad-extractor.png'

const PAGES = {
  UPLOAD: 'upload',
  EDIT: 'edit',
  HISTORY_REPORTS: 'historyReports',
  HISTORY_USERS: 'historyUsers',
  INDICATORS: 'indicators',
  CONFIG: 'config',
}

const ROLE_ACCESS = {
  admin: [
    PAGES.UPLOAD,
    PAGES.EDIT,
    PAGES.HISTORY_REPORTS,
    PAGES.HISTORY_USERS,
    PAGES.INDICATORS,
    PAGES.CONFIG,
  ],
  gestor: [
    PAGES.UPLOAD,
    PAGES.EDIT,
    PAGES.HISTORY_REPORTS,
    PAGES.HISTORY_USERS,
    PAGES.INDICATORS,
  ],
  cadastro: [PAGES.UPLOAD, PAGES.EDIT, PAGES.HISTORY_REPORTS],
}

function deriveRoleFromEmail(email) {
  if (!email) return null
  if (email.includes('admin@sad')) return 'admin'
  if (email.includes('gestor@sad')) return 'gestor'
  if (email.includes('cadastro@sad')) return 'cadastro'
  return null
}

function LoginPage({ onLogin, initialDarkMode }) {
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

function AppHeader({ activePage, user, onNavigate, onLogout, onToggleSidebar, darkMode, onToggleDarkMode }) {
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

function UploadPage() {
  const [selectedFiles, setSelectedFiles] = useState([])
  const fileInputRef = useRef(null)

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files)
    setSelectedFiles(files)
    // TODO: Integrar com backend - enviar arquivos
    // uploadFiles(files)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const files = Array.from(event.dataTransfer.files)
    setSelectedFiles(files)
    // TODO: Integrar com backend - enviar arquivos
    // uploadFiles(files)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleUploadSubmit = () => {
    if (selectedFiles.length > 0) {
      // TODO: Integrar com backend - enviar arquivos
      // uploadFiles(selectedFiles)
      console.log('Arquivos selecionados:', selectedFiles)
    }
  }

  return (
    <main className="main-layout main-config">
      <section className="config-container">
        <header className="config-header">
          <h1>Upload dos documentos</h1>
          <p>
            Faça upload de arquivos PDF para extrair automaticamente os dados
            dos laudos desejados.
          </p>
        </header>

        <section className="config-card upload-card">
          <div className="steps-bar">
            <div className="step step-active">
              <span className="step-number">1</span>
              <span className="step-label">Upload</span>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <span className="step-label">Edição</span>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <span className="step-label">Exportação</span>
            </div>
          </div>

          <div
            className="upload-area"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <div className="upload-icon">⬆</div>
            <p>
              Arraste os arquivos aqui ou{' '}
              <button
                type="button"
                className="link-button upload-link"
                onClick={handleUploadClick}
              >
                clique para selecionar
              </button>
            </p>
            <span className="upload-subtitle">
              Formatos suportados: PDF, DOCx
            </span>
            {selectedFiles.length > 0 && (
              <div className="upload-files-list">
                <p>{selectedFiles.length} arquivo(s) selecionado(s)</p>
                <button
                  type="button"
                  className="primary-button"
                  onClick={handleUploadSubmit}
                >
                  Enviar Arquivos
                </button>
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  )
}

function EditDataPage() {
  const [selectedRows, setSelectedRows] = useState([])
  const [laudos, setLaudos] = useState([
    { id: 1, nome: 'Laudo_001.pdf', extraidos: 12, total: 30, confiabilidade: 40, acao: 'Revisar Campos' },
    { id: 2, nome: 'Laudo_002.pdf', extraidos: 30, total: 30, confiabilidade: 100, acao: 'Prosseguir' },
    { id: 3, nome: 'Laudo_003.pdf', extraidos: 21, total: 30, confiabilidade: 70, acao: 'Prosseguir' },
    { id: 4, nome: 'Laudo_004.pdf', extraidos: 3, total: 30, confiabilidade: 10, acao: 'Descartado', descartado: true },
  ])

  const handleSelectAll = () => {
    if (selectedRows.length === laudos.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(laudos.map((l) => l.id))
    }
  }

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    )
  }

  const handleDeleteAll = () => {
    // TODO: Integrar com backend - excluir laudos selecionados
    // deleteLaudos(selectedRows)
    setLaudos((prev) => prev.filter((l) => !selectedRows.includes(l.id)))
    setSelectedRows([])
  }

  const handleValidate = () => {
    // TODO: Integrar com backend - validar dados selecionados
    // validateData(selectedRows)
    console.log('Validar dados:', selectedRows)
  }

  const getConfidenceClass = (confiabilidade) => {
    if (confiabilidade >= 80) return 'confidence-high'
    if (confiabilidade >= 50) return 'confidence-medium'
    if (confiabilidade >= 20) return 'confidence-low'
    return 'confidence-very-low'
  }

  return (
    <main className="main-layout main-config">
      <section className="config-container">
        <header className="config-header">
          <h1>Edição dos dados extraídos</h1>
          <p>Revise o resumo dos dados extraídos a partir dos laudos.</p>
        </header>

        <section className="config-card upload-card">
          <div className="steps-bar">
            <div className="step">
              <span className="step-number">1</span>
              <span className="step-label">Upload</span>
            </div>
            <div className="step step-active">
              <span className="step-number">2</span>
              <span className="step-label">Edição</span>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <span className="step-label">Exportação</span>
            </div>
          </div>

          <div className="edit-table-controls">
            <button
              type="button"
              className="link-button"
              onClick={handleSelectAll}
            >
              Selecionar tudo
            </button>
            {selectedRows.length > 0 && (
              <button
                type="button"
                className="link-button delete-all-btn"
                onClick={handleDeleteAll}
              >
                Excluir tudo
              </button>
            )}
          </div>

          <div className="table-wrapper edit-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome do arquivo</th>
                  <th>Dados extraídos</th>
                  <th>%</th>
                  <th>Confiabilidade</th>
                  <th>Ação recomendada</th>
                </tr>
              </thead>
              <tbody>
                {laudos.map((laudo) => (
                  <tr
                    key={laudo.id}
                    className={laudo.descartado ? 'row-danger' : ''}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(laudo.id)}
                        onChange={() => handleSelectRow(laudo.id)}
                      />
                      {laudo.id}
                    </td>
                    <td>{laudo.nome}</td>
                    <td>
                      {laudo.extraidos}/{laudo.total}
                    </td>
                    <td>{laudo.confiabilidade}%</td>
                    <td>
                      <span
                        className={`confidence-bar ${getConfidenceClass(laudo.confiabilidade)}`}
                      />
                    </td>
                    <td>{laudo.acao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
      </div>

          <div className="edit-footer-actions">
            <span className="selected-count">
              {selectedRows.length} laudo(s) selecionado(s)
            </span>
            <button
              type="button"
              className="primary-button validate-button"
              onClick={handleValidate}
            >
              Validar Dados
        </button>
          </div>
        </section>
      </section>
    </main>
  )
}

function HistoryReportsPage() {
  const [filters, setFilters] = useState({
    numeroDocumento: '',
    endereco: '',
    coordenadas: '',
    dataExtracao: '',
  })
  const [selectedLaudos, setSelectedLaudos] = useState([])
  const [exportFormat, setExportFormat] = useState('')
  const [laudos, setLaudos] = useState([
    {
      id: 1,
      numero: 'LA 000 SAD/001',
      endereco: 'Rua das Flores, 123',
      coordenadaS: "0°00'00.0\"S",
      coordenadaW: "0°00'00.0\"W",
      estadoConservacao: 'Bom',
      valor: 'R$ 250.000,00',
      dataExtracao: '15/07/2025',
    },
    {
      id: 2,
      numero: 'LA 000 SAD/002',
      endereco: 'Av. Principal, 456',
      coordenadaS: "0°00'00.0\"S",
      coordenadaW: "0°00'00.0\"W",
      estadoConservacao: 'Regular',
      valor: 'R$ 180.000,00',
      dataExtracao: '16/07/2025',
    },
    {
      id: 3,
      numero: 'LA 000 SAD/003',
      endereco: 'Rua Central, 789',
      coordenadaS: "0°00'00.0\"S",
      coordenadaW: "0°00'00.0\"W",
      estadoConservacao: 'Bom',
      valor: 'R$ 320.000,00',
      dataExtracao: '17/07/2025',
    },
    {
      id: 4,
      numero: 'LA 000 SAD/004',
      endereco: 'Praça da República, 321',
      coordenadaS: "0°00'00.0\"S",
      coordenadaW: "0°00'00.0\"W",
      estadoConservacao: 'Ruim',
      valor: 'R$ 150.000,00',
      dataExtracao: '18/07/2025',
    },
  ])

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleSearch = () => {
    // TODO: Integrar com backend - buscar laudos com filtros
    // searchLaudos(filters)
    console.log('Buscar laudos com filtros:', filters)
  }

  const handleSelectAll = () => {
    if (selectedLaudos.length === laudos.length) {
      setSelectedLaudos([])
    } else {
      setSelectedLaudos(laudos.map((l) => l.id))
    }
  }

  const handleSelectLaudo = (id) => {
    setSelectedLaudos((prev) =>
      prev.includes(id) ? prev.filter((laudoId) => laudoId !== id) : [...prev, id]
    )
  }

  const handleDeleteAll = () => {
    // TODO: Integrar com backend - excluir laudos selecionados
    // deleteLaudos(selectedLaudos)
    setLaudos((prev) => prev.filter((l) => !selectedLaudos.includes(l.id)))
    setSelectedLaudos([])
  }

  const handleExport = () => {
    if (selectedLaudos.length === 0 || !exportFormat) {
      alert('Selecione pelo menos um laudo e um formato de exportação')
      return
    }
    // TODO: Integrar com backend - exportar laudos
    // exportLaudos(selectedLaudos, exportFormat)
    console.log('Exportar laudos:', selectedLaudos, exportFormat)
  }

  const getStatusColor = (estado) => {
    if (estado === 'Bom') return 'status-good'
    if (estado === 'Regular') return 'status-medium'
    return 'status-low'
  }

  return (
    <main className="main-layout main-config">
      <section className="config-container">
        <header className="config-header">
          <h1>Histórico de Laudos</h1>
          <p>
            Visualização dos dados de todos os laudos que foram extraídos ao
            longo do tempo.
          </p>
        </header>

        <section className="config-card filters-card">
          <div className="filters-grid">
            <div className="form-group">
              <label>Nº do documento</label>
              <input
                className="field-input rectangular"
                placeholder="Pesquisar"
                value={filters.numeroDocumento}
                onChange={(e) => handleFilterChange('numeroDocumento', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Endereço</label>
              <input
                className="field-input rectangular"
                placeholder="Pesquisar"
                value={filters.endereco}
                onChange={(e) => handleFilterChange('endereco', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Coordenadas</label>
              <input
                className="field-input rectangular"
                placeholder="Pesquisar"
                value={filters.coordenadas}
                onChange={(e) => handleFilterChange('coordenadas', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Data da Extração</label>
              <input
                type="date"
                className="field-input rectangular"
                value={filters.dataExtracao}
                onChange={(e) => handleFilterChange('dataExtracao', e.target.value)}
              />
      </div>
            <div className="form-group form-group-button">
              <button
                type="button"
                className="primary-button"
                onClick={handleSearch}
              >
                Pesquisar
        </button>
            </div>
          </div>
        </section>

        <section className="config-card table-card">
          <header className="table-header">
            <h2>Visualização dos dados que foram extraídos</h2>
          </header>
          <div className="history-table-controls">
            <button
              type="button"
              className="link-button"
              onClick={handleSelectAll}
            >
              Selecionar tudo
            </button>
            {selectedLaudos.length > 0 && (
              <button
                type="button"
                className="link-button delete-all-btn"
                onClick={handleDeleteAll}
              >
                Excluir tudo
              </button>
            )}
          </div>

          <div className="table-wrapper no-scroll">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Nº do documento</th>
                  <th>Endereço</th>
                  <th>Coordenada geográfica (S)</th>
                  <th>Coordenada geográfica (W)</th>
                  <th>Estado de Conservação</th>
                  <th>Valor do Imóvel</th>
                  <th>Data da Extração</th>
                </tr>
              </thead>
              <tbody>
                {laudos.map((laudo) => (
                  <tr key={laudo.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedLaudos.includes(laudo.id)}
                        onChange={() => handleSelectLaudo(laudo.id)}
                      />
                      <span className="laudo-link">{laudo.numero} 👁</span>
                    </td>
                    <td>{laudo.endereco}</td>
                    <td>{laudo.coordenadaS}</td>
                    <td>{laudo.coordenadaW}</td>
                    <td>
                      <span className={`status-pill ${getStatusColor(laudo.estadoConservacao)}`} />
                    </td>
                    <td>{laudo.valor}</td>
                    <td>{laudo.dataExtracao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="history-footer">
            <div className="history-footer-left">
              <span>{selectedLaudos.length} laudo(s) selecionado(s)</span>
      </div>
            <div className="history-footer-right">
              <span>Opções para exportação dos laudos:</span>
              <select
                className="field-input rectangular history-select"
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
              >
                <option value="">Selecionar formato</option>
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
              <button
                type="button"
                className="primary-button"
                onClick={handleExport}
              >
                Baixar laudos
        </button>
            </div>
          </div>
        </section>
      </section>
    </main>
  )
}

function HistoryUsersPage() {
  const [userLogs] = useState([
    {
      id: 1,
      usuario: 'User_01',
      acao: 'Editou laudo',
      nomeLaudo: 'LA 000 SAD/001',
      dataModificacao: '18/07/2025',
    },
    {
      id: 2,
      usuario: 'User_02',
      acao: 'Extraiu novo laudo',
      nomeLaudo: 'LA 000 SAD/002',
      dataModificacao: '17/07/2025',
    },
    {
      id: 3,
      usuario: 'User_03',
      acao: 'Excluiu laudo',
      nomeLaudo: 'LA 000 SAD/003',
      dataModificacao: '18/07/2025',
    },
    {
      id: 4,
      usuario: 'User_02',
      acao: 'Editou laudo',
      nomeLaudo: 'LA 000 SAD/004',
      dataModificacao: '17/07/2025',
    },
  ])

  // TODO: Integrar com backend - buscar logs de usuários
  // useEffect(() => {
  //   fetchUserLogs().then(setUserLogs)
  // }, [])

  return (
    <main className="main-layout main-config">
      <section className="config-container">
        <header className="config-header">
          <h1>Histórico dos usuários</h1>
          <p>Log das ações dos usuários ativos.</p>
        </header>

        <section className="config-card table-card">
          <header className="table-header">
            <h2>Tabela padrão</h2>
          </header>
          <div className="table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Usuário</th>
                  <th>Ação</th>
                  <th>Nome do laudo</th>
                  <th>Data da modificação</th>
                </tr>
              </thead>
              <tbody>
                {userLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.usuario}</td>
                    <td>{log.acao}</td>
                    <td>{log.nomeLaudo}</td>
                    <td>{log.dataModificacao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  )
}

function IndicatorsPage() {
  const [chartType, setChartType] = useState('vendas')
  const [timeFilter, setTimeFilter] = useState('ano')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Dados mockados para os KPIs
  const kpiData = {
    totalLaudos: { value: 1247, change: '+12%', period: 'Este mês' },
    laudosExtraidos: { value: 892, change: '+8%', period: 'Esta semana' },
    taxaSucesso: { value: '94.5%', change: '+2.3%', period: 'Taxa de sucesso' },
    tempoMedio: { value: '3.2h', change: '-0.5h', period: 'Tempo médio' },
  }

  // Dados mockados para o gráfico
  const chartData = {
    vendas: [120, 150, 180, 200, 175, 190, 210, 195, 220, 205, 230, 250],
    visitas: [80, 95, 110, 125, 115, 130, 140, 135, 145, 150, 160, 170],
  }

  const handleChartTypeChange = (type) => {
    setChartType(type)
    // TODO: Integrar com backend - buscar dados do gráfico
    // fetchChartData(type, timeFilter, startDate, endDate)
  }

  const handleTimeFilterChange = (filter) => {
    setTimeFilter(filter)
    setStartDate('')
    setEndDate('')
    // TODO: Integrar com backend - aplicar filtro de tempo
    // fetchChartData(chartType, filter, startDate, endDate)
  }

  const handleDateRangeChange = () => {
    if (startDate && endDate) {
      setTimeFilter('custom')
      // TODO: Integrar com backend - buscar dados por período customizado
      // fetchChartData(chartType, 'custom', startDate, endDate)
    }
  }

  return (
    <main className="main-layout main-config">
      <section className="config-container">
        <header className="config-header">
          <h1>Painel de Indicadores</h1>
          <p>
            Principais métricas e acompanhamentos sobre os dados extraídos dos
            laudos.
          </p>
        </header>

        <section className="config-card indicators-grid">
          <div className="indicator-card">
            <div className="indicator-header">
              <h3>Total de Laudos</h3>
              <span className="indicator-info">ℹ</span>
            </div>
            <p className="indicator-value">{kpiData.totalLaudos.value.toLocaleString('pt-BR')}</p>
            <p className="indicator-sub">
              <span className="indicator-change positive">{kpiData.totalLaudos.change}</span>
              {' '}
              {kpiData.totalLaudos.period}
            </p>
          </div>
          <div className="indicator-card">
            <div className="indicator-header">
              <h3>Laudos Extraídos</h3>
              <span className="indicator-info">ℹ</span>
            </div>
            <p className="indicator-value">{kpiData.laudosExtraidos.value.toLocaleString('pt-BR')}</p>
            <p className="indicator-sub">
              <span className="indicator-change positive">{kpiData.laudosExtraidos.change}</span>
              {' '}
              {kpiData.laudosExtraidos.period}
            </p>
          </div>
          <div className="indicator-card">
            <div className="indicator-header">
              <h3>Taxa de Sucesso</h3>
              <span className="indicator-info">ℹ</span>
            </div>
            <p className="indicator-value">{kpiData.taxaSucesso.value}</p>
            <p className="indicator-sub">
              <span className="indicator-change positive">{kpiData.taxaSucesso.change}</span>
              {' '}
              {kpiData.taxaSucesso.period}
        </p>
      </div>
          <div className="indicator-card">
            <div className="indicator-header">
              <h3>Tempo Médio</h3>
              <span className="indicator-info">ℹ</span>
            </div>
            <p className="indicator-value">{kpiData.tempoMedio.value}</p>
            <p className="indicator-sub">
              <span className="indicator-change negative">{kpiData.tempoMedio.change}</span>
              {' '}
              {kpiData.tempoMedio.period}
            </p>
          </div>
        </section>

        <section className="config-card indicators-chart-card">
          <div className="chart-header">
            <div className="chart-tabs">
              <button
                type="button"
                className={`chart-tab ${chartType === 'vendas' ? 'chart-tab-active' : ''}`}
                onClick={() => handleChartTypeChange('vendas')}
              >
                Vendas
              </button>
              <button
                type="button"
                className={`chart-tab ${chartType === 'visitas' ? 'chart-tab-active' : ''}`}
                onClick={() => handleChartTypeChange('visitas')}
              >
                Visitas
              </button>
            </div>
            <div className="chart-filters">
              <button
                type="button"
                className={`time-filter-btn ${timeFilter === 'dia' ? 'active' : ''}`}
                onClick={() => handleTimeFilterChange('dia')}
              >
                Dia
              </button>
              <button
                type="button"
                className={`time-filter-btn ${timeFilter === 'semana' ? 'active' : ''}`}
                onClick={() => handleTimeFilterChange('semana')}
              >
                Semana
              </button>
              <button
                type="button"
                className={`time-filter-btn ${timeFilter === 'mes' ? 'active' : ''}`}
                onClick={() => handleTimeFilterChange('mes')}
              >
                Mês
              </button>
              <button
                type="button"
                className={`time-filter-btn ${timeFilter === 'ano' ? 'active' : ''}`}
                onClick={() => handleTimeFilterChange('ano')}
              >
                Ano
              </button>
              <div className="date-range-picker">
                <input
                  type="date"
                  className="date-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="Data inicial"
                />
                <span className="date-separator">até</span>
                <input
                  type="date"
                  className="date-input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="Data final"
                />
                {(startDate || endDate) && (
                  <button
                    type="button"
                    className="apply-date-btn"
                    onClick={handleDateRangeChange}
                  >
                    Aplicar
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="chart-container">
            <div className="chart-title">Tendência de Vendas das Lojas</div>
            <div className="chart-bars">
              {chartData[chartType === 'vendas' ? 'vendas' : 'visitas'].map((value, index) => (
                <div key={index} className="chart-bar-wrapper">
                  <div
                    className="chart-bar"
                    style={{ height: `${(value / 300) * 100}%` }}
                    title={`${value}`}
                  />
                  <span className="chart-bar-label">{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  )
}

function ConfigPage() {
  const [newUser, setNewUser] = useState({
    nome: '',
    email: '',
    funcao: '',
  })
  const [users, setUsers] = useState([
    {
      id: 4,
      nome: 'Nome e sobrenome',
      email: 'email4@sad.pe.gov.br',
      tipo: 'Cadastro',
      ultimoAcesso: '10/07/2025',
      totalAcessos: 5,
    },
    {
      id: 3,
      nome: 'Nome e sobrenome',
      email: 'email3@sad.pe.gov.br',
      tipo: 'Gestão',
      ultimoAcesso: '17/07/2025',
      totalAcessos: 10,
    },
    {
      id: 2,
      nome: 'Nome e sobrenome',
      email: 'email2@sad.pe.gov.br',
      tipo: 'Cadastro',
      ultimoAcesso: '15/07/2025',
      totalAcessos: 2,
    },
    {
      id: 1,
      nome: 'Nome e sobrenome',
      email: 'email1@sad.pe.gov.br',
      tipo: 'Cadastro',
      ultimoAcesso: '18/07/2025',
      totalAcessos: 10,
    },
  ])

  const handleNewUserChange = (field, value) => {
    setNewUser((prev) => ({ ...prev, [field]: value }))
  }

  const handleCreateUser = () => {
    if (!newUser.nome || !newUser.email || !newUser.funcao) {
      alert('Preencha todos os campos')
      return
    }
    // TODO: Integrar com backend - criar novo usuário
    // createUser(newUser).then((user) => {
    //   setUsers([...users, user])
    //   setNewUser({ nome: '', email: '', funcao: '' })
    // })
    const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1
    setUsers([
      {
        id: newId,
        nome: newUser.nome,
        email: newUser.email,
        tipo: newUser.funcao,
        ultimoAcesso: new Date().toLocaleDateString('pt-BR'),
        totalAcessos: 0,
      },
      ...users,
    ])
    setNewUser({ nome: '', email: '', funcao: '' })
  }

  const handleInativar = (id) => {
    // TODO: Integrar com backend - inativar usuário
    // inativarUser(id)
    console.log('Inativar usuário:', id)
  }

  const handleEditar = (id) => {
    // TODO: Integrar com backend - editar usuário
    // editarUser(id)
    console.log('Editar usuário:', id)
  }

  const handleReenviarEmail = (id) => {
    // TODO: Integrar com backend - reenviar email
    // reenviarEmail(id)
    console.log('Reenviar email para usuário:', id)
  }

  return (
    <main className="main-layout main-config">
      <section className="config-container">
        <header className="config-header">
          <h1>Configurações dos usuários</h1>
          <p>Configurações e cadastros dos usuários no sistema</p>
        </header>

        <section className="config-card">
          <h2>Novo usuário</h2>
          <div className="new-user-grid">
            <div className="form-group">
              <label>Nome</label>
              <input
                className="field-input rectangular"
                placeholder="User_001"
                value={newUser.nome}
                onChange={(e) => handleNewUserChange('nome', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                className="field-input rectangular"
                placeholder="user_001@sad.pe.gov.br"
                type="email"
                value={newUser.email}
                onChange={(e) => handleNewUserChange('email', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Função</label>
              <select
                className="field-input rectangular"
                value={newUser.funcao}
                onChange={(e) => handleNewUserChange('funcao', e.target.value)}
              >
                <option value="">Selecione o cargo</option>
                <option value="Cadastro">Cadastro</option>
                <option value="Gestão">Gestão</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="form-group form-group-button">
              <button
                type="button"
                className="primary-button"
                onClick={handleCreateUser}
              >
                Criar
              </button>
            </div>
          </div>
        </section>

          <section className="config-card table-card">
            <header className="table-header">
              <h2>Tabela padrão</h2>
            </header>
            <div className="table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Tipo</th>
                    <th>Último acesso</th>
                    <th>Total de acessos</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id.toString().padStart(2, '0')}</td>
                      <td>{user.nome}</td>
                      <td>{user.email}</td>
                      <td>{user.tipo}</td>
                      <td>{user.ultimoAcesso}</td>
                      <td>{user.totalAcessos.toString().padStart(2, '0')}</td>
                      <td className="actions-cell">
                        <button
                          type="button"
                          className="tag-button tag-danger"
                          onClick={() => handleInativar(user.id)}
                        >
                          Inativar
                        </button>
                        <button
                          type="button"
                          className="tag-button tag-primary"
                          onClick={() => handleEditar(user.id)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="tag-button tag-secondary"
                          onClick={() => handleReenviarEmail(user.id)}
                        >
                          Reenviar E-mail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </section>
    </main>
  )
}

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [activePage, setActivePage] = useState(PAGES.UPLOAD)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true
    }
    return false
  })

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

  if (activePage === PAGES.UPLOAD) pageContent = <UploadPage />
  else if (activePage === PAGES.EDIT) pageContent = <EditDataPage />
  else if (activePage === PAGES.HISTORY_REPORTS)
    pageContent = <HistoryReportsPage />
  else if (activePage === PAGES.HISTORY_USERS)
    pageContent = <HistoryUsersPage />
  else if (activePage === PAGES.INDICATORS)
    pageContent = <IndicatorsPage />
  else if (activePage === PAGES.CONFIG) pageContent = <ConfigPage />

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
        <>
          <div
            className={
              'sidebar-backdrop ' + (isSidebarOpen ? 'sidebar-backdrop-open' : '')
            }
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside
            className={'sidebar ' + (isSidebarOpen ? 'sidebar-open' : '')}
          >
            <div className="sidebar-header">
              <span className="sidebar-title">Menu</span>
            </div>
            <nav className="sidebar-nav">
              {ROLE_ACCESS[currentUser.role].includes(PAGES.UPLOAD) && (
                <button
                  type="button"
                  className={
                    'sidebar-link ' +
                    (activePage === PAGES.UPLOAD ? 'sidebar-link-active' : '')
                  }
                  onClick={() => {
                    setActivePage(PAGES.UPLOAD)
                    setIsSidebarOpen(false)
                  }}
                >
                  Upload de documentos
                </button>
              )}
              {ROLE_ACCESS[currentUser.role].includes(PAGES.EDIT) && (
                <button
                  type="button"
                  className={
                    'sidebar-link ' +
                    (activePage === PAGES.EDIT ? 'sidebar-link-active' : '')
                  }
                  onClick={() => {
                    setActivePage(PAGES.EDIT)
                    setIsSidebarOpen(false)
                  }}
                >
                  Editar dados
                </button>
              )}
              {ROLE_ACCESS[currentUser.role].includes(PAGES.HISTORY_REPORTS) && (
                <button
                  type="button"
                  className={
                    'sidebar-link ' +
                    (activePage === PAGES.HISTORY_REPORTS
                      ? 'sidebar-link-active'
                      : '')
                  }
                  onClick={() => {
                    setActivePage(PAGES.HISTORY_REPORTS)
                    setIsSidebarOpen(false)
                  }}
                >
                  Histórico de Laudos
                </button>
              )}
              {ROLE_ACCESS[currentUser.role].includes(PAGES.HISTORY_USERS) && (
                <button
                  type="button"
                  className={
                    'sidebar-link ' +
                    (activePage === PAGES.HISTORY_USERS
                      ? 'sidebar-link-active'
                      : '')
                  }
                  onClick={() => {
                    setActivePage(PAGES.HISTORY_USERS)
                    setIsSidebarOpen(false)
                  }}
                >
                  Histórico De Usuários
                </button>
              )}
              {ROLE_ACCESS[currentUser.role].includes(PAGES.INDICATORS) && (
                <button
                  type="button"
                  className={
                    'sidebar-link ' +
                    (activePage === PAGES.INDICATORS
                      ? 'sidebar-link-active'
                      : '')
                  }
                  onClick={() => {
                    setActivePage(PAGES.INDICATORS)
                    setIsSidebarOpen(false)
                  }}
                >
                  Indicadores
                </button>
              )}
              {ROLE_ACCESS[currentUser.role].includes(PAGES.CONFIG) && (
                <button
                  type="button"
                  className={
                    'sidebar-link ' +
                    (activePage === PAGES.CONFIG ? 'sidebar-link-active' : '')
                  }
                  onClick={() => {
                    setActivePage(PAGES.CONFIG)
                    setIsSidebarOpen(false)
                  }}
                >
                  Configurações
                </button>
              )}
            </nav>
          </aside>
        </>
      )}

      {pageContent}
      <footer className="footer-bar">
        <span>
          ©Todos os direitos reservados à Secretaria de Administração de Pernambuco - 2025
        </span>
      </footer>
    </div>
  )
}

export default App
