export function capitalizeInitials(string: string) {
  // Dividir la cadena en palabras
  const words = string.split(' ')

  // Mapear cada palabra y capitalizar su inicial
  const capitalizedWords = words.map((word) => {
    if (word.length > 0) {
      return word[0].toUpperCase() + word.slice(1).toLowerCase()
    } else {
      return word // Mantener palabras vacías como están
    }
  })

  // Unir las palabras nuevamente en una sola cadena
  return capitalizedWords.join(' ')
}
