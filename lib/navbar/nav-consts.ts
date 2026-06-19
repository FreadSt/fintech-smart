import { Check, CreditCard, Shield } from "lucide-react";

export const notifications = [
  {
    title: "Card payment cleared",
    description: "Netflix subscription was paid from your main card.",
    time: "2 min",
  },
  {
    title: "Savings goal updated",
    description: "Smart Save moved $42 into your travel pocket.",
    time: "1 hr",
  },
  {
    title: "Invoice reminder",
    description: "Workspace plan payment is due tomorrow.",
    time: "Today",
  },
];

export const settings = [
  { label: "Payment controls", value: "Auto rules on", icon: CreditCard },
  { label: "Security checks", value: "Protected", icon: Shield },
  { label: "Smart insights", value: "Daily digest", icon: Check },
];