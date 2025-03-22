
import React from 'react';
import { BillData, formatCurrency, formatDate } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import { motion } from 'framer-motion';
import { generatePDF } from '@/utils/pdfGenerator';
import logo from '../assets/logo.png';

interface BillPreviewProps {
  billData: BillData;
}

const BillPreview: React.FC<BillPreviewProps> = ({ billData }) => {
  const handleDownloadPDF = () => {
    generatePDF(billData);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4 no-print">
        <h2 className="text-xl font-semibold text-gray-800">Bill Preview</h2>
        <div className="flex gap-2">
          <Button 
            onClick={handlePrint}
            variant="outline"
            className="flex items-center gap-2 bg-white hover:bg-gray-50"
          >
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </Button>
          <Button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-travel-600 hover:bg-travel-700"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </Button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="overflow-hidden border border-gray-100 shadow-subtle print-component">
          <CardContent className="p-0">
            <div className="p-6 bg-gradient-to-b from-travel-50 to-white">
              <div className="text-center mb-6">
                <img src={logo} alt="Tripomaniac" className="h-14 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Premium Travel Experiences</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1"><u>Customer Details</u></h3>
                    <p className="text-lg font-semibold mb-1">{billData.firstName} {billData.lastName}</p>
                    <p className="text-sm text-gray-600 mb-1">{billData.contactNumber}</p>
                    <p className="text-sm text-gray-600">{billData.email}</p>
                    <p className="text-sm text-gray-600 mb-1">Travel Security: {billData.travelSecurity ? "Yes" : "No"}</p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-sm font-medium text-gray-500 mb-1"><u>Invoice Information</u></h3>
                    <p className="text-lg font-semibold mb-1">{billData.customerId}</p>
                    <p className="text-sm text-gray-600 mb-1">Booking: {formatDate(billData.bookingDate)}</p>
                    <p className="text-sm text-gray-600">Check-in: {formatDate(billData.checkInDate)}</p>
                    <p className="text-sm text-gray-600">Check-out: {formatDate(billData.checkOutDate)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Accommodation</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Trip Name</p>
                    <p className="font-medium">{billData.hotelName || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Details</p>
                    <p className="font-medium">{billData.services[0]?.details || "Not specified"}</p>
                    <p className="font-medium">{billData.services[1]?.details || ""}</p>
                    <p className="font-medium">{billData.services[2]?.details || ""}</p>
                    <p className="font-medium">{billData.services[3]?.details || ""}</p>
                    <p className="font-medium">{billData.services[4]?.details || ""}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Travel Security</p>
                    <p className="font-medium">{billData.travelSecurity ? "Yes" : "No"}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-4">Services & Charges</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full mb-6">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-2 text-sm font-medium text-gray-500">Service</th>
                        <th className="text-left py-2 px-2 text-sm font-medium text-gray-500">Details</th>
                        <th className="text-right py-2 px-2 text-sm font-medium text-gray-500">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {billData.services.map((service, index) => (
                        <tr key={service.id} className="border-b border-gray-100 last:border-b-0">
                          <td className="py-3 px-2 text-sm">{service.name}</td>
                          <td className="py-3 px-2 text-sm">{service.details}</td>
                          <td className="py-3 px-2 text-sm text-right">{formatCurrency(service.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="w-full max-w-xs">
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-gray-600">Service Charge:</span>
                      <span className="text-sm font-medium">{formatCurrency(billData.serviceCharge)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-gray-600">Advanced Amount:</span>
                      <span className="text-sm font-medium">{formatCurrency(billData.advancedAmount)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-gray-600">Due Amount:</span>
                      <span className="text-sm font-medium">{formatCurrency(billData.dueAmount)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between py-2">
                      <span className="text-base font-semibold text-travel-800">Total Cost:</span>
                      <span className="text-base font-bold text-travel-800">{formatCurrency(billData.totalCost)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 text-center text-sm text-gray-500 bg-gray-50">
              <p>Thank you for choosing Tripomaniac for your travel needs.</p>
              <p className="text-xs mt-1">This is a computer generated invoice and does not require signature.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default BillPreview;
