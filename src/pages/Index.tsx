
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import BillingForm from '@/components/BillingForm';
import BillPreview from '@/components/BillPreview';
import { BillData, initialBillData } from '@/lib/utils';
import { motion } from 'framer-motion';

const Index = () => {
  const [activeTab, setActiveTab] = useState('form');
  const [billData, setBillData] = useState<BillData>(initialBillData);

  const handleFormSubmit = (data: BillData) => {
    setBillData(data);
    setActiveTab('preview');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-travel-50/50 to-white">
      <div className="container mx-auto px-4 pb-16">
        <Header />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <Tabs 
            defaultValue="form" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="form" className="text-base">Billing Form</TabsTrigger>
              <TabsTrigger value="preview" className="text-base">Preview & Download</TabsTrigger>
            </TabsList>
            
            <TabsContent value="form" className="mt-0">
              <BillingForm onFormSubmit={handleFormSubmit} />
            </TabsContent>
            
            <TabsContent value="preview" className="mt-0">
              <BillPreview billData={billData} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
