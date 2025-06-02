
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User, Star, MapPin, Clock, DollarSign } from 'lucide-react';
import { SuggestedTalent } from './types';

interface TalentSelectorProps {
  suggestedTalents: SuggestedTalent[];
  onSelectTalent: (talentId: string) => void;
  loading?: boolean;
}

const TalentSelector = ({ suggestedTalents, onSelectTalent, loading = false }: TalentSelectorProps) => {
  const getMatchColor = (score: number) => {
    if (score >= 100) return 'bg-green-100 text-green-800';
    if (score >= 75) return 'bg-blue-100 text-blue-800';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getMatchLabel = (score: number) => {
    if (score >= 100) return 'Perfect Match';
    if (score >= 75) return 'Good Match';
    if (score >= 50) return 'Partial Match';
    return 'Available';
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {suggestedTalents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No freelancers available for this service.
        </div>
      ) : (
        suggestedTalents.map((talent) => (
          <Card key={talent.talent_id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={talent.profile_photo_url || undefined} />
                    <AvatarFallback>
                      <User className="w-6 h-6" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm truncate">{talent.full_name}</h4>
                      <Badge className={`text-xs ${getMatchColor(talent.match_score)}`}>
                        {getMatchLabel(talent.match_score)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate max-w-24">{talent.address}</span>
                      </div>
                      
                      {talent.hourly_rate && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          <span>{talent.hourly_rate}/day</span>
                        </div>
                      )}
                      
                      {talent.experience && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{talent.experience}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {talent.services.slice(0, 2).map((service, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                      {talent.services.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{talent.services.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button
                  size="sm"
                  onClick={() => onSelectTalent(talent.talent_id)}
                  className="ml-2"
                >
                  Assign
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default TalentSelector;
