INSERT INTO dashcam (id, name, description, base_price, discount, specs, tags, camera_positions, max_quality, cycle_size, ecommerce_url, included_memory_card_size, videos)
VALUES (
  'a229-pro',
  'A229 Pro - Triple cámara 4K + 2K + 1080P',
  'La A229 Pro es nuestra dashcam más premium. Con grabación 4K frontal, 2K trasera y 1080P interior, captura cada detalle con una nitidez excepcional gracias a sus sensores Sony STARVIS 2. Su control por comandos de voz te permite operar la cámara sin soltar el volante, mientras que el control remoto Bluetooth te da acceso instantáneo a la grabación y guardado de clips de emergencia con un solo toque. Pensada para quienes no quieren compromisos en calidad ni en comodidad.',
  965000,
  0,
  ARRAY[
    'Calidad 4K',
    'Grabación Frontal, trasera e interior',
    'Sensores Sony STARVIS 2',
    'Control por comandos de voz',
    'Control remoto Bluetooth',
    'Grabación en bucle',
    'Permite modo estacionamiento',
    'Wifi',
    'GPS integrado',
    'Aplicación para celular'
  ],
  ARRAY[
    'Premium',
    'Lo más avanzado',
    'Graba Interior',
    '4K Frontal',
    '2K Trasera',
    '1080p Interior',
    'Triple cobertura',
    'Alta nitidez',
    'Control por voz',
    'Control remoto Bluetooth',
    'WiFi',
    'Grabación en bucle',
    'GPS integrado',
    'Bloqueo por impacto',
    'G-Sensor'
  ],
  ARRAY['frontal', 'trasera', 'interior'],
  'superior',
  2.4,
  'https://www.hiwei.com.ar/productos/viofo-a229pro-3ch/',
  NULL,
  '[
    {"videoUrl": "https://pub-ea1acf4aaafd4f6085d7a83750d29650.r2.dev/opt_a229pro-frontal-dia-1.mp4", "label": "Frontal de día", "cameraPosition": "frontal"},
    {"videoUrl": "https://pub-ea1acf4aaafd4f6085d7a83750d29650.r2.dev/opt_a229pro-frontal-dia-2.mp4", "label": "Frontal de día 2", "cameraPosition": "frontal"},
    {"videoUrl": "https://pub-ea1acf4aaafd4f6085d7a83750d29650.r2.dev/opt_a229pro-trasera-dia-1.mp4", "label": "Trasera de día", "cameraPosition": "trasera"},
    {"videoUrl": "https://pub-ea1acf4aaafd4f6085d7a83750d29650.r2.dev/opt_a229pro-trasera-dia-2.mp4", "label": "Trasera de día 2", "cameraPosition": "trasera"},
    {"videoUrl": "https://pub-ea1acf4aaafd4f6085d7a83750d29650.r2.dev/opt_a229pro-interior-dia-1.mp4", "label": "Interior de día", "cameraPosition": "interior"},
    {"videoUrl": "https://pub-ea1acf4aaafd4f6085d7a83750d29650.r2.dev/opt_a229pro-interior-dia-2.mp4", "label": "Interior de día 2", "cameraPosition": "interior"}
  ]'::jsonb
);
