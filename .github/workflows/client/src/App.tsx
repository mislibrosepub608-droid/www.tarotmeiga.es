import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import TarotistaPage from "./pages/TarotistaPage";
import ReservasPage from "./pages/ReservasPage";
import AdminPage from "./pages/AdminPage";
import BonosPage from "./pages/BonosPage";
import TrabajaPage from "./pages/TrabajaPage";
import LegalPage from "./pages/LegalPage";
import ResenasPage from "./pages/ResenasPage";
import CookieBanner from "./components/CookieBanner";
import FloatingWidgets from "./components/FloatingWidgets";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/tarotista/:id"} component={TarotistaPage} />
      <Route path={"/reservar"} component={ReservasPage} />
      <Route path={"/admin"} component={AdminPage} />
      <Route path={"/bonos"} component={BonosPage} />
      <Route path={"/trabaja"} component={TrabajaPage} />
      <Route path={"/legal"} component={LegalPage} />
      <Route path={"/resenas"} component={ResenasPage} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
          <CookieBanner />
          <FloatingWidgets />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
