"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function SecureDocumentCenterPage() {
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState({
    year: null as number | null,
    quarter: null as string | null,
    documentType: [] as string[],
    managers: [] as string[],
    consultants: [] as string[],
  })

  const clearFilters = () => {
    setFilters({
      year: null,
      quarter: null,
      documentType: [],
      managers: [],
      consultants: [],
    })
  }

  return (
    <div>
      <h1>Secure Document Center</h1>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Open Filters</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
            <DialogDescription>Apply filters to the document list.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div>
              <Label className="text-sm font-medium">Year</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                onChange={(e) => {
                  const year = e.target.value === "" ? null : Number.parseInt(e.target.value)
                  setFilters({ ...filters, year: year })
                }}
                value={filters.year || ""}
              >
                <option value="">All Years</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
              </select>
            </div>
            <div>
              <Label className="text-sm font-medium">Quarter</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                onChange={(e) => {
                  const quarter = e.target.value === "" ? null : e.target.value
                  setFilters({ ...filters, quarter: quarter })
                }}
                value={filters.quarter || ""}
              >
                <option value="">All Quarters</option>
                <option value="Q1">Q1</option>
                <option value="Q2">Q2</option>
                <option value="Q3">Q3</option>
                <option value="Q4">Q4</option>
              </select>
            </div>
            <div>
              <Label className="text-sm font-medium">Document Type</Label>
              <div className="space-y-2 mt-2">
                {["Performance Report", "Capital Call Notice", "Distribution Notice"].map((docType) => (
                  <div key={docType} className="flex items-center space-x-2">
                    <Checkbox
                      id={docType}
                      checked={filters.documentType.includes(docType)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters({
                            ...filters,
                            documentType: [...filters.documentType, docType],
                          })
                        } else {
                          setFilters({
                            ...filters,
                            documentType: filters.documentType.filter((dt) => dt !== docType),
                          })
                        }
                      }}
                    />
                    <Label htmlFor={docType} className="text-sm">
                      {docType}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium mb-3 block">Manager</Label>
              <p className="text-xs text-baseGray mb-3">Select which manager's documents to view</p>
              <div className="space-y-3">
                {[
                  { id: "blackrock", name: "BlackRock", description: "BlackRock Investment Management" },
                  { id: "vanguard", name: "Vanguard", description: "The Vanguard Group" },
                  { id: "state-street", name: "State Street", description: "State Street Global Advisors" },
                  { id: "fidelity", name: "Fidelity", description: "Fidelity Investments" },
                  { id: "trowe-price", name: "T. Rowe Price", description: "T. Rowe Price Investment Management" },
                ].map((manager) => (
                  <div key={manager.id} className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id={`manager-${manager.id}`}
                      name="manager-access"
                      className="mt-1"
                      checked={filters.managers.includes(manager.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters({ ...filters, managers: [...filters.managers, manager.name] })
                        } else {
                          setFilters({
                            ...filters,
                            managers: filters.managers.filter((m) => m !== manager.name),
                          })
                        }
                      }}
                    />
                    <div className="flex-1">
                      <Label htmlFor={`manager-${manager.id}`} className="text-sm font-medium cursor-pointer block">
                        {manager.name}
                      </Label>
                      <p className="text-xs text-baseGray mt-0.5">{manager.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Consultant</Label>
              <p className="text-xs text-baseGray mb-3">Select which consultant's documents to view</p>
              <div className="space-y-3">
                {[
                  { id: "mercer", name: "Mercer", description: "Mercer Investment Consulting" },
                  { id: "aon", name: "Aon", description: "Aon Investment Consulting" },
                  { id: "willis-towers", name: "Willis Towers Watson", description: "Willis Towers Watson Investment" },
                  {
                    id: "cambridge",
                    name: "Cambridge Associates",
                    description: "Cambridge Associates Investment Consulting",
                  },
                  { id: "nepc", name: "NEPC", description: "NEPC Investment Consulting" },
                ].map((consultant) => (
                  <div key={consultant.id} className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id={`consultant-${consultant.id}`}
                      name="consultant-access"
                      className="mt-1"
                      checked={filters.consultants.includes(consultant.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters({ ...filters, consultants: [...filters.consultants, consultant.name] })
                        } else {
                          setFilters({
                            ...filters,
                            consultants: filters.consultants.filter((c) => c !== consultant.name),
                          })
                        }
                      }}
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={`consultant-${consultant.id}`}
                        className="text-sm font-medium cursor-pointer block"
                      >
                        {consultant.name}
                      </Label>
                      <p className="text-xs text-baseGray mt-0.5">{consultant.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={clearFilters}>
              Clear Filters
            </Button>
            <DialogClose asChild>
              <Button type="submit">Apply Filters</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
