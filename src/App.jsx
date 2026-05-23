import { RouterProvider, useRouter } from './components/Router.jsx';
import { NavBar } from './components/NavBar.jsx';
import { Footer } from './components/Footer.jsx';
import { HomePage } from './routes/HomePage.jsx';
import { AboutPage } from './routes/AboutPage.jsx';
import { ProjectsPage } from './routes/ProjectsPage.jsx';
import { ServicesPage } from './routes/ServicesPage.jsx';
import { SustainPage } from './routes/SustainPage.jsx';
import { CareersPage } from './routes/CareersPage.jsx';
import { ContactPage } from './routes/ContactPage.jsx';

function Page() {
  const { path } = useRouter();
  switch (path) {
    case '/':                  return <HomePage />;
    case '/hakkimizda':        return <AboutPage />;
    case '/projeler':          return <ProjectsPage />;
    case '/hizmetler':         return <ServicesPage />;
    case '/surdurulebilirlik': return <SustainPage />;
    case '/kariyer':           return <CareersPage />;
    case '/iletisim':          return <ContactPage />;
    default:                   return <HomePage />;
  }
}

export default function App() {
  return (
    <RouterProvider>
      <NavBar />
      <Page />
      <Footer />
    </RouterProvider>
  );
}
