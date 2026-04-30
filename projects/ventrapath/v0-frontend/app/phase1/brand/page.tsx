import { PhasePage } from '@/components/ventrapath/phase-page'

export default function Page() {
  return (
    <PhasePage
      phaseNumber={1}
      title="Brand"
      prevHref="/risks"
      prevLabel="Back to Blueprint"
      nextHref="/phase2/legal"
      nextLabel="Legal"
    />
  )
}
