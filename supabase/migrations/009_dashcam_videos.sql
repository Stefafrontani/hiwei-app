-- Crear columna videos
ALTER TABLE dashcam ADD COLUMN IF NOT EXISTS videos jsonb DEFAULT '[]'::jsonb;

-- Radares Full HD
UPDATE dashcam SET videos = '[
  {"videoUrl": "https://pub-ea1acf4aaafd4f6085d7a83750d29650.r2.dev/opt_e1-frontal-dia-1.mp4", "label": "Ruta de día", "cameraPosition": "frontal"},
  {"videoUrl": "https://pub-ea1acf4aaafd4f6085d7a83750d29650.r2.dev/opt_e1-frontal-dia-2.mp4", "label": "Ruta de día 2", "cameraPosition": "frontal"},
  {"videoUrl": "https://pub-ea1acf4aaafd4f6085d7a83750d29650.r2.dev/opt_e1-trasera-dia-1.mp4", "label": "Vista trasera urbana", "cameraPosition": "trasera"},
  {"videoUrl": "https://pub-ea1acf4aaafd4f6085d7a83750d29650.r2.dev/opt_e1-trasera-dia-2.mp4", "label": "Vista trasera urbana 2", "cameraPosition": "trasera"}
]'::jsonb WHERE id = 'radares-full-hd';

-- VS1
UPDATE dashcam SET videos = '[
  {"videoUrl": "https://pub-ea1acf4aaafd4f6085d7a83750d29650.r2.dev/opt_vs1-dia-1.mp4", "label": "Manejo urbano 2K", "cameraPosition": "frontal"},
  {"videoUrl": "https://pub-ea1acf4aaafd4f6085d7a83750d29650.r2.dev/opt_vs1-noche-1.MP4", "label": "Visión nocturna", "cameraPosition": "frontal"}
]'::jsonb WHERE id = 'vs1';

-- Radares 4K
UPDATE dashcam SET videos = '[
  {"videoUrl": "https://pub-ea1acf4aaafd4f6085d7a83750d29650.r2.dev/opt_s1ultra-frontal-dia-1.mp4", "label": "Detalle patentes 4K", "cameraPosition": "frontal"},
  {"videoUrl": "https://pub-ea1acf4aaafd4f6085d7a83750d29650.r2.dev/opt_s1ultra-frontal-dia-2.mp4", "label": "Detalle patentes 4K 2", "cameraPosition": "frontal"},
  {"videoUrl": "https://pub-ea1acf4aaafd4f6085d7a83750d29650.r2.dev/opt_s1ultra-trasera-dia-1.mp4", "label": "Seguimiento trasero 4K", "cameraPosition": "trasera"},
  {"videoUrl": "https://pub-ea1acf4aaafd4f6085d7a83750d29650.r2.dev/opt_s1ultra-trasera-dia-2.mp4", "label": "Seguimiento trasero 4K 2", "cameraPosition": "trasera"}
]'::jsonb WHERE id = 'radares-4k';

-- F7NP (sin videos en R2 todavía)
UPDATE dashcam SET videos = '[]'::jsonb WHERE id = 'f7np';

-- F17 Elite (sin videos en R2 todavía)
UPDATE dashcam SET videos = '[]'::jsonb WHERE id = 'f17-elite';
