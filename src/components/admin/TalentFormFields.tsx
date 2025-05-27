import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TalentFormFieldsProps {
  formData: any;
  setFormData: (val: any) => void;
}

const serviceOptions = [
  'House Cleaning', 'Deep Cleaning', 'Office Cleaning', 'Personal Driver',
  'Delivery Driver', 'Airport Transport', 'Babysitting', 'Child Care',
  'Tutoring', 'Elderly Care', 'Companion Care', 'Medical Assistance',
  'Laundry Service', 'Ironing', 'Dry Cleaning Pickup'
];

const TalentFormFields = ({ formData, setFormData }: TalentFormFieldsProps) => (
  <div className="space-y-4">
    <div>
      <Label htmlFor="fullName">Full Name *</Label>
      <Input
        id="fullName"
        value={formData.full_name}
        onChange={(e) => setFormData((prev: any) => ({ ...prev, full_name: e.target.value }))}
        required
      />
    </div>
    <div>
      <Label htmlFor="phone">Phone *</Label>
      <Input
        id="phone"
        value={formData.phone}
        onChange={(e) => setFormData((prev: any) => ({ ...prev, phone: e.target.value }))}
        required
      />
    </div>
    <div>
      <Label htmlFor="address">Address *</Label>
      <Input
        id="address"
        value={formData.address}
        onChange={(e) => setFormData((prev: any) => ({ ...prev, address: e.target.value }))}
        required
      />
    </div>
    <div>
      <Label htmlFor="service">Service *</Label>
      <Select
        onValueChange={(value) => setFormData((prev: any) => ({ ...prev, services: [value] }))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a service" />
        </SelectTrigger>
        <SelectContent>
          {serviceOptions.map((service) => (
            <SelectItem key={service} value={service}>
              {service}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label htmlFor="experience">Experience</Label>
      <Select
        onValueChange={(value) => setFormData((prev: any) => ({ ...prev, experience: value }))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Years of experience" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="less-than-1">Less than 1 year</SelectItem>
          <SelectItem value="1-2">1-2 years</SelectItem>
          <SelectItem value="3-5">3-5 years</SelectItem>
          <SelectItem value="5-10">5-10 years</SelectItem>
          <SelectItem value="more-than-10">More than 10 years</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label htmlFor="hourly_rate">Preferred Daily Rate (PHP)</Label>
      <Input
        id="hourly_rate"
        type="number"
        min="300"
        value={formData.hourly_rate || ''}
        onChange={(e) => setFormData((prev: any) => ({ ...prev, hourly_rate: parseFloat(e.target.value) }))}
      />
    </div>
    <div>
      <Label htmlFor="availability">Availability</Label>
      <Select
        onValueChange={(value) => setFormData((prev: any) => ({ ...prev, availability: value }))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select your availability" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="full-time">Full-time</SelectItem>
          <SelectItem value="part-time">Part-time</SelectItem>
          <SelectItem value="weekends">Weekends only</SelectItem>
          <SelectItem value="flexible">Flexible schedule</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label htmlFor="description">Description</Label>
      <Textarea
        id="description"
        value={formData.description || ''}
        onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
      />
    </div>
  </div>
);

export default TalentFormFields;
