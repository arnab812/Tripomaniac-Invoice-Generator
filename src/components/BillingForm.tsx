
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ServiceRow from './ServiceRow';
import { BillData, Service, calculateDueAmount, calculateServicesTotal, calculateTotalCost, formatCurrency, generateCustomerId, initialBillData } from '@/lib/utils';
import { toast } from 'sonner';
import { Calendar } from 'lucide-react';

interface BillingFormProps {
  onFormSubmit: (data: BillData) => void;
}

const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  contactNumber: z.string().min(10, { message: "Valid contact number required" }),
  email: z.string().email({ message: "Valid email required" }),
  customerId: z.string(),
  hotelName: z.string().optional(),
  roomNumber: z.string().optional(),
  travelSecurity: z.boolean().default(false),
  advancedAmount: z.number().min(0, { message: "Amount cannot be negative" }),
  serviceCharge: z.number().min(0, { message: "Amount cannot be negative" }),
});

type FormValues = z.infer<typeof formSchema>;

const BillingForm: React.FC<BillingFormProps> = ({ onFormSubmit }) => {
  const [bookingDate, setBookingDate] = useState<Date | null>(new Date());
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [services, setServices] = useState<Service[]>([
    { id: crypto.randomUUID(), name: '', details: '', amount: 0 }
  ]);
  const [servicesTotal, setServicesTotal] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [dueAmount, setDueAmount] = useState(0);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      contactNumber: '',
      email: '',
      customerId: generateCustomerId(),
      hotelName: '',
      roomNumber: '',
      travelSecurity: false,
      advancedAmount: 0,
      serviceCharge: 0,
    }
  });

  const advancedAmount = watch('advancedAmount');
  const serviceCharge = watch('serviceCharge');

  useEffect(() => {
    const newServicesTotal = calculateServicesTotal(services);
    setServicesTotal(newServicesTotal);
    
    const newTotalCost = calculateTotalCost(newServicesTotal, serviceCharge || 0);
    setTotalCost(newTotalCost);
    
    const newDueAmount = calculateDueAmount(newTotalCost, advancedAmount || 0);
    setDueAmount(newDueAmount);
  }, [services, serviceCharge, advancedAmount]);

  const handleServiceChange = (id: string, field: keyof Service, value: string | number) => {
    setServices(prevServices => 
      prevServices.map(service => 
        service.id === id ? { ...service, [field]: value } : service
      )
    );
  };

  const handleAddService = () => {
    setServices(prevServices => [
      ...prevServices,
      { id: crypto.randomUUID(), name: '', details: '', amount: 0 }
    ]);
  };

  const handleRemoveService = (id: string) => {
    if (services.length <= 1) {
      toast.error("At least one service is required");
      return;
    }
    
    setServices(prevServices => prevServices.filter(service => service.id !== id));
  };

  const onSubmit = (data: FormValues) => {
    if (!bookingDate) {
      toast.error("Booking date is required");
      return;
    }

    if (!checkInDate) {
      toast.error("Check-in date is required");
      return;
    }

    if (services.some(service => !service.name)) {
      toast.error("All service names are required");
      return;
    }

    const billData: BillData = {
      ...data,
      bookingDate,
      checkInDate,
      dueAmount,
      totalCost,
      services
    };

    onFormSubmit(billData);
    toast.success("Bill created successfully!");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      className="w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="overflow-hidden border border-gray-100 shadow-subtle">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <motion.div variants={itemVariants} className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">Customer Information</h2>
              <p className="text-sm text-gray-500">Enter the customer's personal details</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    className={`glass-input ${errors.firstName ? 'border-red-300 focus:border-red-400' : ''}`}
                    placeholder="Enter first name"
                    {...register('firstName')}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    className={`glass-input ${errors.lastName ? 'border-red-300 focus:border-red-400' : ''}`}
                    placeholder="Enter last name"
                    {...register('lastName')}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    className={`glass-input ${errors.contactNumber ? 'border-red-300 focus:border-red-400' : ''}`}
                    placeholder="Enter contact number"
                    {...register('contactNumber')}
                  />
                  {errors.contactNumber && (
                    <p className="text-sm text-red-500 mt-1">{errors.contactNumber.message}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    className={`glass-input ${errors.email ? 'border-red-300 focus:border-red-400' : ''}`}
                    placeholder="Enter email address"
                    type="email"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="customerId">Customer ID</Label>
                  <Input
                    id="customerId"
                    className="glass-input bg-gray-50"
                    readOnly
                    {...register('customerId')}
                  />
                </div>
                
                <div>
                  <Label htmlFor="bookingDate">Booking Date</Label>
                  <div className="relative">
                    <DatePicker
                      id="bookingDate"
                      selected={bookingDate}
                      onChange={(date) => setBookingDate(date)}
                      className="glass-input w-full pl-10"
                      dateFormat="dd/MM/yyyy"
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </motion.div>
            
            <Separator className="my-6" />
            
            <motion.div variants={itemVariants} className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">Travel Details</h2>
              <p className="text-sm text-gray-500">Enter the travel and accommodation details</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor="checkInDate">Check-in Date</Label>
                <div className="relative">
                  <DatePicker
                    id="checkInDate"
                    selected={checkInDate}
                    onChange={(date) => setCheckInDate(date)}
                    className="glass-input w-full pl-10"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select check-in date"
                    minDate={new Date()}
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="hotelName">Hotel Name</Label>
                <Input
                  id="hotelName"
                  className="glass-input"
                  placeholder="Enter hotel name"
                  {...register('hotelName')}
                />
              </div>
              
              <div>
                <Label htmlFor="roomNumber">Room Number</Label>
                <Input
                  id="roomNumber"
                  className="glass-input"
                  placeholder="Enter room number"
                  {...register('roomNumber')}
                />
              </div>
              
              <div className="flex items-center space-x-2 pt-8">
                <Checkbox
                  id="travelSecurity"
                  onCheckedChange={(checked) => {
                    setValue('travelSecurity', checked === true);
                  }}
                />
                <Label htmlFor="travelSecurity" className="cursor-pointer">Travel Security</Label>
              </div>
            </motion.div>
            
            <Separator className="my-6" />
            
            <motion.div variants={itemVariants} className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">Services & Charges</h2>
              <p className="text-sm text-gray-500">Add travel services and calculate the total cost</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="mb-6">
              <div className="hidden md:flex justify-between mb-2 px-2">
                <span className="text-sm font-medium text-gray-500 flex-1">Service</span>
                <span className="text-sm font-medium text-gray-500 flex-1">Details</span>
                <span className="text-sm font-medium text-gray-500 w-[180px]">Amount (INR)</span>
                <span className="w-[80px]"></span>
              </div>
              
              <div className="space-y-2">
                {services.map((service, index) => (
                  <ServiceRow
                    key={service.id}
                    service={service}
                    onServiceChange={handleServiceChange}
                    onAddService={handleAddService}
                    onRemoveService={handleRemoveService}
                    isLast={index === services.length - 1}
                  />
                ))}
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor="serviceCharge">Service Charge (INR)</Label>
                <Input
                  id="serviceCharge"
                  className="glass-input"
                  type="number"
                  min="0"
                  placeholder="Enter service charge"
                  {...register('serviceCharge', { 
                    setValueAs: (value) => value === "" ? 0 : parseInt(value, 10)
                  })}
                />
              </div>
              
              <div>
                <Label htmlFor="advancedAmount">Advanced Amount (INR)</Label>
                <Input
                  id="advancedAmount"
                  className="glass-input"
                  type="number"
                  min="0"
                  placeholder="Enter advanced amount"
                  {...register('advancedAmount', { 
                    setValueAs: (value) => value === "" ? 0 : parseInt(value, 10)
                  })}
                />
              </div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="bg-travel-50 rounded-lg p-4 mb-6"
            >
              <div className="flex flex-col items-end">
                <div className="w-full max-w-xs">
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Services Total:</span>
                    <span className="text-sm font-medium">{formatCurrency(servicesTotal)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Service Charge:</span>
                    <span className="text-sm font-medium">{formatCurrency(serviceCharge || 0)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Advanced Amount:</span>
                    <span className="text-sm font-medium">{formatCurrency(advancedAmount || 0)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Due Amount:</span>
                    <span className="text-sm font-medium">{formatCurrency(dueAmount)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between py-2">
                    <span className="text-base font-semibold text-travel-800">Total Cost:</span>
                    <span className="text-base font-bold text-travel-800">{formatCurrency(totalCost)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex justify-end">
              <Button
                type="submit"
                className="bg-travel-600 hover:bg-travel-700 text-white px-6"
              >
                Generate Bill
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BillingForm;
