import { createBrowserRouter, redirect } from "react-router";
import { AppShell } from "./components/AppShell";
import { MyTickets } from "./components/views/MyTickets";
import { LiveChat } from "./components/views/LiveChat";
import { PersonalInbox } from "./components/views/PersonalInbox";
import { Offers } from "./components/views/Offers";
import { MyWarranty } from "./components/views/MyWarranty";
import { LoyaltyPoints } from "./components/views/LoyaltyPoints";
import { MyBenefits } from "./components/views/MyBenefits";
import { MyProfile } from "./components/views/MyProfile";

export const router = createBrowserRouter([
  {
    path: "/",
    loader: () => redirect("/app/tickets"),
    Component: () => null,
  },
  {
    path: "/app",
    Component: AppShell,
    children: [
      { index: true, loader: () => redirect("/app/tickets") },
      { path: "tickets", Component: MyTickets },
      { path: "live-chat", Component: LiveChat },
      { path: "inbox", Component: PersonalInbox },
      { path: "offers", Component: Offers },
      { path: "warranty", Component: MyWarranty },
      { path: "loyalty", Component: LoyaltyPoints },
      { path: "benefits", Component: MyBenefits },
      { path: "profile", Component: MyProfile },
    ],
  },
]);
