import { PhasePage } from '@/components/ventrapath/phase-page'

export default function Page() {
  return (
    <PhasePage
      phaseNumber={5}
      title="Infrastructure"
      prevHref="/phase4/operations"
      prevLabel="Protection"
      nextHref="/phase6/marketing"
      nextLabel="Marketing"
    />
  )
}
