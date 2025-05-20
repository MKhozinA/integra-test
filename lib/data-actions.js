"use server"

import mysql from "mysql2/promise"

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "integra_test",
}

// Create a connection pool
const pool = mysql.createPool(dbConfig)

// Helper function to execute SQL queries
async function executeQuery(query, params = []) {
  const connection = await pool.getConnection()
  try {
    const [rows] = await connection.execute(query, params)
    return rows
  } finally {
    connection.release()
  }
}

// Fetch people data with search and sort
export async function fetchPeople(searchTerm = "", sortBy = "name-asc") {
  let query = `
    SELECT 
      p.id, p.nik, p.name, 
      p.province_code AS provinceCode, prov.name AS provinceName,
      p.regency_code AS regencyCode, reg.name AS regencyName,
      p.district_code AS districtCode, dist.name AS districtName,
      p.address, p.phone, p.email, p.birth_date AS birthDate,
      p.income, p.education, p.occupation, p.notes
    FROM people p
    LEFT JOIN provinces prov ON p.province_code = prov.code
    LEFT JOIN regencies reg ON p.regency_code = reg.code
    LEFT JOIN districts dist ON p.district_code = dist.code
  `

  const params = []

  if (searchTerm) {
    query += `
      WHERE p.name LIKE ? 
      OR p.address LIKE ? 
      OR prov.name LIKE ? 
      OR reg.name LIKE ? 
      OR dist.name LIKE ? 
      OR p.phone LIKE ? 
      OR p.email LIKE ?
    `
    const searchPattern = `%${searchTerm}%`
    params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern)
  }

  // Add ORDER BY clause based on sortBy
  if (sortBy === "name-asc") {
    query += " ORDER BY p.name ASC"
  } else if (sortBy === "name-desc") {
    query += " ORDER BY p.name DESC"
  } else if (sortBy === "age-asc") {
    query += " ORDER BY p.birth_date DESC" // Younger first
  } else if (sortBy === "age-desc") {
    query += " ORDER BY p.birth_date ASC" // Older first
  } else if (sortBy === "income-asc") {
    query += " ORDER BY p.income ASC"
  } else if (sortBy === "income-desc") {
    query += " ORDER BY p.income DESC"
  }

  return executeQuery(query, params)
}

