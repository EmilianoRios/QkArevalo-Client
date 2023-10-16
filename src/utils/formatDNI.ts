export function formatDNI(number: string) {
  // Convert the number to a string and remove dots (if any)
  const numberWithoutDots = String(number).replace(/\./g, '')

  // Check if the number is already in the format "12.345.678"
  if (/^\d{2}\.\d{3}\.\d{3}$/.test(numberWithoutDots)) {
    // If it's already in the format, return the number unchanged
    return numberWithoutDots
  } else {
    // Check if the number is an 8-digit string
    if (/^\d{8}$/.test(numberWithoutDots)) {
      // Format the number in the "12.345.678" format
      const formattedNumber = numberWithoutDots.replace(
        /(\d{2})(\d{3})(\d{3})/,
        '$1.$2.$3'
      )
      return formattedNumber
    } else {
      // The number is not valid in any format
      return 'Sin DNI.'
    }
  }
}
