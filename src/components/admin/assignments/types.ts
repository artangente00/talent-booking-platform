
export interface Booking {
  id: string;
  service_type: string;
  service_address: string;
  booking_date: string;
  booking_time: string;
  status: string;
  booking_status: string;
  assigned_talent_id: string | null;
  customers: {
    first_name: string | null;
    middle_name: string | null;
    last_name: string | null;
    city_municipality: string | null;
  } | null;
  created_at: string;
  updated_at: string;
  special_instructions: string | null;
  duration: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
}

export interface BookingWithCustomer {
  id: string;
  booking_date: string;
  booking_time: string;
  service_address: string;
  service_type: string;
  status: string;
  assigned_talent_id: string | null;
  assigned_at: string | null;
  assigned_by: string | null;
  customers: {
    first_name: string | null;
    middle_name: string | null;
    last_name: string | null;
    city_municipality: string | null;
  } | null;
}

export interface SuggestedTalent {
  talent_id: string;
  full_name: string;
  address: string;
  services: string[];
  profile_photo_url: string | null;
  hourly_rate: string | null;
  experience: string | null;
  match_score: number;
}

export interface AssignedTalent {
  id: string;
  full_name: string;
  address: string;
  phone: string;
  profile_photo_url: string | null;
  hourly_rate: string | null;
  experience: string | null;
}
