from pathlib import Path

p = Path(r"C:\Users\Complete\.openclaw\workspace\projects\ventrapath\backend\src\routes\blueprint.js")
text = p.read_text(encoding='utf-8')
repls = {
    "The business should not feel like another vague care-tech app. It should feel like the control cockpit that keeps participant support moving without admin chaos or dropped handoffs.": "The business should feel like the control cockpit that keeps participant support moving without admin chaos or dropped handoffs, rather than another vague care-tech app.",
    "The business should not sound like another AI follow-up tool. It should feel like the engine that stops good leads going cold and turns speed into a competitive weapon.": "The business should feel like the engine that stops good leads going cold and turns speed into a competitive weapon, rather than another AI follow-up tool.",
    "The business should not feel like a generic online course. It should feel like a practical operating system for handling FIFO family life without losing connection, rhythm, or stability.": "The business should feel like a practical operating system for handling FIFO family life without losing connection, rhythm, or stability, rather than a generic online course.",
    "The business should not sound like generic AI bookkeeping. It should feel like a trade-finance control layer that shows what has been quoted, invoiced, paid, overdue, and leaking.": "The business should feel like a trade-finance control layer that shows what has been quoted, invoiced, paid, overdue, and leaking, rather than generic AI bookkeeping.",
    "The business should feel like a practical weekly performance-food system for busy mums, not generic healthy meal delivery.": "The business should feel like a practical weekly performance-food system for busy mums, rather than generic healthy meal delivery.",
    "The business should sell certainty and visible standards, not generic cleaning hours.": "The business should sell certainty and visible standards, rather than generic cleaning hours.",
    "Instead of operating like a standard appointment-led beauty studio, the business should own one named signature result and build the whole experience around getting and maintaining that look.": "The business should own one named signature result and build the whole experience around getting and maintaining that look, instead of operating like a standard appointment-led beauty studio.",
    "The business should feel like a premium recurring pet-care service with memory and convenience built in, not just a van that shows up to wash dogs.": "The business should feel like a premium recurring pet-care service with memory and convenience built in, rather than just a van that shows up to wash dogs.",
    "The business should not sound like a normal ${idea}. It should sound like a more ownable concept with one recognisable mechanism customers can immediately latch onto.": "The business should sound like a more ownable concept with one recognisable mechanism customers can immediately latch onto, not just a normal version of the idea.",
}
for old, new in repls.items():
    text = text.replace(old, new)
p.write_text(text, encoding='utf-8')
print('done')
