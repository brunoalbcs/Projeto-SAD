export const PAGES = {
  UPLOAD: 'upload',
  EDIT: 'edit',
  EXPORT: 'export',
  HISTORY_REPORTS: 'historyReports',
  HISTORY_USERS: 'historyUsers',
  INDICATORS: 'indicators',
  CONFIG: 'config',
}

export const ROLE_ACCESS = {
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

