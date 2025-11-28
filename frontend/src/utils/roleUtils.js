export function deriveRoleFromEmail(email) {
  if (!email) return null
  if (email.includes('admin@sad')) return 'admin'
  if (email.includes('gestor@sad')) return 'gestor'
  if (email.includes('cadastro@sad')) return 'cadastro'
  return null
}

