"use client"

import type React from "react"

import { useState } from "react"
import { Screen } from "@/components/Screen"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Clock, Plus, Edit, CheckCircle, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface ServicePackage {
  id: string
  name: string
  description: string
  duration: string
  features: string[]
  status: string
}

export default function ConsultantAdvisoryPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [editingService, setEditingService] = useState<ServicePackage | null>(null)
  const [viewingService, setViewingService] = useState<ServicePackage | null>(null)

  const [servicePackages, setServicePackages] = useState<ServicePackage[]>([
    {
      id: "investment-policy",
      name: "Investment Policy",
      description: "Development and implementation of comprehensive investment policies and guidelines",
      duration: "Ongoing",
      features: [
        "Investment policy statement development",
        "Asset allocation framework design",
        "Risk tolerance assessment",
        "Policy compliance monitoring",
        "Regular policy reviews and updates",
      ],
      status: "active",
    },
    {
      id: "manager-search",
      name: "Manager Search",
      description: "Comprehensive investment manager search and selection services",
      duration: "Project-based",
      features: [
        "Manager universe development",
        "Due diligence coordination",
        "Performance analysis and benchmarking",
        "Reference checks and background verification",
        "Selection recommendations and reporting",
      ],
      status: "active",
    },
    {
      id: "operational-due-diligence",
      name: "Operational Due Diligence",
      description: "In-depth operational risk assessment and due diligence services",
      duration: "Project-based",
      features: [
        "Operational risk assessment",
        "Compliance and regulatory review",
        "Technology and infrastructure evaluation",
        "Business continuity planning review",
        "Operational best practices benchmarking",
      ],
      status: "active",
    },
  ])

  // Form states
  const [newServiceForm, setNewServiceForm] = useState({
    name: "",
    description: "",
    duration: "",
    features: "",
    status: "active",
  })

  const [editServiceForm, setEditServiceForm] = useState({
    name: "",
    description: "",
    duration: "",
    features: "",
    status: "active",
  })

  // Handlers
  const handleCreateNewService = () => {
    setShowCreateModal(true)
    setNewServiceForm({
      name: "",
      description: "",
      duration: "",
      features: "",
      status: "active",
    })
  }

  const handleEditService = (service: ServicePackage) => {
    setEditingService(service)
    setEditServiceForm({
      name: service.name,
      description: service.description,
      duration: service.duration,
      features: service.features.join("\n"),
      status: service.status,
    })
    setShowEditModal(true)
  }

  const handleViewDetails = (service: ServicePackage) => {
    setViewingService(service)
    setShowDetailsModal(true)
  }

  const handleViewTemplates = (service: ServicePackage) => {
    alert(
      `Templates functionality for ${service.name} would be implemented here. This could include:\n\n• Service agreement templates\n• Proposal templates\n• Reporting templates\n• Client communication templates`,
    )
  }

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newService: ServicePackage = {
      id: newServiceForm.name.toLowerCase().replace(/\s+/g, "-"),
      name: newServiceForm.name,
      description: newServiceForm.description,
      duration: newServiceForm.duration,
      features: newServiceForm.features.split("\n").filter((f) => f.trim()),
      status: newServiceForm.status,
    }
    setServicePackages([...servicePackages, newService])
    setShowCreateModal(false)
    alert(`Successfully created new service: ${newService.name}`)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingService) return

    const updatedServices = servicePackages.map((service) =>
      service.id === editingService.id
        ? {
            ...service,
            name: editServiceForm.name,
            description: editServiceForm.description,
            duration: editServiceForm.duration,
            features: editServiceForm.features.split("\n").filter((f) => f.trim()),
            status: editServiceForm.status,
          }
        : service,
    )
    setServicePackages(updatedServices)
    setShowEditModal(false)
    setEditingService(null)
    alert(`Successfully updated service: ${editServiceForm.name}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "beta":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <Screen title="Advisory Services" description="Manage your service offerings and consulting packages">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Service Offerings</h3>
          <Button onClick={handleCreateNewService}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Service
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {servicePackages.map((service) => (
            <Card
              key={service.id}
              className={cn(
                "border-l-4 border-l-electric-blue h-full flex flex-col",
                selectedService === service.id ? "ring-2 ring-electric-blue/50" : "",
              )}
            >
              <CardHeader className="flex-shrink-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                        getStatusColor(service.status),
                      )}
                    >
                      {getStatusIcon(service.status)}
                      {service.status}
                    </div>
                  </div>
                </div>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Service Type: {service.duration}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Features Included:</h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 mt-auto">
                  <Button size="sm" onClick={() => handleEditService(service)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Service
                  </Button>

                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(service)}>
                    View Details
                  </Button>

                  <Button variant="outline" size="sm" onClick={() => handleViewTemplates(service)}>
                    <FileText className="h-4 w-4 mr-2" />
                    Templates
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>

      {/* Create New Service Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Advisory Service</DialogTitle>
            <DialogDescription>Define a new service offering for your consulting practice.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="service-name">Service Name</Label>
                <Input
                  id="service-name"
                  value={newServiceForm.name}
                  onChange={(e) => setNewServiceForm({ ...newServiceForm, name: e.target.value })}
                  placeholder="e.g., Portfolio Management"
                  className="bg-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="service-duration">Service Type</Label>
                <Select
                  value={newServiceForm.duration}
                  onValueChange={(value) => setNewServiceForm({ ...newServiceForm, duration: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                    <SelectItem value="Project-based">Project-based</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="service-description">Description</Label>
              <Textarea
                id="service-description"
                value={newServiceForm.description}
                onChange={(e) => setNewServiceForm({ ...newServiceForm, description: e.target.value })}
                placeholder="Describe your service offering..."
                className="bg-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="service-features">Features (one per line)</Label>
              <Textarea
                id="service-features"
                value={newServiceForm.features}
                onChange={(e) => setNewServiceForm({ ...newServiceForm, features: e.target.value })}
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                rows={5}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Service</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Service Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Advisory Service</DialogTitle>
            <DialogDescription>Update your service offering details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-service-name">Service Name</Label>
                <Input
                  id="edit-service-name"
                  value={editServiceForm.name}
                  onChange={(e) => setEditServiceForm({ ...editServiceForm, name: e.target.value })}
                  className="bg-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-service-duration">Service Type</Label>
                <Select
                  value={editServiceForm.duration}
                  onValueChange={(value) => setEditServiceForm({ ...editServiceForm, duration: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                    <SelectItem value="Project-based">Project-based</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-service-description">Description</Label>
              <Textarea
                id="edit-service-description"
                value={editServiceForm.description}
                onChange={(e) => setEditServiceForm({ ...editServiceForm, description: e.target.value })}
                className="bg-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-service-features">Features (one per line)</Label>
              <Textarea
                id="edit-service-features"
                value={editServiceForm.features}
                onChange={(e) => setEditServiceForm({ ...editServiceForm, features: e.target.value })}
                className="bg-white"
                rows={5}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewingService?.name}</DialogTitle>
            <DialogDescription>Detailed information about this service offering.</DialogDescription>
          </DialogHeader>
          {viewingService && (
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{viewingService.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Service Type</h4>
                  <p className="text-sm">{viewingService.duration}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Status</h4>
                  <div
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                      getStatusColor(viewingService.status),
                    )}
                  >
                    {getStatusIcon(viewingService.status)}
                    {viewingService.status}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Features Included</h4>
                <ul className="space-y-2">
                  {viewingService.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowDetailsModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Screen>
  )
}
