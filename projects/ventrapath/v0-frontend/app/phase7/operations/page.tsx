import { PhasePage } from '@/components/ventrapath/phase-page'

export default function Page() {
  return (
    <PhasePage
      phaseNumber={7}
      title="Operations"
      prevHref="/phase6/marketing"
      prevLabel="Marketing"
      nextHref="/phase8/sales"
      nextLabel="Sales"
    />
  )
}
