
-- Add new columns to services table for special pricing
ALTER TABLE services 
ADD COLUMN has_special_pricing boolean DEFAULT false,
ADD COLUMN special_pricing jsonb DEFAULT NULL;

-- Update existing Driver Services record to use special pricing
UPDATE services 
SET 
  has_special_pricing = true,
  special_pricing = '[
    {"duration": "12hr", "price": "₱525"},
    {"duration": "24hr", "price": "₱1050"}
  ]'::jsonb
WHERE title = 'Driver Services' OR title ILIKE '%driver%';

-- Add a comment to document the special_pricing column structure
COMMENT ON COLUMN services.special_pricing IS 'JSON array of pricing options: [{"duration": "12hr", "price": "₱525"}, {"duration": "24hr", "price": "₱1050"}]';
