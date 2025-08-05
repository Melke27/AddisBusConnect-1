import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { useAuth } from "./hooks/useAuth";
import NotFound from "./pages/not-found";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import RouteDetails from "./pages/RouteDetails";
import Schedule from "./pages/Schedule";
import Notifications from "./pages/Notifications";
import TicketPurchase from "./pages/TicketPurchase";
import UserTickets from "./pages/UserTickets";
import AdminDashboard from "./pages/AdminDashboard";
import UserProfile from "./pages/UserProfile";
import CommunityFeedback from "./pages/CommunityFeedback";
import RideSharing from "./pages/RideSharing";
import "./lib/i18n"; // Initialize i18n

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // In local development, skip authentication check
  const isLocalDev = typeof window !== 'undefined';
  const shouldShowApp = isLocalDev || isAuthenticated;

  return (
    <Switch>
      {isLoading ? (
        <Route path="/" component={Landing} />
      ) : shouldShowApp ? (
        <>
          <Route path="/" component={Home} />
          <Route path="/auth" component={Auth} />
          <Route path="/login" component={Auth} />
          <Route path="/signup" component={Auth} />
          <Route path="/forgot-password" component={Auth} />
          <Route path="/reset-password" component={Auth} />
          <Route path="/routes/:id" component={RouteDetails} />
          <Route path="/schedule" component={Schedule} />
          <Route path="/notifications" component={Notifications} />
          <Route path="/purchase" component={TicketPurchase} />
          <Route path="/tickets" component={UserTickets} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/profile" component={UserProfile} />
          <Route path="/feedback" component={CommunityFeedback} />
          <Route path="/rideshare" component={RideSharing} />
        </>
      ) : (
        <>
          <Route path="/" component={Landing} />
          <Route path="/auth" component={Auth} />
          <Route path="/login" component={Auth} />
          <Route path="/signup" component={Auth} />
          <Route path="/forgot-password" component={Auth} />
          <Route path="/reset-password" component={Auth} />
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
