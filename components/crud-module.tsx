"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchProvinces, fetchRegencies, fetchDistricts, savePerson } from "@/lib/data-actions"

const formSchema = z.object({
  nik: z.string().length(16, "NIK harus 16 digit").regex(/^\d+$/, "NIK hanya boleh berisi angka"),
  name: z.string().min(2, "Nama minimal 2 karakter"),
  provinceCode: z.string().min(1, "Provinsi harus dipilih"),
  regencyCode: z.string().min(1, "Kabupaten harus dipilih"),
  districtCode: z.string().min(1, "Kecamatan harus dipilih"),
  address: z.string().min(5, "Alamat minimal 5 karakter"),
  phone: z
    .string()
    .min(8, "Nomor telepon minimal 8 digit")
    .max(14, "Nomor telepon maksimal 14 digit")
    .regex(/^\d+$/, "Nomor telepon hanya boleh berisi angka"),
  email: z.string().email("Format email tidak valid"),
  birthDate: z.string().min(1, "Tanggal lahir harus diisi"),
  income: z.string().min(1, "Pendapatan harus diisi").regex(/^\d+$/, "Pendapatan hanya boleh berisi angka"),
  education: z.string().min(1, "Pendidikan harus dipilih"),
  occupation: z.string().min(2, "Pekerjaan minimal 2 karakter"),
  notes: z.string().optional(),
})

const educationLevels = ["SD", "SMP", "SMA/SMK", "D1", "D2", "D3", "S1", "S2", "S3"]

export default function CrudModule({ person, onComplete }) {
  const [provinces, setProvinces] = useState([])
  const [regencies, setRegencies] = useState([])
  const [districts, setDistricts] = useState([])
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nik: person?.nik || "",
      name: person?.name || "",
      provinceCode: person?.provinceCode || "",
      regencyCode: person?.regencyCode || "",
      districtCode: person?.districtCode || "",
      address: person?.address || "",
      phone: person?.phone || "",
      email: person?.email || "",
      birthDate: person?.birthDate ? new Date(person.birthDate).toISOString().split("T")[0] : "",
      income: person?.income ? person.income.toString() : "",
      education: person?.education || "",
      occupation: person?.occupation || "",
      notes: person?.notes || "",
    },
  })

  useEffect(() => {
    loadProvinces()
  }, [])

  useEffect(() => {
    const provinceCode = form.watch("provinceCode")
    if (provinceCode) {
      loadRegencies(provinceCode)
    } else {
      setRegencies([])
      form.setValue("regencyCode", "")
      form.setValue("districtCode", "")
    }
  }, [form.watch("provinceCode")])

  useEffect(() => {
    const regencyCode = form.watch("regencyCode")
    if (regencyCode) {
      loadDistricts(regencyCode)
    } else {
      setDistricts([])
      form.setValue("districtCode", "")
    }
  }, [form.watch("regencyCode")])

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

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      // Convert income to number
      data.income = Number.parseInt(data.income, 10)

      // Add id if editing
      if (person?.id) {
        data.id = person.id
      }

      await savePerson(data)
      onComplete()
    } catch (error) {
      console.error("Error saving person:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{person ? "Edit Data" : "Tambah Data Baru"}</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="nik"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIK</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan 16 digit NIK" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama lengkap" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="provinceCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provinsi</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih provinsi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {provinces.map((province) => (
                        <SelectItem key={province.code} value={province.code}>
                          {province.code} - {province.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="regencyCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kabupaten</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!form.watch("provinceCode")}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kabupaten" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {regencies.map((regency) => (
                        <SelectItem key={regency.code} value={regency.code}>
                          {regency.code} - {regency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="districtCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kecamatan</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!form.watch("regencyCode")}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kecamatan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district.code} value={district.code}>
                          {district.code} - {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Masukkan alamat lengkap" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telp/HP</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nomor telepon" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan alamat email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Lahir</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="income"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pendapatan</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan pendapatan per bulan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="education"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tingkat Pendidikan</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tingkat pendidikan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {educationLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Pekerjaan</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan jenis pekerjaan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormLabel>Keterangan</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Masukkan keterangan tambahan (opsional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onComplete}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
