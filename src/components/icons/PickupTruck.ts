import { createLucideIcon } from 'lucide-react'

const PickupTruck = createLucideIcon('pickup-truck', [
  [
    'path',
    {
      d: 'M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H10v3H3a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h2',
      key: 'body',
    },
  ],
  ['circle', { cx: '7', cy: '17', r: '2', key: 'rear-wheel' }],
  ['circle', { cx: '17', cy: '17', r: '2', key: 'front-wheel' }],
  ['path', { d: 'M9 17h6', key: 'axle' }],
])

export default PickupTruck
