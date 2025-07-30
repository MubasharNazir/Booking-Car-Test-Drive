import axios from 'axios';

export type Car = {
  id: number;
  company_name: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  color: string;
  transmission: string;
  fuel_type: string;
  description: string;
  images: string[];
  video?: string;
  features: string[];
  available_for_test_drive: boolean;
};

const api = axios.create({
  baseURL: 'https://booking-car-test-drive.onrender.com',
});

export async function chatCarSearch(query: string): Promise<Car[] | { message: string }> {
  const res = await api.post('/api/chat/', { query });
  return res.data;
} 