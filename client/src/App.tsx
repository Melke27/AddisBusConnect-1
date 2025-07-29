import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import RouteDetails from "@/pages/RouteDetails";
import Schedule from "@/pages/Schedule";
import Notifications from "@/pages/Notifications";
import TicketPurchase from "@/pages/TicketPurchase";
import UserTickets from "@/pages/UserTickets";
import AdminDashboard from "@/pages/AdminDashboard";
import "./lib/i18n"; // Initialize i18n

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/routes/:id" component={RouteDetails} />
          <Route path="/schedule" component={Schedule} />
          <Route path="/notifications" component={Notifications} />
          <Route path="/purchase" component={TicketPurchase} />
          <Route path="/tickets" component={UserTickets} />
          <Route path="/admin" component={AdminDashboard} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
