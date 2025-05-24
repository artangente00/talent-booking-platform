
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addWeeks, subWeeks } from 'date-fns';

interface WeekNavigationProps {
  currentWeek: Date;
  weekDays: Date[];
  onWeekChange: (newWeek: Date) => void;
}

const WeekNavigation = ({ currentWeek, weekDays, onWeekChange }: WeekNavigationProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onWeekChange(subWeeks(currentWeek, 1))}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-xl font-semibold">
          {format(weekDays[0], 'MMMM d')} - {format(weekDays[6], 'd, yyyy')}
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onWeekChange(addWeeks(currentWeek, 1))}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      <Button
        variant="outline"
        onClick={() => onWeekChange(new Date())}
      >
        Today
      </Button>
    </div>
  );
};

export default WeekNavigation;
