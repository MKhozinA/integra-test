"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ListModule from "@/components/list-module"
import RecapModule from "@/components/recap-module"
import CrudModule from "@/components/crud-module" // Import CrudModule
import ViewDetail from "@/components/view-detail" // Import ViewDetail

export default function Home() {
  const [activeTab, setActiveTab] = useState("list")
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [selectedPerson, setSelectedPerson] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleEdit = (person) => {
    setSelectedPerson(person)
    setIsEditing(true)
    setActiveTab("crud")
  }

  const handleView = (person) => {
    setSelectedPerson(person)
    setIsEditing(false)
    setActiveTab("crud")
  }

  const handleAddNew = () => {
    setSelectedPerson(null)
    setIsEditing(true)
    setActiveTab("crud")
  }

  const handleCrudComplete = () => {
    setActiveTab("list")
    handleRefresh()
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Aplikasi Data Penduduk</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">List Data</TabsTrigger>
          <TabsTrigger value="crud">CRUD</TabsTrigger>
          <TabsTrigger value="recap">Rekap</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <ListModule
            refreshTrigger={refreshTrigger}
            onRefresh={handleRefresh}
            onEdit={handleEdit}
            onView={handleView}
            onAddNew={handleAddNew}
          />
        </TabsContent>

        <TabsContent value="crud">
          <div className="bg-white p-6 rounded-lg shadow-md">
            {isEditing ? (
              <CrudModule person={selectedPerson} onComplete={handleCrudComplete} />
            ) : (
              <ViewDetail person={selectedPerson} onBack={() => setActiveTab("list")} />
            )}
          </div>
        </TabsContent>

        <TabsContent value="recap">
          <RecapModule />
        </TabsContent>
      </Tabs>
    </main>
  )
}
