import { PhasePage } from '@/components/ventrapath/phase-page'

export default function Page() {
  return (
    <PhasePage
      phaseNumber={8}
      title="Sales"
      prevHref="/phase7/operations"
      prevLabel="Operations"
      nextHref="/phase9/launch"
      nextLabel="Growth & Milestones"
    />
  )
}
