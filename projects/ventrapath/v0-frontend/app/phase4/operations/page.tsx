import { PhasePage } from '@/components/ventrapath/phase-page'

export default function Page() {
  return (
    <PhasePage
      phaseNumber={4}
      title="Protection"
      prevHref="/phase3/finance"
      prevLabel="Finance"
      nextHref="/phase5/infrastructure"
      nextLabel="Infrastructure"
    />
  )
}
