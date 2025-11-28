import { PAGES, ROLE_ACCESS } from '../../constants/pages'

export default function Sidebar({ currentUser, activePage, onNavigate, isOpen, onClose }) {
  return (
    <>
      <div
        className={
          'sidebar-backdrop ' + (isOpen ? 'sidebar-backdrop-open' : '')
        }
        onClick={onClose}
      />
      <aside
        className={'sidebar ' + (isOpen ? 'sidebar-open' : '')}
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
                onNavigate(PAGES.UPLOAD)
                onClose()
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
                onNavigate(PAGES.EDIT)
                onClose()
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
                onNavigate(PAGES.HISTORY_REPORTS)
                onClose()
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
                onNavigate(PAGES.HISTORY_USERS)
                onClose()
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
                onNavigate(PAGES.INDICATORS)
                onClose()
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
                onNavigate(PAGES.CONFIG)
                onClose()
              }}
            >
              Configurações
            </button>
          )}
        </nav>
      </aside>
    </>
  )
}