// Save (create or update) a person
export async function savePerson(data) {
  if (data.id) {
    // Update existing person
    const query = `
      UPDATE people SET
        nik = ?,
        name = ?,
        province_code = ?,
        regency_code = ?,
        district_code = ?,
        address = ?,
        phone = ?,
        email = ?,
        birth_date = ?,
        income = ?,
        education = ?,
        occupation = ?,
        notes = ?
      WHERE id = ?
    `

    return executeQuery(query, [
      data.nik,
      data.name,
      data.provinceCode,
      data.regencyCode,
      data.districtCode,
      data.address,
      data.phone,
      data.email,
      data.birthDate,
      data.income,
      data.education,
      data.occupation,
      data.notes,
      data.id,
    ])
  } else {
    // Create new person
    const query = `
      INSERT INTO people (
        nik, name, province_code, regency_code, district_code,
        address, phone, email, birth_date, income,
        education, occupation, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    return executeQuery(query, [
      data.nik,
      data.name,
      data.provinceCode,
      data.regencyCode,
      data.districtCode,
      data.address,
      data.phone,
      data.email,
      data.birthDate,
      data.income,
      data.education,
      data.occupation,
      data.notes,
    ])
  }
}

// Delete a person
export async function deletePerson(id) {
  const query = "DELETE FROM people WHERE id = ?"
  return executeQuery(query, [id])
}

// Fetch provinces
export async function fetchProvinces() {
  const query = "SELECT code, name FROM provinces ORDER BY name"
  return executeQuery(query)
}

// Fetch regencies by province code
export async function fetchRegencies(provinceCode) {
  const query = "SELECT code, name FROM regencies WHERE province_code = ? ORDER BY name"
  return executeQuery(query, [provinceCode])
}

// Fetch districts by regency code
export async function fetchDistricts(regencyCode) {
  const query = "SELECT code, name FROM districts WHERE regency_code = ? ORDER BY name"
  return executeQuery(query, [regencyCode])
}

// Fetch recap data based on type and filters
export async function fetchRecapData(recapType, filters = {}) {
  const { provinceCode, regencyCode, districtCode } = filters

  // Build WHERE clause for filters
  let whereClause = ""
  let params = []

  if (provinceCode) {
    whereClause += " AND p.province_code = ?"
    params.push(provinceCode)
  }

  if (regencyCode) {
    whereClause += " AND p.regency_code = ?"
    params.push(regencyCode)
  }

  if (districtCode) {
    whereClause += " AND p.district_code = ?"
    params.push(districtCode)
  }

  if (recapType === "age") {
    // Recap by age range
    const query = `
      SELECT 
        CASE 
          WHEN TIMESTAMPDIFF(YEAR, p.birth_date, CURDATE()) < 7 THEN '0-6'
          WHEN TIMESTAMPDIFF(YEAR, p.birth_date, CURDATE()) BETWEEN 7 AND 16 THEN '7-16'
          WHEN TIMESTAMPDIFF(YEAR, p.birth_date, CURDATE()) BETWEEN 17 AND 35 THEN '17-35'
          ELSE '36-99'
        END AS range,
        CASE 
          WHEN TIMESTAMPDIFF(YEAR, p.birth_date, CURDATE()) < 7 THEN '0-6 tahun'
          WHEN TIMESTAMPDIFF(YEAR, p.birth_date, CURDATE()) BETWEEN 7 AND 16 THEN '7-16 tahun'
          WHEN TIMESTAMPDIFF(YEAR, p.birth_date, CURDATE()) BETWEEN 17 AND 35 THEN '17-35 tahun'
          ELSE '36+ tahun'
        END AS label,
        COUNT(*) AS count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM people p WHERE 1=1 ${whereClause}), 2) AS percentage
      FROM people p
      WHERE 1=1 ${whereClause}
      GROUP BY range
      ORDER BY range
    `

    return executeQuery(query, params)
  }

  if (recapType === "income") {
    // Recap by income range
    const query = `
      SELECT 
        CASE 
          WHEN p.income < 1000000 THEN '0-1000000'
          WHEN p.income BETWEEN 1000000 AND 3000000 THEN '1000000-3000000'
          WHEN p.income BETWEEN 3000001 AND 5000000 THEN '3000000-5000000'
          WHEN p.income BETWEEN 5000001 AND 10000000 THEN '5000000-10000000'
          ELSE '10000000-999999999'
        END AS range,
        CASE 
          WHEN p.income < 1000000 THEN '< Rp 1.000.000'
          WHEN p.income BETWEEN 1000000 AND 3000000 THEN 'Rp 1.000.000 - Rp 3.000.000'
          WHEN p.income BETWEEN 3000001 AND 5000000 THEN 'Rp 3.000.000 - Rp 5.000.000'
          WHEN p.income BETWEEN 5000001 AND 10000000 THEN 'Rp 5.000.000 - Rp 10.000.000'
          ELSE '> Rp 10.000.000'
        END AS label,
        COUNT(*) AS count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM people p WHERE 1=1 ${whereClause}), 2) AS percentage
      FROM people p
      WHERE 1=1 ${whereClause}
      GROUP BY range
      ORDER BY CAST(SUBSTRING_INDEX(range, '-', 1) AS UNSIGNED)
    `

    return executeQuery(query, params)
  }

  if (recapType === "education") {
    // Recap by education level
    const query = `
      SELECT 
        p.education,
        COUNT(*) AS count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM people p WHERE 1=1 ${whereClause}), 2) AS percentage
      FROM people p
      WHERE 1=1 ${whereClause}
      GROUP BY p.education
      ORDER BY 
        CASE p.education
          WHEN 'SD' THEN 1
          WHEN 'SMP' THEN 2
          WHEN 'SMA/SMK' THEN 3
          WHEN 'D1' THEN 4
          WHEN 'D2' THEN 5
          WHEN 'D3' THEN 6
          WHEN 'S1' THEN 7
          WHEN 'S2' THEN 8
          WHEN 'S3' THEN 9
          ELSE 10
        END
    `

    return executeQuery(query, params)
  }

  if (recapType === "region") {
    // Determine which region level to group by
    let groupField, joinTable, codeField, nameField

    if (districtCode) {
      // Group by district (already filtered to specific district)
      return [
        {
          code: districtCode,
          name: (await executeQuery("SELECT name FROM districts WHERE code = ?", [districtCode]))[0]?.name || "Unknown",
          count:
            (await executeQuery(`SELECT COUNT(*) as count FROM people WHERE district_code = ?`, [districtCode]))[0]
              ?.count || 0,
          percentage: 100,
        },
      ]
    } else if (regencyCode) {
      // Group by districts within the selected regency
      groupField = "p.district_code"
      joinTable = "districts"
      codeField = "code"
      nameField = "name"
      whereClause = " AND p.regency_code = ?"
      params.push(regencyCode)
    } else if (provinceCode) {
      // Group by regencies within the selected province
      groupField = "p.regency_code"
      joinTable = "regencies"
      codeField = "code"
      nameField = "name"
      whereClause = " AND p.province_code = ?"
      params.push(provinceCode)
    } else {
      // Group by provinces
      groupField = "p.province_code"
      joinTable = "provinces"
      codeField = "code"
      nameField = "name"
      whereClause = ""
      params = []
    }

    const query = `
      SELECT 
        ${groupField} AS code,
        r.${nameField} AS name,
        COUNT(*) AS count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM people p WHERE 1=1 ${whereClause}), 2) AS percentage
      FROM people p
      JOIN ${joinTable} r ON ${groupField} = r.${codeField}
      WHERE 1=1 ${whereClause}
      GROUP BY ${groupField}, r.${nameField}
      ORDER BY r.${nameField}
    `

    return executeQuery(query, params)
  }

  return []
}

// Export data to Excel
export async function exportToExcel() {
  // Fetch all data
  const people = await fetchPeople()

  // Create CSV content
  let csvContent =
    "No,NIK,Nama,Provinsi,Kabupaten,Kecamatan,Alamat,Telp/HP,Email,Tgl Lahir,Usia,Pendapatan,Pendidikan,Pekerjaan,Keterangan\n"

  people.forEach((person, index) => {
    const birthDate = new Date(person.birthDate)
    const formattedBirthDate = birthDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })

    const age = calculateAge(person.birthDate)

    csvContent += `${index + 1},${person.nik},"${person.name}","${person.provinceCode} - ${person.provinceName}","${person.regencyCode} - ${person.regencyName}","${person.districtCode} - ${person.districtName}","${person.address}",${person.phone},${person.email},"${formattedBirthDate}",${age},${person.income},"${person.education}","${person.occupation}","${person.notes || ""}"\n`
  })

  // Return CSV content as a blob
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)

  // Create a link element and trigger download
  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", "data-penduduk.csv")
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Export recap data to Excel
export async function exportRecapToExcel(recapType, filters) {
  // Fetch recap data
  const recapData = await fetchRecapData(recapType, filters)

  // Create CSV content based on recap type
  let csvContent = ""

  if (recapType === "age") {
    csvContent = "Range Usia,Jumlah,Persentase\n"
    recapData.forEach((item) => {
      csvContent += `"${item.label}",${item.count},${item.percentage}%\n`
    })
  } else if (recapType === "income") {
    csvContent = "Range Pendapatan,Jumlah,Persentase\n"
    recapData.forEach((item) => {
      csvContent += `"${item.label}",${item.count},${item.percentage}%\n`
    })
  } else if (recapType === "education") {
    csvContent = "Tingkat Pendidikan,Jumlah,Persentase\n"
    recapData.forEach((item) => {
      csvContent += `"${item.education}",${item.count},${item.percentage}%\n`
    })
  } else if (recapType === "region") {
    csvContent = "Wilayah,Jumlah,Persentase\n"
    recapData.forEach((item) => {
      csvContent += `"${item.code} - ${item.name}",${item.count},${item.percentage}%\n`
    })
  }

  // Return CSV content as a blob
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)

  // Create a link element and trigger download
  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", `rekap-${recapType}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Helper function to calculate age from birth date
function calculateAge(birthDate) {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}
