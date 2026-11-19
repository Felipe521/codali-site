/** Validações e máscaras para os formulários (padrões brasileiros). */

export const somenteDigitos = (valor: string) => valor.replace(/\D/g, '')

export function mascaraTelefone(valor: string): string {
  const d = somenteDigitos(valor).slice(0, 11)
  if (d.length === 0) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export function telefoneValido(valor: string): boolean {
  const d = somenteDigitos(valor)
  if (d.length !== 10 && d.length !== 11) return false
  const ddd = Number(d.slice(0, 2))
  if (ddd < 11 || ddd > 99 || d[0] === '0' || d[1] === '0') return false
  if (d.length === 11 && d[2] !== '9') return false
  return true
}

export function emailValido(valor: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim())
}

export function cpfValido(valor: string): boolean {
  const d = somenteDigitos(valor)
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false
  const digito = (base: string) => {
    let soma = 0
    for (let i = 0; i < base.length; i++) soma += Number(base[i]) * (base.length + 1 - i)
    const resto = (soma * 10) % 11
    return resto === 10 ? 0 : resto
  }
  return digito(d.slice(0, 9)) === Number(d[9]) && digito(d.slice(0, 10)) === Number(d[10])
}

/**
 * CNPJ numérico ou alfanumérico (formato da Receita Federal vigente desde julho de 2026):
 * 12 caracteres [0-9A-Z] + 2 dígitos verificadores; cada caractere vale (código ASCII − 48).
 */
export function cnpjValido(valor: string): boolean {
  const c = valor.toUpperCase().replace(/[^0-9A-Z]/g, '')
  if (!/^[0-9A-Z]{12}\d{2}$/.test(c) || /^(.)\1{13}$/.test(c)) return false
  const digito = (base: string) => {
    const pesos = base.length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    let soma = 0
    for (let i = 0; i < base.length; i++) soma += (base.charCodeAt(i) - 48) * pesos[i]
    const resto = soma % 11
    return resto < 2 ? 0 : 11 - resto
  }
  const d1 = digito(c.slice(0, 12))
  const d2 = digito(c.slice(0, 12) + d1)
  return d1 === Number(c[12]) && d2 === Number(c[13])
}

export function mascaraDocumento(valor: string): string {
  const c = valor.toUpperCase().replace(/[^0-9A-Z]/g, '').slice(0, 14)
  const temLetra = /[A-Z]/.test(c)
  if (!temLetra && c.length <= 11) {
    if (c.length <= 3) return c
    if (c.length <= 6) return `${c.slice(0, 3)}.${c.slice(3)}`
    if (c.length <= 9) return `${c.slice(0, 3)}.${c.slice(3, 6)}.${c.slice(6)}`
    return `${c.slice(0, 3)}.${c.slice(3, 6)}.${c.slice(6, 9)}-${c.slice(9)}`
  }
  let r = c.slice(0, 2)
  if (c.length > 2) r += `.${c.slice(2, 5)}`
  if (c.length > 5) r += `.${c.slice(5, 8)}`
  if (c.length > 8) r += `/${c.slice(8, 12)}`
  if (c.length > 12) r += `-${c.slice(12)}`
  return r
}

export function documentoValido(valor: string): boolean {
  const c = valor.toUpperCase().replace(/[^0-9A-Z]/g, '')
  if (c.length === 11) return cpfValido(c)
  if (c.length === 14) return cnpjValido(c)
  return false
}

export const UFS: Array<[string, string]> = [
  ['AC', 'Acre'],
  ['AL', 'Alagoas'],
  ['AP', 'Amapá'],
  ['AM', 'Amazonas'],
  ['BA', 'Bahia'],
  ['CE', 'Ceará'],
  ['DF', 'Distrito Federal'],
  ['ES', 'Espírito Santo'],
  ['GO', 'Goiás'],
  ['MA', 'Maranhão'],
  ['MT', 'Mato Grosso'],
  ['MS', 'Mato Grosso do Sul'],
  ['MG', 'Minas Gerais'],
  ['PA', 'Pará'],
  ['PB', 'Paraíba'],
  ['PR', 'Paraná'],
  ['PE', 'Pernambuco'],
  ['PI', 'Piauí'],
  ['RJ', 'Rio de Janeiro'],
  ['RN', 'Rio Grande do Norte'],
  ['RS', 'Rio Grande do Sul'],
  ['RO', 'Rondônia'],
  ['RR', 'Roraima'],
  ['SC', 'Santa Catarina'],
  ['SP', 'São Paulo'],
  ['SE', 'Sergipe'],
  ['TO', 'Tocantins'],
]
