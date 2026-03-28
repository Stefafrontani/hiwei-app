import { createLucideIcon } from 'lucide-react'

const Sedan = createLucideIcon('sedan', [
  [
    'path',
    {
      d: 'M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10l-3-3H9l-2 3H4a2 2 0 0 0-2 2v4c0 .6.4 1 1 1h2',
      key: 'body',
    },
  ],
  ['circle', { cx: '7', cy: '17', r: '2', key: 'rear-wheel' }],
  ['circle', { cx: '17', cy: '17', r: '2', key: 'front-wheel' }],
  ['path', { d: 'M9 17h6', key: 'axle' }],
])

export default Sedan
