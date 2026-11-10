import { useEffect } from 'react';
import { RouterProvider, useRouter } from './components/Router.jsx';
import { SiteProvider, useSiteData } from './context/SiteContext.jsx';
import { NavBar } from './components/NavBar.jsx';
import { Footer } from './components/Footer.jsx';
import { HomePage } from './routes/HomePage.jsx';
import { AboutPage } from './routes/AboutPage.jsx';
import { ProjectsPage } from './routes/ProjectsPage.jsx';
import { ServicesPage } from './routes/ServicesPage.jsx';
import { SustainPage } from './routes/SustainPage.jsx';
import { CareersPage } from './routes/CareersPage.jsx';
import { ContactPage } from './routes/ContactPage.jsx';
import { AdminPage } from './routes/AdminPage.jsx';

function Page() {
  const { path } = useRouter();
  const { trackVisit } = useSiteData();

  useEffect(() => {
    if (path !== '/panel' && path !== '/admin') {
      trackVisit({ path });
    }
  }, [path, trackVisit]);

  switch (path) {
    case '/':                  return <HomePage />;
    case '/hakkimizda':        return <AboutPage />;
    case '/projeler':          return <ProjectsPage />;
    case '/hizmetler':         return <ServicesPage />;
    case '/surdurulebilirlik': return <SustainPage />;
    case '/kariyer':           return <CareersPage />;
    case '/iletisim':          return <ContactPage />;
    case '/panel':
    case '/admin':             return <AdminPage />;
    default:                   return <HomePage />;
  }
}

export default function App() {
  return (
    <SiteProvider>
      <RouterProvider>
        <NavBar />
        <Page />
        <Footer />
      </RouterProvider>
    </SiteProvider>
  );
}
