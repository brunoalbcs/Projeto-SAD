import { useState, useEffect, useRef } from 'react'
import './App.css'
import sadLogo from './assets/logos/sad.png'
import sadExtractorLogo from './assets/logos/sad-extractor.png'

const PAGES = {
  UPLOAD: 'upload',
  EDIT: 'edit',
  EXPORT: 'export',
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

function UploadPage({ onNavigate, onAddLaudos }) {
  const [selectedFiles, setSelectedFiles] = useState([])
  const fileInputRef = useRef(null)

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files)
    setSelectedFiles((prev) => [...prev, ...files])
    // TODO: Integrar com backend - enviar arquivos
    // uploadFiles(files)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const files = Array.from(event.dataTransfer.files)
    setSelectedFiles((prev) => [...prev, ...files])
    // TODO: Integrar com backend - enviar arquivos
    // uploadFiles(files)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUploadSubmit = () => {
    if (selectedFiles.length > 0) {
      // TODO: Integrar com backend - enviar arquivos
      // uploadFiles(selectedFiles)
      // Processar arquivos e criar laudos
      const novosLaudos = selectedFiles.map((file, index) => {
        // Criar uma URL local para visualizar o PDF posteriormente
        const fileUrl = URL.createObjectURL(file)
        // Gerar dados mockados para cada arquivo
        // Em produção, isso viria do backend após processar o arquivo
        const total = Math.floor(Math.random() * 20) + 20 // 20-40 campos
        const extraidos = Math.floor(Math.random() * total) + 1
        const confiabilidade = Math.floor((extraidos / total) * 100)
        
        let acao = 'Prosseguir'
        let descartado = false
        
        if (confiabilidade < 20) {
          acao = 'Descartado'
          descartado = true
        } else if (confiabilidade < 50) {
          acao = 'Revisar Campos'
        }
        
        return {
          id: Date.now() + index, // ID único baseado em timestamp
          nome: file.name,
          numero: `LA 000 SAD/${String(Date.now() + index).slice(-3).padStart(3, '0')}`,
          fileUrl,
          extraidos: extraidos,
          total: total,
          confiabilidade: confiabilidade,
          acao: acao,
          descartado: descartado,
          // Dados de localização
          endereco: 'Rua das Flores',
          numeroEndereco: '123',
          complemento: null,
          bairro: 'Centro',
          cep: '50000-000',
          pais: 'Brasil',
          estado: 'Pernambuco',
          cidade: null,
          regiao: 'Nordeste',
          confrontanteFrente: null,
          confrontanteFundo: null,
          confrontanteDireita: null,
          confrontanteEsquerda: 'Rua Principal',
          pontoReferencia: 'Próximo ao mercado',
          observacaoLocalizacao: 'Imóvel em bom estado',
          coordenadaS: null,
          coordenadaW: "8°03'14.0\"W",
          // Características do imóvel
          areaTerreno: '500 m²',
          areaConstruida: null,
          unidadeMedida: 'metros quadrados',
          estadoConservacao: 'Bom estado de conservação',
          limitacaoAdministrativa: null,
          // Dados financeiros
          criterioValoracao: 'Valor de mercado',
          dataValoracao: null,
          numeroDocumento: null,
          valorConstrucaoNova: 'R$ 200.000,00',
          valorAreaConstruida: 'R$ 150.000',
          valorTerreno: 'R$ 100.000',
          valorTotal: 'R$ 450.000',
          observacaoFinanceira: 'Valor atualizado em 2025',
        }
      })
      
      // Adicionar os novos laudos ao estado compartilhado
      if (onAddLaudos) {
        onAddLaudos(novosLaudos)
      }
      
      console.log('Arquivos selecionados:', selectedFiles)
      console.log('Laudos criados:', novosLaudos)
      
      // Limpar arquivos selecionados
      setSelectedFiles([])
      
      // Navegar para a página de edição
      if (onNavigate) {
        onNavigate(PAGES.EDIT)
      }
    }
  }

  return (
    <main className="main-layout main-config">
      <section className="config-container">
        <header className="config-header">
          <h1>Upload dos documentos</h1>
          <p>
            Faça Upload de arquivos PDF para extrair automaticamente os dados dos laudos desejados.
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
          </div>

          {selectedFiles.length > 0 && (
            <div className="uploaded-files-section">
              <h3 className="uploaded-files-title">Nomes dos arquivos</h3>
              <div className="uploaded-files-list">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="uploaded-file-item">
                    <div className="uploaded-file-checkmark">✓</div>
                    <span className="uploaded-file-name">{file.name}</span>
                    <button
                      type="button"
                      className="uploaded-file-clear"
                      onClick={() => handleRemoveFile(index)}
                    >
                      Limpar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedFiles.length > 0 && (
            <div className="upload-submit-container">
              <button
                type="button"
                className="primary-button upload-submit-button"
                onClick={handleUploadSubmit}
              >
                Carregar Dados
              </button>
            </div>
          )}
        </section>
      </section>
    </main>
  )
}

