export function formatearDni(numero: string) {
  // Convierte el número a una cadena y quita los puntos (si los tiene)
  const numeroSinPuntos = String(numero).replace(/\./g, '')

  // Verifica si el número ya está en el formato "12.345.678"
  if (/^\d{2}\.\d{3}\.\d{3}$/.test(numeroSinPuntos)) {
    // Si ya está en el formato, retorna el número sin cambios
    return numeroSinPuntos
  } else {
    // Verifica si el número es una cadena de 8 dígitos
    if (/^\d{8}$/.test(numeroSinPuntos)) {
      // Formatea el número en el formato "12.345.678"
      const numeroFormateado = numeroSinPuntos.replace(
        /(\d{2})(\d{3})(\d{3})/,
        '$1.$2.$3'
      )
      return numeroFormateado
    } else {
      // El número no es válido en ningún formato
      return 'Número no válido'
    }
  }
}
