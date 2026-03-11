-- Add included memory card size to dashcam table (NULL = sold without memory)
ALTER TABLE dashcam ADD COLUMN included_memory_card_size INTEGER DEFAULT NULL;
