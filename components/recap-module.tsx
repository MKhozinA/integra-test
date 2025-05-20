"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileSpreadsheet } from "lucide-react"

export default function RecapModule() {
  const [recapType, setRecapType] = useState("age")
  const [provinces, setProvinces] = useState([])
  const [regencies, setRegencies] = useState([])
  const [districts, setDistricts] = useState([])
  const [selectedProvince, setSelectedProvince] = useState("all")
  const [selectedRegency, setSelectedRegency] = useState("all")
  const [selectedDistrict, setSelectedDistrict] = useState("all")
  const [recapData, setRecapData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadProvinces()
    loadMockData()
  }, [])

  useEffect(() => {
    if (selectedProvince !== "all") {
      loadRegencies(selectedProvince)
    } else {
      setRegencies([])
      setSelectedRegency("all")
    }
  }, [selectedProvince])

  useEffect(() => {
    if (selectedRegency !== "all") {
      loadDistricts(selectedRegency)
    } else {
      setDistricts([])
      setSelectedDistrict("all")
    }
  }, [selectedRegency])

  useEffect(() => {
    loadMockData()
  }, [recapType, selectedProvince, selectedRegency, selectedDistrict])

  const loadProvinces = async () => {
    try {
      // For demo purposes, we'll use mock data
      setProvinces([
        { code: "31", name: "DKI JAKARTA" },
        { code: "32", name: "JAWA BARAT" },
        { code: "33", name: "JAWA TENGAH" },
      ])
    } catch (error) {
      console.error("Error loading provinces:", error)
    }
  }

  const loadRegencies = async (provinceCode) => {
    try {
      // For demo purposes, we'll use mock data
      if (provinceCode === "31") {
        setRegencies([
          { code: "3171", name: "KOTA JAKARTA PUSAT" },
          { code: "3172", name: "KOTA JAKARTA UTARA" },
        ])
      } else if (provinceCode === "32") {
        setRegencies([
          { code: "3201", name: "KABUPATEN BOGOR" },
          { code: "3273", name: "KOTA BANDUNG" },
        ])
      } else {
        setRegencies([
          { code: "3301", name: "KABUPATEN CILACAP" },
          { code: "3302", name: "KABUPATEN BANYUMAS" },
        ])
      }
    } catch (error) {
      console.error("Error loading regencies:", error)
    }
  }

  const loadDistricts = async (regencyCode) => {
    try {
      // For demo purposes, we'll use mock data
      if (regencyCode === "3171") {
        setDistricts([
          { code: "317101", name: "TANAH ABANG" },
          { code: "317102", name: "MENTENG" },
        ])
      } else if (regencyCode === "3172") {
        setDistricts([
          { code: "317201", name: "PENJARINGAN" },
          { code: "317202", name: "PADEMANGAN" },
        ])
      } else {
        setDistricts([
          { code: "320101", name: "BOGOR SELATAN" },
          { code: "320102", name: "BOGOR TIMUR" },
        ])
      }
    } catch (error) {
      console.error("Error loading districts:", error)
    }
  }

  const loadMockData = () => {
    setLoading(true)

    // Generate mock data based on recap type
    let mockData = []

    if (recapType === "age") {
      mockData = [
        { range: "0-6", label: "0-6 tahun", count: 3, percentage: 15 },
        { range: "7-16", label: "7-16 tahun", count: 5, percentage: 25 },
        { range: "17-35", label: "17-35 tahun", count: 8, percentage: 40 },
        { range: "36-99", label: "36+ tahun", count: 4, percentage: 20 },
      ]
    } else if (recapType === "income") {
      mockData = [
        { range: "0-1000000", label: "< Rp 1.000.000", count: 2, percentage: 10 },
        { range: "1000000-3000000", label: "Rp 1.000.000 - Rp 3.000.000", count: 6, percentage: 30 },
        { range: "3000000-5000000", label: "Rp 3.000.000 - Rp 5.000.000", count: 7, percentage: 35 },
        { range: "5000000-10000000", label: "Rp 5.000.000 - Rp 10.000.000", count: 3, percentage: 15 },
        { range: "10000000-999999999", label: "> Rp 10.000.000", count: 2, percentage: 10 },
      ]
    } else if (recapType === "education") {
      mockData = [
        { education: "SD", count: 3, percentage: 15 },
        { education: "SMP", count: 2, percentage: 10 },
        { education: "SMA/SMK", count: 5, percentage: 25 },
        { education: "D3", count: 2, percentage: 10 },
        { education: "S1", count: 6, percentage: 30 },
        { education: "S2", count: 2, percentage: 10 },
      ]
    } else if (recapType === "region") {
      if (selectedProvince === "all") {
        mockData = [
          { code: "31", name: "DKI JAKARTA", count: 10, percentage: 50 },
          { code: "32", name: "JAWA BARAT", count: 6, percentage: 30 },
          { code: "33", name: "JAWA TENGAH", count: 4, percentage: 20 },
        ]
      } else if (selectedRegency === "all") {
        mockData = [
          { code: "3171", name: "KOTA JAKARTA PUSAT", count: 6, percentage: 60 },
          { code: "3172", name: "KOTA JAKARTA UTARA", count: 4, percentage: 40 },
        ]
      } else if (selectedDistrict === "all") {
        mockData = [
          { code: "317101", name: "TANAH ABANG", count: 3, percentage: 50 },
          { code: "317102", name: "MENTENG", count: 3, percentage: 50 },
        ]
      } else {
        mockData = [{ code: selectedDistrict, name: "TANAH ABANG", count: 3, percentage: 100 }]
      }
    }

    setRecapData(mockData)
    setLoading(false)
  }

  const handleExport = () => {
    // Create a simple CSV string
    let csvContent = ""

    // Add headers based on recap type
    if (recapType === "age") {
      csvContent = "Range Usia,Jumlah,Persentase\n"
      recapData.forEach((item) => {
        csvContent += `${item.label},${item.count},${item.percentage}%\n`
      })
    } else if (recapType === "income") {
      csvContent = "Range Pendapatan,Jumlah,Persentase\n"
      recapData.forEach((item) => {
        csvContent += `${item.label},${item.count},${item.percentage}%\n`
      })
    } else if (recapType === "education") {
      csvContent = "Tingkat Pendidikan,Jumlah,Persentase\n"
      recapData.forEach((item) => {
        csvContent += `${item.education},${item.count},${item.percentage}%\n`
      })
    } else if (recapType === "region") {
      csvContent = "Wilayah,Jumlah,Persentase\n"
      recapData.forEach((item) => {
        csvContent += `${item.code} - ${item.name},${item.count},${item.percentage}%\n`
      })
    }

    // Create a Blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `rekap-${recapType}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const renderRecapTable = () => {
    if (loading) {
      return <p className="text-center py-10">Memuat data...</p>
    }

    if (recapData.length === 0) {
      return <p className="text-center py-10">Tidak ada data</p>
    }

    if (recapType === "age") {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Range Usia</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Persentase</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recapData.map((item) => (
              <TableRow key={item.range}>
                <TableCell>{item.label}</TableCell>
                <TableCell>{item.count}</TableCell>
                <TableCell>{item.percentage}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )
    }

    if (recapType === "income") {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Range Pendapatan</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Persentase</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recapData.map((item) => (
              <TableRow key={item.range}>
                <TableCell>{item.label}</TableCell>
                <TableCell>{item.count}</TableCell>
                <TableCell>{item.percentage}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )
    }

    if (recapType === "education") {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tingkat Pendidikan</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Persentase</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recapData.map((item) => (
              <TableRow key={item.education}>
                <TableCell>{item.education}</TableCell>
                <TableCell>{item.count}</TableCell>
                <TableCell>{item.percentage}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )
    }

    if (recapType === "region") {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Wilayah</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Persentase</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recapData.map((item) => (
              <TableRow key={item.code}>
                <TableCell>{`${item.code} - ${item.name}`}</TableCell>
                <TableCell>{item.count}</TableCell>
                <TableCell>{item.percentage}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Rekap Data</h2>
        <Button variant="outline" onClick={handleExport}>
          <FileSpreadsheet className="mr-2 h-4 w-4" /> Export Excel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div>
          <Select value={recapType} onValueChange={setRecapType}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih jenis rekap" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="age">Range Usia</SelectItem>
              <SelectItem value="income">Range Pendapatan</SelectItem>
              <SelectItem value="education">Tingkat Pendidikan</SelectItem>
              <SelectItem value="region">Wilayah</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={selectedProvince} onValueChange={setSelectedProvince}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih provinsi (opsional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Provinsi</SelectItem>
              {provinces.map((province) => (
                <SelectItem key={province.code} value={province.code}>
                  {province.code} - {province.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={selectedRegency} onValueChange={setSelectedRegency} disabled={selectedProvince === "all"}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih kabupaten (opsional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kabupaten</SelectItem>
              {regencies.map((regency) => (
                <SelectItem key={regency.code} value={regency.code}>
                  {regency.code} - {regency.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={selectedDistrict} onValueChange={setSelectedDistrict} disabled={selectedRegency === "all"}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih kecamatan (opsional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kecamatan</SelectItem>
              {districts.map((district) => (
                <SelectItem key={district.code} value={district.code}>
                  {district.code} - {district.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {recapType === "age" && "Rekap Berdasarkan Range Usia"}
            {recapType === "income" && "Rekap Berdasarkan Range Pendapatan"}
            {recapType === "education" && "Rekap Berdasarkan Tingkat Pendidikan"}
            {recapType === "region" && "Rekap Berdasarkan Wilayah"}
          </CardTitle>
        </CardHeader>
        <CardContent>{renderRecapTable()}</CardContent>
      </Card>
    </div>
  )
}
