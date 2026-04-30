import { PhasePage } from '@/components/ventrapath/phase-page'

export default function Page() {
  return (
    <PhasePage
      phaseNumber={3}
      title="Finance"
      prevHref="/phase2/legal"
      prevLabel="Legal"
      nextHref="/phase4/operations"
      nextLabel="Protection"
    />
  )
}
