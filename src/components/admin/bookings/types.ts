
export interface Service {
  id: string;
  title: string;
  icon_name: string;
}

export interface Booking {
  id: string;
  booking_date: string;
  booking_time: string;
  service_address: string;
  service_type: string;
  status: string;
  customer: {
    first_name: string;
    middle_name: string | null;
    last_name: string;
  };
  talent_name?: string;
}
