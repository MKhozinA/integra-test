"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Pencil, Trash2, RefreshCw, Plus, FileSpreadsheet } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { fetchPeople, deletePerson } from "@/lib/data-actions"
import { formatCurrency, calculateAge } from "@/lib/utils"

export default function ListModule({ refreshTrigger, onRefresh, onEdit, onView, onAddNew }) {
  const [people, setPeople] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name-asc")
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [personToDelete, setPersonToDelete] = useState(null)

  useEffect(() => {
    loadData()
  }, [refreshTrigger, searchTerm, sortBy])

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await fetchPeople(searchTerm, sortBy)
      setPeople(data)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!personToDelete) return

    try {
      await deletePerson(personToDelete.id)
      setDeleteDialog(false)
      onRefresh()
    } catch (error) {
      console.error("Error deleting person:", error)
    }
  }

  const confirmDelete = (person) => {
    setPersonToDelete(person)
    setDeleteDialog(true)
  }

  const handleExport = async () => {
    try {
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

      // Create a blob and download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "data-penduduk.csv")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error exporting to Excel:", error)
    }
  }

  const getRowColor = (birthDate) => {
    const age = calculateAge(birthDate)

    if (age < 7) return "bg-pink-100"
    if (age >= 7 && age <= 16) return "bg-yellow-100"
    if (age >= 17 && age <= 35) return "bg-green-100"
    return "bg-blue-100"
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="w-full md:w-1/3">
          <Input
            placeholder="Cari berdasarkan nama, alamat, dll..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full md:w-1/3">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Urutkan berdasarkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Nama (A-Z)</SelectItem>
              <SelectItem value="name-desc">Nama (Z-A)</SelectItem>
              <SelectItem value="age-asc">Usia (Terendah)</SelectItem>
              <SelectItem value="age-desc">Usia (Tertinggi)</SelectItem>
              <SelectItem value="income-asc">Pendapatan (Terendah)</SelectItem>
              <SelectItem value="income-desc">Pendapatan (Tertinggi)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button onClick={onAddNew}>
            <Plus className="mr-2 h-4 w-4" /> Tambah
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Export Excel
          </Button>
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>NIK</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Provinsi</TableHead>
              <TableHead>Kabupaten</TableHead>
              <TableHead>Kecamatan</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead>Telp/HP</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tgl Lahir</TableHead>
              <TableHead>Usia</TableHead>
              <TableHead>Pendapatan</TableHead>
              <TableHead>Pendidikan</TableHead>
              <TableHead>Pekerjaan</TableHead>
              <TableHead>Keterangan</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={16} className="text-center py-10">
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : people.length === 0 ? (
              <TableRow>
                <TableCell colSpan={16} className="text-center py-10">
                  Tidak ada data
                </TableCell>
              </TableRow>
            ) : (
              people.map((person, index) => (
                <TableRow key={person.id} className={getRowColor(person.birthDate)}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{person.nik}</TableCell>
                  <TableCell>{person.name}</TableCell>
                  <TableCell>{`${person.provinceCode} - ${person.provinceName}`}</TableCell>
                  <TableCell>{`${person.regencyCode} - ${person.regencyName}`}</TableCell>
                  <TableCell>{`${person.districtCode} - ${person.districtName}`}</TableCell>
                  <TableCell>{person.address}</TableCell>
                  <TableCell>{person.phone}</TableCell>
                  <TableCell>{person.email}</TableCell>
                  <TableCell>
                    {new Date(person.birthDate).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>{calculateAge(person.birthDate)}</TableCell>
                  <TableCell>{formatCurrency(person.income)}</TableCell>
                  <TableCell>{person.education}</TableCell>
                  <TableCell>{person.occupation}</TableCell>
                  <TableCell>{person.notes}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => onView(person)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => onEdit(person)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => confirmDelete(person)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus data {personToDelete?.name}? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
