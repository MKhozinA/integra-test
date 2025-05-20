"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileSpreadsheet } from "lucide-react"
import { fetchProvinces, fetchRegencies, fetchDistricts, fetchRecapData, exportRecapToExcel } from "@/lib/data-actions"

const ageRanges = [
  { id: "0-6", label: "0-6 tahun" },
  { id: "7-16", label: "7-16 tahun" },
  { id: "17-35", label: "17-35 tahun" },
  { id: "36-99", label: "36+ tahun" },
]

const incomeRanges = [
  { id: "0-1000000", label: "< Rp 1.000.000" },
  { id: "1000000-3000000", label: "Rp 1.000.000 - Rp 3.000.000" },
  { id: "3000000-5000000", label: "Rp 3.000.000 - Rp 5.000.000" },
  { id: "5000000-10000000", label: "Rp 5.000.000 - Rp 10.000.000" },
  { id: "10000000-999999999", label: "> Rp 10.000.000" },
]

const educationLevels = ["SD", "SMP", "SMA/SMK", "D1", "D2", "D3", "S1", "S2", "S3"]

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
    loadRecapData()
  }, [recapType, selectedProvince, selectedRegency, selectedDistrict])

  const loadProvinces = async () => {
    try {
      const data = await fetchProvinces()
      setProvinces(data)
    } catch (error) {
      console.error("Error loading provinces:", error)
    }
  }

  const loadRegencies = async (provinceCode) => {
    try {
      const data = await fetchRegencies(provinceCode)
      setRegencies(data)
    } catch (error) {
      console.error("Error loading regencies:", error)
    }
  }

  const loadDistricts = async (regencyCode) => {
    try {
      const data = await fetchDistricts(regencyCode)
      setDistricts(data)
    } catch (error) {
      console.error("Error loading districts:", error)
    }
  }

  const loadRecapData = async () => {
    setLoading(true)
    try {
      const filters = {
        provinceCode: selectedProvince,
        regencyCode: selectedRegency,
        districtCode: selectedDistrict,
      }

      const data = await fetchRecapData(recapType, filters)
      setRecapData(data)
    } catch (error) {
      console.error("Error loading recap data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const filters = {
        provinceCode: selectedProvince,
        regencyCode: selectedRegency,
        districtCode: selectedDistrict,
      }

      await exportRecapToExcel(recapType, filters)
    } catch (error) {
      console.error("Error exporting to Excel:", error)
    }
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
