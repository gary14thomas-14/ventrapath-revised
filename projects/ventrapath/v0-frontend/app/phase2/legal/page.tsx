import { PhasePage } from '@/components/ventrapath/phase-page'

export default function Page() {
  return (
    <PhasePage
      phaseNumber={2}
      title="Legal"
      prevHref="/phase1/brand"
      prevLabel="Brand"
      nextHref="/phase3/finance"
      nextLabel="Finance"
    />
  )
}
