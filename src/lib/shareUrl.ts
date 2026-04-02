import { toast } from 'sonner'

export async function shareUrl(url: string, title: string): Promise<void> {
  if (navigator.share) {
    try {
      await navigator.share({ title, url })
      toast.success('Link compartido')
      return
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
    }
  }

  try {
    await navigator.clipboard.writeText(url)
    toast.success('Link copiado al portapapeles')
  } catch {
    // Fallback for insecure contexts (e.g. LAN IP without HTTPS)
    try {
      const textarea = document.createElement('textarea')
      textarea.value = url
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      toast.success('Link copiado al portapapeles')
    } catch {
      toast.error('No se pudo copiar el link')
    }
  }
}
