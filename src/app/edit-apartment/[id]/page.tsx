'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useApartmentStore } from '@/store/apartment/aparmentStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function EditPropertyPage() {
  const { id } = useParams()
  const router = useRouter()
  const { fetchApartmentById } = useApartmentStore()
  const [apartment, setApartment] = useState<Apartment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchApartment = async () => {
      if (id) {
        try {
          const data = await fetchApartmentById(Number(id))
          if (data) {
            setApartment(data)
          } else {
            setError('Apartment not found')
          }
        } catch (err) {
          setError('Failed to fetch apartment')
        } finally {
          setLoading(false)
        }
      }
    }

    fetchApartment()
  }, [id, fetchApartmentById])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setApartment(prev => prev ? { ...prev, [name]: value } : null)
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setApartment(prev => prev ? { ...prev, [name]: value } : null)
  }

  const handleCheckboxChange = (name: string) => (checked: boolean) => {
    setApartment(prev => prev ? { ...prev, [name]: checked } : null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Implement the update logic here
    console.log('Updated apartment:', apartment)
    // After successful update, redirect to the properties list
    router.push('/properties')
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!apartment) return <div>No apartment found</div>

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Property</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={apartment.title} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" name="price" type="number" value={apartment.price} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rooms">Rooms</Label>
              <Input id="rooms" name="rooms" type="number" value={apartment.rooms} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="square_area">Square Area</Label>
              <Input id="square_area" name="square_area" type="number" value={apartment.square_area} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="action_type">Action Type</Label>
              <Select name="action_type" value={apartment.action_type} onValueChange={handleSelectChange('action_type')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select action type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="current_status">Current Status</Label>
              <Select name="current_status" value={apartment.current_status} onValueChange={handleSelectChange('current_status')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="soon">Soon</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="house_condition">House Condition</Label>
              <Select name="house_condition" value={apartment.house_condition} onValueChange={handleSelectChange('house_condition')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select house condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new_building">New Building</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="needs_repair">Needs Repair</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="house_type">House Type</Label>
              <Select name="house_type" value={apartment.house_type} onValueChange={handleSelectChange('house_type')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select house type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={apartment.description} onChange={handleInputChange} />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="furnished" checked={apartment.furnished} onCheckedChange={handleCheckboxChange('furnished')} />
            <Label htmlFor="furnished">Furnished</Label>
          </div>
          <Button type="submit">Update Property</Button>
        </form>
      </CardContent>
    </Card>
  )
}

