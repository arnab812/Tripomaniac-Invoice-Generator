
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Service } from '@/lib/utils';

interface ServiceRowProps {
  service: Service;
  onServiceChange: (id: string, field: keyof Service, value: string | number) => void;
  onAddService: () => void;
  onRemoveService: (id: string) => void;
  isLast: boolean;
}

const ServiceRow: React.FC<ServiceRowProps> = ({
  service,
  onServiceChange,
  onAddService,
  onRemoveService,
  isLast
}) => {
  const handleChange = (field: keyof Service, value: string | number) => {
    onServiceChange(service.id, field, value);
  };

  return (
    <motion.div 
      className="flex flex-col md:flex-row gap-3 mb-4 pb-4 border-b border-gray-100 last:border-b-0"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex-1">
        <Input
          className="glass-input"
          placeholder="Service Name"
          value={service.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </div>
      <div className="flex-1">
        <Input
          className="glass-input"
          placeholder="Service Details"
          value={service.details}
          onChange={(e) => handleChange('details', e.target.value)}
        />
      </div>
      <div className="w-full md:w-[180px]">
        <Input
          className="glass-input"
          placeholder="Amount (INR)"
          type="number"
          min="0"
          value={service.amount || ''}
          onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className="flex gap-2">
        {service.id ? (
          <Button 
            type="button" 
            variant="ghost" 
            size="icon"
            className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
            onClick={() => onRemoveService(service.id)}
          >
            <Trash2 className="h-5 w-5" />
            <span className="sr-only">Remove service</span>
          </Button>
        ) : null}
        
        {isLast && (
          <Button 
            type="button" 
            variant="ghost" 
            size="icon"
            className="text-travel-500 hover:text-travel-700 hover:bg-travel-50"
            onClick={onAddService}
          >
            <PlusCircle className="h-5 w-5" />
            <span className="sr-only">Add service</span>
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default ServiceRow;
