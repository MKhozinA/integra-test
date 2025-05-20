"use client"

// Helper function to export data to CSV
export function exportToCSV(data, filename, headers) {
  // Create CSV content
  let csvContent = headers.join(",") + "\n"

  data.forEach((row) => {
    const values = headers.map((header) => {
      const value = row[header.key] || ""
      // Wrap values with commas in quotes
      return typeof value === "string" && value.includes(",") ? `"${value}"` : value
    })
    csvContent += values.join(",") + "\n"
  })

  // Create a blob and download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
