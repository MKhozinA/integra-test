import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Combine class names with Tailwind
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Format currency to Indonesian Rupiah
export function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Calculate age from birth date
export function calculateAge(birthDate) {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}
