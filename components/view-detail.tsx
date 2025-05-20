"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, calculateAge } from "@/lib/utils"

export default function ViewDetail({ person, onBack }) {
  if (!person) {
    return (
      <div className="text-center py-10">
        <p>Data tidak ditemukan</p>
        <Button onClick={onBack} className="mt-4">
          Kembali
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Detail Data</h2>
        <Button onClick={onBack}>Kembali</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{person.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="font-semibold">NIK:</p>
              <p>{person.nik}</p>
            </div>

            <div className="space-y-2">
              <p className="font-semibold">Nama Lengkap:</p>
              <p>{person.name}</p>
            </div>

            <div className="space-y-2">
              <p className="font-semibold">Provinsi:</p>
              <p>{`${person.provinceCode} - ${person.provinceName}`}</p>
            </div>

            <div className="space-y-2">
              <p className="font-semibold">Kabupaten:</p>
              <p>{`${person.regencyCode} - ${person.regencyName}`}</p>
            </div>

            <div className="space-y-2">
              <p className="font-semibold">Kecamatan:</p>
              <p>{`${person.districtCode} - ${person.districtName}`}</p>
            </div>

            <div className="space-y-2">
              <p className="font-semibold">Alamat:</p>
              <p>{person.address}</p>
            </div>

            <div className="space-y-2">
              <p className="font-semibold">Telp/HP:</p>
              <p>{person.phone}</p>
            </div>

            <div className="space-y-2">
              <p className="font-semibold">Email:</p>
              <p>{person.email}</p>
            </div>

            <div className="space-y-2">
              <p className="font-semibold">Tanggal Lahir:</p>
              <p>
                {new Date(person.birthDate).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-semibold">Usia:</p>
              <p>{calculateAge(person.birthDate)} tahun</p>
            </div>

            <div className="space-y-2">
              <p className="font-semibold">Pendapatan:</p>
              <p>{formatCurrency(person.income)}</p>
            </div>

            <div className="space-y-2">
              <p className="font-semibold">Tingkat Pendidikan:</p>
              <p>{person.education}</p>
            </div>

            <div className="space-y-2">
              <p className="font-semibold">Jenis Pekerjaan:</p>
              <p>{person.occupation}</p>
            </div>

            <div className="space-y-2 col-span-1 md:col-span-2">
              <p className="font-semibold">Keterangan:</p>
              <p>{person.notes || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