function EditDataPage({ onNavigate, laudos, setLaudos, onAddToHistory }) {
  const [selectedRows, setSelectedRows] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(4)
  const [showValidateModal, setShowValidateModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedLaudoDetails, setSelectedLaudoDetails] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editedData, setEditedData] = useState(null)
  
  // Usar laudos passados como prop, ou array vazio se não houver
  const laudosList = laudos || []

  const totalPages = Math.ceil(laudosList.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentLaudos = laudosList.slice(startIndex, endIndex)

  const handleSelectAll = () => {
    if (selectedRows.length === laudosList.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(laudosList.map((l) => l.id))
    }
  }

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    )
  }

  const handleDeleteAll = () => {
    if (setLaudos) {
      setLaudos((prev) => prev.filter((l) => !selectedRows.includes(l.id)))
    }
    setSelectedRows([])
  }

  const handleDeleteRow = (id) => {
    if (setLaudos) {
      setLaudos((prev) => prev.filter((l) => l.id !== id))
    }
    setSelectedRows((prev) => prev.filter((rowId) => rowId !== id))
  }

  const handleValidate = () => {
    if (selectedRows.length === 0) {
      alert('Selecione pelo menos um laudo para validar')
      return
    }
    
    // Mostrar modal de confirmação
    setShowValidateModal(true)
  }
  
  const confirmValidate = () => {
    // Filtrar apenas os laudos selecionados
    const laudosSelecionados = laudosList.filter((laudo) => selectedRows.includes(laudo.id))
    
    // Adicionar os laudos validados ao histórico
    if (onAddToHistory) {
      onAddToHistory(laudosSelecionados)
    }
    
    // Passar os laudos selecionados para a página de exportação
    if (onNavigate) {
      onNavigate(PAGES.EXPORT, laudosSelecionados)
    }
    
    // Fechar modal
    setShowValidateModal(false)
  }

  const getConfidenceClass = (confiabilidade) => {
    if (confiabilidade >= 80) return 'confidence-high'
    if (confiabilidade >= 50) return 'confidence-medium'
    if (confiabilidade >= 20) return 'confidence-low'
    return 'confidence-very-low'
  }

  const getActionClass = (acao) => {
    if (acao === 'Prosseguir') return 'action-prosseguir'
    if (acao === 'Revisar Campos') return 'action-revisar'
    if (acao === 'Descartado') return 'action-descartado'
    return ''
  }

  const handleOpenDetails = (laudo) => {
    setSelectedLaudoDetails(laudo)
    setEditedData({ ...laudo })
    setIsEditMode(false)
    setShowDetailsModal(true)
  }

  const handleCloseDetails = () => {
    setShowDetailsModal(false)
    setSelectedLaudoDetails(null)
    setIsEditMode(false)
    setEditedData(null)
  }

  const handleEditData = () => {
    setIsEditMode(true)
  }

  const handleFieldChange = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveData = () => {
    if (editedData && selectedLaudoDetails && setLaudos) {
      // Update the laudo in the laudos list
      setLaudos((prev) =>
        prev.map((l) => (l.id === selectedLaudoDetails.id ? { ...editedData } : l))
      )
      // Update the selected laudo details to show the new data
      setSelectedLaudoDetails({ ...editedData })
      // Exit edit mode
      setIsEditMode(false)
    }
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
            <div className="step step-completed">
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

          <div className="table-card-header">
            <h2 className="table-header-title">Tabela padrão</h2>
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
            <table className="users-table edit-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedRows.length === laudosList.length && laudosList.length > 0}
                      onChange={handleSelectAll}
                      className="table-checkbox"
                    />
                    ID
                  </th>
                  <th>
                    Nome do arquivo
                    <span className="sort-icon">⇅</span>
                  </th>
                  <th>
                    Dados extraídos
                    <span className="sort-icon">⇅</span>
                  </th>
                  <th>
                    %
                    <span className="sort-icon">⇅</span>
                  </th>
                  <th>
                    Confiabilidade
                    <span className="sort-icon">⇅</span>
                  </th>
                  <th>
                    Ação recomendada
                    <span className="sort-icon">⇅</span>
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {laudosList.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                      Nenhum laudo carregado. Faça upload de arquivos na página de Upload para começar.
                    </td>
                  </tr>
                ) : (
                  currentLaudos.map((laudo) => (
                    <tr
                      key={laudo.id}
                      className={laudo.descartado ? 'row-danger' : ''}
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(laudo.id)}
                          onChange={() => handleSelectRow(laudo.id)}
                          className="table-checkbox"
                        />
                        {laudo.id}
                      </td>
                      <td>
                        <span 
                          className="file-link" 
                          onClick={() => handleOpenDetails(laudo)}
                          style={{ cursor: 'pointer' }}
                        >
                          {laudo.nome}
                          <span className="file-link-icon">👁</span>
                        </span>
                      </td>
                      <td>
                        {laudo.extraidos}/{laudo.total}
                      </td>
                      <td>{laudo.confiabilidade}%</td>
                      <td>
                        <span
                          className={`confidence-bar ${getConfidenceClass(laudo.confiabilidade)}`}
                        />
                      </td>
                      <td>
                        <span className={`action-badge ${getActionClass(laudo.acao)}`}>
                          <span className="action-dot"></span>
                          {laudo.acao}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="delete-row-btn"
                          onClick={() => handleDeleteRow(laudo.id)}
                          title="Excluir"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="table-pagination">
            <div className="pagination-left">
              <span>Itens por página</span>
              <select
                className="pagination-select"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
              >
                <option value="4">4</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
              <span className="pagination-info">
                {startIndex + 1}-{Math.min(endIndex, laudosList.length)} de {laudosList.length}
              </span>
            </div>
            <div className="pagination-right">
              <button
                type="button"
                className="pagination-btn"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                const page = currentPage <= 2 ? i + 1 : currentPage - 1 + i
                if (page > totalPages) return null
                return (
                  <button
                    key={page}
                    type="button"
                    className={`pagination-btn ${currentPage === page ? 'pagination-btn-active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                )
              })}
              <button
                type="button"
                className="pagination-btn"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                &gt;
              </button>
            </div>
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

      {/* Modal de Confirmação de Validação */}
      {showValidateModal && (
        <div className="modal-overlay" onClick={() => setShowValidateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirmar Validação</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowValidateModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-question">
                Tem certeza que deseja validar {selectedRows.length} laudo(s) selecionado(s)?
              </p>
              <p className="modal-warning">
                Os laudos validados serão enviados para a página de exportação.
              </p>
              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-button modal-button-cancel"
                  onClick={() => setShowValidateModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="modal-button modal-button-confirm"
                  onClick={confirmValidate}
                >
                  Validar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes do Laudo */}
      {showDetailsModal && selectedLaudoDetails && (
        <div className="modal-overlay" onClick={handleCloseDetails} style={{ zIndex: 1000 }}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              maxWidth: '90%', 
              width: '900px', 
              maxHeight: '90vh', 
              overflowY: 'auto',
              padding: '0'
            }}
          >
            <div style={{ padding: '2rem', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
                  Detalhes do Laudo {selectedLaudoDetails.numero || `LA 000 SAD/${selectedLaudoDetails.id.toString().padStart(3, '0')}`}
                </h2>
                <button
                  type="button"
                  className="modal-close"
                  onClick={handleCloseDetails}
                  style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  ×
                </button>
              </div>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                Informações completas extraídas do documento
              </p>
            </div>

            <div style={{ padding: '2rem' }}>
              <div className={isEditMode && selectedLaudoDetails?.fileUrl ? 'split-details-layout' : ''}>
                {isEditMode && selectedLaudoDetails?.fileUrl && (
                  <div className="split-details-left">
                    <object
                      data={selectedLaudoDetails.fileUrl}
                      type="application/pdf"
                      className="pdf-viewer-frame"
                    >
                      Seu navegador não consegue exibir o PDF. Baixe o arquivo para visualizá-lo.
                    </object>
                  </div>
                )}
                <div className={isEditMode && selectedLaudoDetails?.fileUrl ? 'split-details-right' : ''}>
              {/* Dados sobre Localização do Imóvel */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                  Dados sobre Localização do Imóvel
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Endereço
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.endereco || '') : (selectedLaudoDetails?.endereco || 'xxxxxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('endereco', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Número
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.numero || '') : (selectedLaudoDetails?.numero || 'xxxxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('numero', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Complemento
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.complemento || '') : (selectedLaudoDetails?.complemento || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('complemento', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Bairro
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.bairro || '') : (selectedLaudoDetails?.bairro || 'xxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('bairro', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      CEP
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.cep || '') : (selectedLaudoDetails?.cep || 'xxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('cep', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      País
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.pais || '') : (selectedLaudoDetails?.pais || 'xxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('pais', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Estado
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.estado || '') : (selectedLaudoDetails?.estado || 'xxxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('estado', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Cidade/Município
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.cidade || '') : (selectedLaudoDetails?.cidade || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('cidade', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Região
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.regiao || '') : (selectedLaudoDetails?.regiao || 'xxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('regiao', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Confrontante frente
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.confrontanteFrente || '') : (selectedLaudoDetails?.confrontanteFrente || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('confrontanteFrente', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Confrontante fundo
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.confrontanteFundo || '') : (selectedLaudoDetails?.confrontanteFundo || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('confrontanteFundo', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Confrontante L. direita
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.confrontanteDireita || '') : (selectedLaudoDetails?.confrontanteDireita || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('confrontanteDireita', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Confrontante L. esquerda
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.confrontanteEsquerda || '') : (selectedLaudoDetails?.confrontanteEsquerda || 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('confrontanteEsquerda', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Ponto de referência
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.pontoReferencia || '') : (selectedLaudoDetails?.pontoReferencia || 'xxxxxxxxxxxxxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('pontoReferencia', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Observação
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.observacaoLocalizacao || '') : (selectedLaudoDetails?.observacaoLocalizacao || 'xxxxxxxxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('observacaoLocalizacao', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Coordenada geográfica S
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.coordenadaS || '') : (selectedLaudoDetails?.coordenadaS || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('coordenadaS', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Coordenada geográfica W
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.coordenadaW || '') : (selectedLaudoDetails?.coordenadaW || 'xxxxxxxxxxxxxxxxxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('coordenadaW', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Características do Imóvel */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                  Características do Imóvel
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Área do terreno
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.areaTerreno || '') : (selectedLaudoDetails?.areaTerreno || 'xxxxxxxxxxxxxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('areaTerreno', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Área construída
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.areaConstruida || '') : (selectedLaudoDetails?.areaConstruida || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('areaConstruida', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Unidade de medida
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.unidadeMedida || '') : (selectedLaudoDetails?.unidadeMedida || 'xxxxxxxxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('unidadeMedida', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Estado de conservação
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.estadoConservacao || '') : (selectedLaudoDetails?.estadoConservacao || 'xxxxxxxxxxxxxxxxxxxxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('estadoConservacao', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Limitação administrativa
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.limitacaoAdministrativa || '') : (selectedLaudoDetails?.limitacaoAdministrativa || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('limitacaoAdministrativa', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Dados Financeiros */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                  Dados Financeiros
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Critério de valoração
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.criterioValoracao || '') : (selectedLaudoDetails?.criterioValoracao || 'xxxxxxxxxxxxxxxxxxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('criterioValoracao', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Data da valoração
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.dataValoracao || '') : (selectedLaudoDetails?.dataValoracao || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('dataValoracao', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Nº do documento
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.numeroDocumento || '') : (selectedLaudoDetails?.numeroDocumento || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('numeroDocumento', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Valor da construção nova
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.valorConstrucaoNova || '') : (selectedLaudoDetails?.valorConstrucaoNova || 'xxxxxxxxxxxxxxxxxxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('valorConstrucaoNova', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Valor da área construída
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.valorAreaConstruida || '') : (selectedLaudoDetails?.valorAreaConstruida || 'xxxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('valorAreaConstruida', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Valor do terreno
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.valorTerreno || '') : (selectedLaudoDetails?.valorTerreno || 'xxxxxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('valorTerreno', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Valor total
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.valorTotal || editedData?.valor || '') : (selectedLaudoDetails?.valorTotal || selectedLaudoDetails?.valor || 'xxxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('valorTotal', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Observação
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.observacaoFinanceira || '') : (selectedLaudoDetails?.observacaoFinanceira || 'xxxxxxxxxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('observacaoFinanceira', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Rodapé do Modal */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginTop: '2rem',
                paddingTop: '1rem',
                borderTop: '1px solid #e5e7eb'
              }}>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  *Dados editados pelo usuário
                </span>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={handleCloseDetails}
                    style={{ padding: '0.5rem 1.5rem' }}
                  >
                    Voltar
                  </button>
                  {isEditMode ? (
                    <button
                      type="button"
                      className="primary-button"
                      onClick={handleSaveData}
                      style={{ padding: '0.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      💾 Salvar dados
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="primary-button"
                      onClick={handleEditData}
                      style={{ padding: '0.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      ✏️ Editar Dados
                    </button>
                  )}
                </div>
              </div>
            </div>
                </div>
              </div>
          </div>
        </div>
      )}
    </main>
  )
}

function ExportPage({ laudosValidados }) {
  const [selectedLaudos, setSelectedLaudos] = useState([])
  const [exportFormat, setExportFormat] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(2)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedLaudoDetails, setSelectedLaudoDetails] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editedData, setEditedData] = useState(null)
  
  // Usar laudos validados passados como prop, ou array vazio se não houver
  const laudos = laudosValidados || []
  
  // Inicializar seleção com todos os laudos quando a página carregar
  useEffect(() => {
    if (laudos.length > 0) {
      setSelectedLaudos(laudos.map((l) => l.id))
    }
  }, [laudos])

  const totalPages = Math.ceil(laudos.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentLaudos = laudos.slice(startIndex, endIndex)

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

  const handleExport = () => {
    if (selectedLaudos.length === 0 || !exportFormat) {
      alert('Selecione pelo menos um laudo e um formato de exportação')
      return
    }
    console.log('Exportar laudos:', selectedLaudos, exportFormat)
  }

  const handleOpenDetails = (laudo) => {
    setSelectedLaudoDetails(laudo)
    setEditedData({ ...laudo })
    setIsEditMode(false)
    setShowDetailsModal(true)
  }

  const handleCloseDetails = () => {
    setShowDetailsModal(false)
    setSelectedLaudoDetails(null)
    setIsEditMode(false)
    setEditedData(null)
  }

  const handleEditData = () => {
    setIsEditMode(true)
  }

  const handleFieldChange = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveData = () => {
    if (editedData && selectedLaudoDetails) {
      // Update the displayed data
      setSelectedLaudoDetails({ ...editedData })
      // Exit edit mode
      setIsEditMode(false)
    }
  }

  const getConfidenceClass = (confiabilidade) => {
    if (confiabilidade >= 80) return 'confidence-high'
    if (confiabilidade >= 50) return 'confidence-medium'
    if (confiabilidade >= 20) return 'confidence-low'
    return 'confidence-very-low'
  }

  const getActionClass = (acao) => {
    if (acao === 'Prosseguir') return 'action-prosseguir'
    if (acao === 'Revisar Campos') return 'action-revisar'
    if (acao === 'Descartado' || acao === 'Descartar') return 'action-descartado'
    return ''
  }

  return (
    <main className="main-layout main-config">
      <section className="config-container">
        <header className="config-header">
          <h1>Exportação dos Laudos validados</h1>
          <p>Exporte os dados que foram validados no formato que desejar.</p>
        </header>

        <section className="config-card upload-card">
          <div className="steps-bar">
            <div className="step step-completed">
              <span className="step-number">1</span>
              <span className="step-label">Upload</span>
            </div>
            <div className="step step-completed">
              <span className="step-number">2</span>
              <span className="step-label">Edição</span>
            </div>
            <div className="step step-active">
              <span className="step-number">3</span>
              <span className="step-label">Exportação</span>
            </div>
          </div>

          <div className="table-card-header">
            <h2 className="table-header-title">Tabela padrão</h2>
          </div>

          <div className="table-wrapper edit-table-wrapper">
            <table className="users-table edit-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedLaudos.length === laudos.length && laudos.length > 0}
                      onChange={handleSelectAll}
                      className="table-checkbox"
                    />
                    ID
                  </th>
                  <th>
                    Nome do arquivo
                    <span className="sort-icon">⇅</span>
                  </th>
                  <th>
                    Dados extraídos
                    <span className="sort-icon">⇅</span>
                  </th>
                  <th>
                    %
                    <span className="sort-icon">⇅</span>
                  </th>
                  <th>
                    Confiabilidade
                    <span className="sort-icon">⇅</span>
                  </th>
                  <th>
                    Ação recomendada
                    <span className="sort-icon">⇅</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {laudos.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                      Nenhum laudo validado. Selecione laudos na página de edição e clique em "Validar Dados" para continuar.
                    </td>
                  </tr>
                ) : (
                  currentLaudos.map((laudo) => (
                    <tr key={laudo.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedLaudos.includes(laudo.id)}
                          onChange={() => handleSelectLaudo(laudo.id)}
                          className="table-checkbox"
                        />
                        {laudo.id}
                      </td>
                      <td>
                        <span 
                          className="file-link" 
                          onClick={() => handleOpenDetails(laudo)}
                          style={{ cursor: 'pointer' }}
                        >
                          {laudo.nome}
                          <span className="file-link-icon">👁</span>
                        </span>
                      </td>
                      <td>
                        {laudo.extraidos}/{laudo.total}
                      </td>
                      <td>{laudo.confiabilidade}%</td>
                      <td>
                        <span
                          className={`confidence-bar ${getConfidenceClass(laudo.confiabilidade)}`}
                        />
                      </td>
                      <td>
                        <span className={`action-badge ${getActionClass(laudo.acao)}`}>
                          <span className="action-dot"></span>
                          {laudo.acao}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="table-pagination">
            <div className="pagination-left">
              <span>Itens por página</span>
              <select
                className="pagination-select"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
              >
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
              <span className="pagination-info">
                {startIndex + 1}-{Math.min(endIndex, laudos.length)} de {laudos.length}
              </span>
            </div>
            <div className="pagination-right">
              <button
                type="button"
                className="pagination-btn"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                const page = currentPage <= 2 ? i + 1 : currentPage - 1 + i
                if (page > totalPages) return null
                return (
                  <button
                    key={page}
                    type="button"
                    className={`pagination-btn ${currentPage === page ? 'pagination-btn-active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                )
              })}
              <button
                type="button"
                className="pagination-btn"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                &gt;
              </button>
            </div>
          </div>

          <div className="export-footer-actions">
            <span className="selected-count">
              {selectedLaudos.length} laudo(s) selecionado(s)
            </span>
            <div className="export-options">
              <span>Opções para exportação dos laudos:</span>
              <select
                className="export-format-select"
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
                className="primary-button export-button"
                onClick={handleExport}
              >
                Baixar laudos
              </button>
            </div>
          </div>
        </section>
      </section>

      {/* Modal de Detalhes do Laudo */}
      {showDetailsModal && selectedLaudoDetails && (
        <div className="modal-overlay" onClick={handleCloseDetails} style={{ zIndex: 1000 }}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              maxWidth: '90%', 
              width: '900px', 
              maxHeight: '90vh', 
              overflowY: 'auto',
              padding: '0'
            }}
          >
            <div style={{ padding: '2rem', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
                  Detalhes do Laudo {selectedLaudoDetails.numero || `LA 000 SAD/${selectedLaudoDetails.id.toString().padStart(3, '0')}`}
                </h2>
                <button
                  type="button"
                  className="modal-close"
                  onClick={handleCloseDetails}
                  style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  ×
                </button>
              </div>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                Informações completas extraídas do documento
              </p>
            </div>

            <div style={{ padding: '2rem' }}>
              {/* Dados sobre Localização do Imóvel */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                  Dados sobre Localização do Imóvel
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Endereço
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.endereco || '') : (selectedLaudoDetails?.endereco || 'xxxxxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('endereco', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Número
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.numero || '') : (selectedLaudoDetails?.numero || 'xxxxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('numero', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Complemento
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.complemento || '') : (selectedLaudoDetails?.complemento || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('complemento', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Bairro
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.bairro || '') : (selectedLaudoDetails?.bairro || 'xxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('bairro', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      CEP
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.cep || '') : (selectedLaudoDetails?.cep || 'xxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('cep', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      País
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.pais || '') : (selectedLaudoDetails?.pais || 'xxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('pais', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Estado
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.estado || '') : (selectedLaudoDetails?.estado || 'xxxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('estado', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Cidade/Município
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.cidade || '') : (selectedLaudoDetails?.cidade || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('cidade', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Região
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.regiao || '') : (selectedLaudoDetails?.regiao || 'xxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('regiao', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Confrontante frente
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.confrontanteFrente || '') : (selectedLaudoDetails?.confrontanteFrente || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('confrontanteFrente', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Confrontante fundo
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.confrontanteFundo || '') : (selectedLaudoDetails?.confrontanteFundo || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('confrontanteFundo', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Confrontante L. direita
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.confrontanteDireita || '') : (selectedLaudoDetails?.confrontanteDireita || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('confrontanteDireita', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Confrontante L. esquerda
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.confrontanteEsquerda || '') : (selectedLaudoDetails?.confrontanteEsquerda || 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('confrontanteEsquerda', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Ponto de referência
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.pontoReferencia || '') : (selectedLaudoDetails?.pontoReferencia || 'xxxxxxxxxxxxxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('pontoReferencia', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Observação
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.observacaoLocalizacao || '') : (selectedLaudoDetails?.observacaoLocalizacao || 'xxxxxxxxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('observacaoLocalizacao', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Coordenada geográfica S
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.coordenadaS || '') : (selectedLaudoDetails?.coordenadaS || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('coordenadaS', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Coordenada geográfica W
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.coordenadaW || '') : (selectedLaudoDetails?.coordenadaW || 'xxxxxxxxxxxxxxxxxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('coordenadaW', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Características do Imóvel */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                  Características do Imóvel
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Área do terreno
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.areaTerreno || '') : (selectedLaudoDetails?.areaTerreno || 'xxxxxxxxxxxxxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('areaTerreno', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Área construída
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.areaConstruida || '') : (selectedLaudoDetails?.areaConstruida || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('areaConstruida', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Unidade de medida
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.unidadeMedida || '') : (selectedLaudoDetails?.unidadeMedida || 'xxxxxxxxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('unidadeMedida', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Estado de conservação
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.estadoConservacao || '') : (selectedLaudoDetails?.estadoConservacao || 'xxxxxxxxxxxxxxxxxxxxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('estadoConservacao', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Limitação administrativa
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.limitacaoAdministrativa || '') : (selectedLaudoDetails?.limitacaoAdministrativa || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('limitacaoAdministrativa', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Dados Financeiros */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                  Dados Financeiros
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Critério de valoração
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.criterioValoracao || '') : (selectedLaudoDetails?.criterioValoracao || 'xxxxxxxxxxxxxxxxxxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('criterioValoracao', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Data da valoração
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.dataValoracao || '') : (selectedLaudoDetails?.dataValoracao || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('dataValoracao', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Nº do documento
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.numeroDocumento || '') : (selectedLaudoDetails?.numeroDocumento || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('numeroDocumento', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Valor da construção nova
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.valorConstrucaoNova || '') : (selectedLaudoDetails?.valorConstrucaoNova || 'xxxxxxxxxxxxxxxxxxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('valorConstrucaoNova', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Valor da área construída
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.valorAreaConstruida || '') : (selectedLaudoDetails?.valorAreaConstruida || 'xxxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('valorAreaConstruida', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Valor do terreno
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.valorTerreno || '') : (selectedLaudoDetails?.valorTerreno || 'xxxxxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('valorTerreno', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Valor total
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.valorTotal || editedData?.valor || '') : (selectedLaudoDetails?.valorTotal || selectedLaudoDetails?.valor || 'xxxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('valorTotal', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Observação
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.observacaoFinanceira || '') : (selectedLaudoDetails?.observacaoFinanceira || 'xxxxxxxxxxxxxx')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('observacaoFinanceira', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Rodapé do Modal */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginTop: '2rem',
                paddingTop: '1rem',
                borderTop: '1px solid #e5e7eb'
              }}>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  *Dados editados pelo usuário
                </span>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={handleCloseDetails}
                    style={{ padding: '0.5rem 1.5rem' }}
                  >
                    Voltar
                  </button>
                  {isEditMode ? (
                    <button
                      type="button"
                      className="primary-button"
                      onClick={handleSaveData}
                      style={{ padding: '0.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      💾 Salvar dados
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="primary-button"
                      onClick={handleEditData}
                      style={{ padding: '0.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      ✏️ Editar Dados
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function HistoryReportsPage({ laudos: historyLaudos = [], setLaudos: setHistoryLaudos }) {
  const [filters, setFilters] = useState({
    numeroDocumento: '',
    endereco: '',
    coordenadas: '',
    dataExtracao: '',
  })
  const [selectedLaudos, setSelectedLaudos] = useState([])
  const [exportFormat, setExportFormat] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [laudoToDelete, setLaudoToDelete] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedLaudoDetails, setSelectedLaudoDetails] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editedData, setEditedData] = useState(null)
  const laudos = historyLaudos
  const setLaudos = setHistoryLaudos

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

  const handleDeleteRow = (id) => {
    const laudo = laudos.find((l) => l.id === id)
    setLaudoToDelete(laudo)
    setShowDeleteModal(true)
  }

  const confirmDeleteRow = () => {
    if (laudoToDelete) {
      // TODO: Integrar com backend - excluir laudo
      // deleteLaudo(laudoToDelete.id)
      setLaudos((prev) => prev.filter((l) => l.id !== laudoToDelete.id))
      setSelectedLaudos((prev) => prev.filter((laudoId) => laudoId !== laudoToDelete.id))
    }
    setShowDeleteModal(false)
    setLaudoToDelete(null)
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

  const handleOpenDetails = (laudo) => {
    setSelectedLaudoDetails(laudo)
    setEditedData({ ...laudo })
    setIsEditMode(false)
    setShowDetailsModal(true)
  }

  const handleCloseDetails = () => {
    setShowDetailsModal(false)
    setSelectedLaudoDetails(null)
    setIsEditMode(false)
    setEditedData(null)
  }

  const handleEditData = () => {
    setIsEditMode(true)
  }

  const handleFieldChange = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveData = () => {
    if (editedData && selectedLaudoDetails) {
      // Update the laudo in the history list
      setLaudos((prev) =>
        prev.map((l) => (l.id === selectedLaudoDetails.id ? { ...editedData } : l))
      )
      // Update the selected laudo details to show the new data
      setSelectedLaudoDetails({ ...editedData })
      // Exit edit mode
      setIsEditMode(false)
    }
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
                  <th></th>
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
                      <span 
                        className="file-link" 
                        onClick={() => handleOpenDetails(laudo)}
                        style={{ cursor: 'pointer' }}
                      >
                        {laudo.numero}
                        <span className="file-link-icon">👁</span>
                      </span>
                    </td>
                    <td>{laudo.endereco}</td>
                    <td>{laudo.coordenadaS}</td>
                    <td>{laudo.coordenadaW}</td>
                    <td>
                      <span className={`status-pill ${getStatusColor(laudo.estadoConservacao)}`} />
                    </td>
                    <td>{laudo.valor}</td>
                    <td>{laudo.dataExtracao}</td>
                    <td>
                      <button
                        type="button"
                        className="delete-row-btn"
                        onClick={() => handleDeleteRow(laudo.id)}
                        title="Excluir"
                        style={{ 
                          color: '#dc3545', 
                          fontSize: '1.2rem',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.25rem 0.5rem',
                          transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      >
                        🗑️
                      </button>
                    </td>
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

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && laudoToDelete && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirmar Exclusão</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-question">
                Tem certeza que deseja excluir o laudo <strong>{laudoToDelete.numero}</strong>?
              </p>
              <p className="modal-warning">
                Esta ação não pode ser desfeita. O laudo será permanentemente removido do histórico.
              </p>
              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-button modal-button-cancel"
                  onClick={() => {
                    setShowDeleteModal(false)
                    setLaudoToDelete(null)
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="modal-button modal-button-confirm"
                  onClick={confirmDeleteRow}
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes do Laudo */}
      {showDetailsModal && selectedLaudoDetails && (
        <div className="modal-overlay" onClick={handleCloseDetails} style={{ zIndex: 1000 }}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              maxWidth: '90%', 
              width: '900px', 
              maxHeight: '90vh', 
              overflowY: 'auto',
              padding: '0'
            }}
          >
            <div style={{ padding: '2rem', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
                  Detalhes do Laudo {selectedLaudoDetails.numero || `LA 000 SAD/${selectedLaudoDetails.id.toString().padStart(3, '0')}`}
                </h2>
                <button
                  type="button"
                  className="modal-close"
                  onClick={handleCloseDetails}
                  style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  ×
                </button>
              </div>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                Informações completas extraídas do documento
              </p>
            </div>

            <div style={{ padding: '2rem' }}>
              {/* Dados sobre Localização do Imóvel */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                  Dados sobre Localização do Imóvel
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Endereço
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.endereco || '') : (selectedLaudoDetails?.endereco || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('endereco', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Número
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.numero || '') : (selectedLaudoDetails?.numero || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('numero', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Complemento
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.complemento || '') : (selectedLaudoDetails?.complemento || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('complemento', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Bairro
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.bairro || '') : (selectedLaudoDetails?.bairro || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('bairro', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      CEP
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.cep || '') : (selectedLaudoDetails?.cep || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('cep', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      País
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.pais || '') : (selectedLaudoDetails?.pais || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('pais', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Estado
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.estado || '') : (selectedLaudoDetails?.estado || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('estado', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Cidade/Município
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.cidade || '') : (selectedLaudoDetails?.cidade || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('cidade', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Região
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.regiao || '') : (selectedLaudoDetails?.regiao || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('regiao', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Confrontante frente
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.confrontanteFrente || '') : (selectedLaudoDetails?.confrontanteFrente || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('confrontanteFrente', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Confrontante fundo
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.confrontanteFundo || '') : (selectedLaudoDetails?.confrontanteFundo || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('confrontanteFundo', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Confrontante L. direita
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.confrontanteDireita || '') : (selectedLaudoDetails?.confrontanteDireita || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('confrontanteDireita', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Confrontante L. esquerda
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.confrontanteEsquerda || '') : (selectedLaudoDetails?.confrontanteEsquerda || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('confrontanteEsquerda', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Ponto de referência
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.pontoReferencia || '') : (selectedLaudoDetails?.pontoReferencia || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('pontoReferencia', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Observação
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.observacaoLocalizacao || '') : (selectedLaudoDetails?.observacaoLocalizacao || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('observacaoLocalizacao', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Coordenada geográfica S
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.coordenadaS || '') : (selectedLaudoDetails?.coordenadaS || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('coordenadaS', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Coordenada geográfica W
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.coordenadaW || '') : (selectedLaudoDetails?.coordenadaW || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('coordenadaW', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Características do Imóvel */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                  Características do Imóvel
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Área do terreno
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.areaTerreno || '') : (selectedLaudoDetails?.areaTerreno || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('areaTerreno', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Área construída
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.areaConstruida || '') : (selectedLaudoDetails?.areaConstruida || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('areaConstruida', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Unidade de medida
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.unidadeMedida || '') : (selectedLaudoDetails?.unidadeMedida || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('unidadeMedida', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Estado de conservação
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.estadoConservacao || '') : (selectedLaudoDetails?.estadoConservacao || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('estadoConservacao', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Limitação administrativa
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.limitacaoAdministrativa || '') : (selectedLaudoDetails?.limitacaoAdministrativa || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('limitacaoAdministrativa', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Dados Financeiros */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                  Dados Financeiros
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Critério de valoração
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.criterioValoracao || '') : (selectedLaudoDetails?.criterioValoracao || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('criterioValoracao', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Data da valoração
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.dataValoracao || '') : (selectedLaudoDetails?.dataValoracao || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('dataValoracao', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Nº do documento
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.numeroDocumento || '') : (selectedLaudoDetails?.numeroDocumento || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('numeroDocumento', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Valor da construção nova
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.valorConstrucaoNova || '') : (selectedLaudoDetails?.valorConstrucaoNova || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('valorConstrucaoNova', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Valor da área construída
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.valorAreaConstruida || '') : (selectedLaudoDetails?.valorAreaConstruida || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('valorAreaConstruida', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Valor do terreno
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.valorTerreno || '') : (selectedLaudoDetails?.valorTerreno || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('valorTerreno', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Valor total
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.valorTotal || editedData?.valor || '') : (selectedLaudoDetails?.valorTotal || selectedLaudoDetails?.valor || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('valorTotal', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Observação
                    </label>
                    <input 
                      type="text" 
                      value={isEditMode ? (editedData?.observacaoFinanceira || '') : (selectedLaudoDetails?.observacaoFinanceira || 'Não encontrado')} 
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && handleFieldChange('observacaoFinanceira', e.target.value)}
                      className="field-input rectangular"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Rodapé do Modal */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginTop: '2rem',
                paddingTop: '1rem',
                borderTop: '1px solid #e5e7eb'
              }}>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  *Dados editados pelo usuário
                </span>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={handleCloseDetails}
                    style={{ padding: '0.5rem 1.5rem' }}
                  >
                    Voltar
                  </button>
                  {isEditMode ? (
                    <button
                      type="button"
                      className="primary-button"
                      onClick={handleSaveData}
                      style={{ padding: '0.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      💾 Salvar dados
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="primary-button"
                      onClick={handleEditData}
                      style={{ padding: '0.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      ✏️ Editar Dados
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
  const [showEditModal, setShowEditModal] = useState(false)
  const [showInativarModal, setShowInativarModal] = useState(false)
  const [showReenviarModal, setShowReenviarModal] = useState(false)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationType, setNotificationType] = useState('success') // 'success' or 'error'
  const [editingUser, setEditingUser] = useState(null)
  const [userToAction, setUserToAction] = useState(null)
  const [editForm, setEditForm] = useState({
    nome: '',
    senha: '',
    funcao: '',
  })
  const [showCargoDropdown, setShowCargoDropdown] = useState(false)
  const cargoDropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cargoDropdownRef.current &&
        !cargoDropdownRef.current.contains(event.target)
      ) {
        setShowCargoDropdown(false)
      }
    }

    if (showCargoDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showCargoDropdown])

  const handleNewUserChange = (field, value) => {
    setNewUser((prev) => ({ ...prev, [field]: value }))
  }

  const handleCreateUser = () => {
    if (!newUser.nome || !newUser.email || !newUser.funcao) {
      alert('Preencha todos os campos')
      return
    }
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
    setNotificationMessage('Usuário criado')
    setNotificationType('success')
    setShowSuccessNotification(true)
    setTimeout(() => {
      setShowSuccessNotification(false)
    }, 3000)
  }

  const handleInativar = (id) => {
    const user = users.find((u) => u.id === id)
    setUserToAction(user)
    setShowInativarModal(true)
  }

  const confirmInativar = () => {
    if (userToAction) {
      setUsers((prev) => prev.filter((u) => u.id !== userToAction.id))
      setNotificationMessage(`Usuário ${userToAction.nome} Inativo`)
      setNotificationType('error')
      setShowSuccessNotification(true)
      setTimeout(() => {
        setShowSuccessNotification(false)
      }, 3000)
    }
    setShowInativarModal(false)
    setUserToAction(null)
  }

  const handleEditar = (id) => {
    const user = users.find((u) => u.id === id)
    setEditingUser(user)
    setEditForm({
      nome: user.nome,
      senha: user.email,
      funcao: user.tipo,
    })
    setShowEditModal(true)
  }

  const handleEditFormChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveEdit = () => {
    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                nome: editForm.nome,
                email: editForm.senha,
                tipo: editForm.funcao,
              }
            : u
        )
      )
      setNotificationMessage(`Usuário ${editForm.nome} editado`)
      setNotificationType('success')
      setShowSuccessNotification(true)
      setTimeout(() => {
        setShowSuccessNotification(false)
      }, 3000)
    }
    setShowEditModal(false)
    setEditingUser(null)
    setEditForm({ nome: '', senha: '', funcao: '' })
    setShowCargoDropdown(false)
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setEditingUser(null)
    setEditForm({ nome: '', senha: '', funcao: '' })
    setShowCargoDropdown(false)
  }

  const handleReenviarEmail = (id) => {
    const user = users.find((u) => u.id === id)
    setUserToAction(user)
    setShowReenviarModal(true)
  }

  const confirmReenviar = () => {
    // TODO: Integrar com backend - reenviar email
    console.log('Reenviar email para usuário:', userToAction?.id)
    setNotificationMessage('E-mail reenviado com sucesso')
    setNotificationType('success')
    setShowSuccessNotification(true)
    setTimeout(() => {
      setShowSuccessNotification(false)
    }, 3000)
    setShowReenviarModal(false)
    setUserToAction(null)
  }

  const getCargoOptions = () => {
    const cargoMap = {
      Cadastro: 'Usuário Cadastral',
      Gestão: 'Usuário Gestor',
      Admin: 'Usuário Administrador',
    }
    return cargoMap[editForm.funcao] || editForm.funcao
  }

  return (
    <main className="main-layout main-config">
      <section className="config-container">
        <header className="config-header">
          <h1>Configurações dos usuários</h1>
          <p>Configurações e cadastros dos usuários no sistema</p>
        </header>

        {showSuccessNotification && (
          <div className={notificationType === 'error' ? 'error-notification' : 'success-notification'}>
            <div className={notificationType === 'error' ? 'error-notification-icon' : 'success-notification-icon'}>✓</div>
            <span>{notificationMessage}</span>
          </div>
        )}

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

      {/* Modal de Editar Usuário */}
      {showEditModal && (
        <div className="modal-overlay" onClick={handleCloseEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Editar Usuário</h3>
              <button
                type="button"
                className="modal-close"
                onClick={handleCloseEditModal}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nome</label>
                <input
                  className="field-input rectangular"
                  value={editForm.nome}
                  onChange={(e) => handleEditFormChange('nome', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Senha</label>
                <input
                  className="field-input rectangular"
                  value={editForm.senha}
                  onChange={(e) => handleEditFormChange('senha', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Função</label>
                <div className="cargo-dropdown-wrapper" ref={cargoDropdownRef}>
                  <button
                    type="button"
                    className="field-input rectangular cargo-dropdown-trigger"
                    onClick={() => setShowCargoDropdown(!showCargoDropdown)}
                  >
                    {editForm.funcao ? getCargoOptions() : 'Selecione o cargo'}
                    <span className="dropdown-arrow">▼</span>
                  </button>
                  {showCargoDropdown && (
                    <div className="cargo-dropdown-menu">
                      <div className="cargo-dropdown-header">Selecione o cargo</div>
                      <button
                        type="button"
                        className="cargo-option"
                        onClick={() => {
                          handleEditFormChange('funcao', 'Cadastro')
                          setShowCargoDropdown(false)
                        }}
                      >
                        Usuário Cadastral
                      </button>
                      <button
                        type="button"
                        className="cargo-option"
                        onClick={() => {
                          handleEditFormChange('funcao', 'Gestão')
                          setShowCargoDropdown(false)
                        }}
                      >
                        Usuário Gestor
                      </button>
                      <button
                        type="button"
                        className="cargo-option"
                        onClick={() => {
                          handleEditFormChange('funcao', 'Admin')
                          setShowCargoDropdown(false)
                        }}
                      >
                        Usuário Administrador
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                className="primary-button modal-save-button"
                onClick={handleSaveEdit}
              >
                Salvar alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmar Reenvio */}
      {showReenviarModal && (
        <div className="modal-overlay" onClick={() => setShowReenviarModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirmar Ação</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowReenviarModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-question">
                Tem certeza que deseja reenviar o e-mail para este usuário?
              </p>
              <p className="modal-warning">
                Isso irá gerar uma nova senha temporária e invalidar a senha atual.
              </p>
              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-button modal-button-cancel"
                  onClick={() => setShowReenviarModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="modal-button modal-button-confirm"
                  onClick={confirmReenviar}
                >
                  Sim, Reenviar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Inativar Usuário */}
      {showInativarModal && (
        <div className="modal-overlay" onClick={() => setShowInativarModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirmar Ação</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowInativarModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-question">
                Tem certeza que deseja inativar esse usuário?
              </p>
              <p className="modal-warning">
                O usuário perderá o acesso a conta, tendo que fazer uma nova solicitação de cadastro
              </p>
              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-button modal-button-cancel"
                  onClick={() => setShowInativarModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="modal-button modal-button-confirm"
                  onClick={confirmInativar}
                >
                  Inativar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [activePage, setActivePage] = useState(PAGES.UPLOAD)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [laudos, setLaudos] = useState([])
  const [laudosValidados, setLaudosValidados] = useState([])
  const [historyLaudos, setHistoryLaudos] = useState([
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

  const handleAddToHistory = (laudosToAdd) => {
    // Transform laudos from EditDataPage format to HistoryReportsPage format
    const formattedLaudos = laudosToAdd.map((laudo) => {
      // Build endereco string from available fields
      let enderecoStr = laudo.endereco || ''
      if (laudo.numeroEndereco) {
        enderecoStr += enderecoStr ? `, ${laudo.numeroEndereco}` : laudo.numeroEndereco
      }
      if (laudo.bairro) {
        enderecoStr += enderecoStr ? `, ${laudo.bairro}` : laudo.bairro
      }
      
      // Get estadoConservacao, defaulting to a simple value if it's too long
      let estadoConservacao = laudo.estadoConservacao || 'Bom'
      if (estadoConservacao && estadoConservacao.length > 20) {
        // Extract first word or use default
        const firstWord = estadoConservacao.split(' ')[0]
        estadoConservacao = firstWord || 'Bom'
      }
      // Normalize common values
      if (estadoConservacao && estadoConservacao.toLowerCase().includes('bom')) {
        estadoConservacao = 'Bom'
      } else if (estadoConservacao && estadoConservacao.toLowerCase().includes('regular')) {
        estadoConservacao = 'Regular'
      } else if (estadoConservacao && estadoConservacao.toLowerCase().includes('ruim')) {
        estadoConservacao = 'Ruim'
      }
      
      return {
        id: laudo.id || Date.now() + Math.random(),
        numero: laudo.numero || `LA 000 SAD/${String(laudo.id || Date.now()).slice(-3).padStart(3, '0')}`,
        fileUrl: laudo.fileUrl || null,
        endereco: enderecoStr || 'Endereço não informado',
        coordenadaS: laudo.coordenadaS || "0°00'00.0\"S",
        coordenadaW: laudo.coordenadaW || "0°00'00.0\"W",
        estadoConservacao: estadoConservacao,
        valor: laudo.valorTotal || laudo.valor || 'R$ 0,00',
        dataExtracao: new Date().toLocaleDateString('pt-BR'),
      }
    })
    
    setHistoryLaudos((prev) => [...formattedLaudos, ...prev])
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

  if (activePage === PAGES.UPLOAD) pageContent = <UploadPage onNavigate={setActivePage} onAddLaudos={handleAddLaudos} />
  else if (activePage === PAGES.EDIT) pageContent = <EditDataPage onNavigate={handleNavigate} laudos={laudos} setLaudos={setLaudos} onAddToHistory={handleAddToHistory} />
  else if (activePage === PAGES.EXPORT) pageContent = <ExportPage laudosValidados={laudosValidados} />
  else if (activePage === PAGES.HISTORY_REPORTS)
    pageContent = <HistoryReportsPage laudos={historyLaudos} setLaudos={setHistoryLaudos} />
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
