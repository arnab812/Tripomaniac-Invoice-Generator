
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string | null): string {
  if (!date) return "";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "dd MMM yyyy");
}

export function generateCustomerId(): string {
  const prefix = "";
  // const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}`;
}

export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => func(...args), waitFor);
  };
};

export function calculateDueAmount(totalCost: number, advancedAmount: number): number {
  return Math.max(0, totalCost - advancedAmount);
}

export function calculateTotalCost(servicesTotal: number, serviceCharge: number): number {
  return servicesTotal + serviceCharge;
}

export function calculateServicesTotal(services: Service[]): number {
  return services.reduce((sum, service) => sum + (service.amount || 0), 0);
}

export interface Service {
  id: string;
  name: string;
  details: string;
  amount: number;
}

export interface BillData {
  firstName: string;
  lastName: string;
  contactNumber: string;
  email: string;
  customerId: string;
  bookingDate: Date | null;
  checkInDate: Date | null;
  checkOutDate: Date | null;
  hotelName: string;
  roomNumber: string;
  travelSecurity: boolean;
  advancedAmount: number;
  dueAmount: number;
  serviceCharge: number;
  totalCost: number;
  services: Service[];
}

export const initialBillData: BillData = {
  firstName: "",
  lastName: "",
  contactNumber: "",
  email: "",
  customerId: generateCustomerId(),
  bookingDate: new Date(),
  checkInDate: null,
  checkOutDate: null,
  hotelName: "",
  roomNumber: "",
  travelSecurity: false,
  advancedAmount: 0,
  dueAmount: 0,
  serviceCharge: 0,
  totalCost: 0,
  services: [{ id: crypto.randomUUID(), name: "", details: "", amount: 0 }],
};
