import { PhasePage } from '@/components/ventrapath/phase-page'

export default function Page() {
  return (
    <PhasePage
      phaseNumber={6}
      title="Marketing"
      prevHref="/phase5/infrastructure"
      prevLabel="Infrastructure"
      nextHref="/phase7/operations"
      nextLabel="Operations"
    />
  )
}
