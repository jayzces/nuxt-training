export default dateStr => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric'
  })
}
