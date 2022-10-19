import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import Products from './pages/Products';
import Blog from './pages/Blog';
import User from './pages/Users/User';
import NotFound from './pages/Page404';
import {getRole, getToken} from "./utils/common";
import React from "react";
import Listings from "./pages/listings";
import Bills from "./pages/Bills/Bills";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ProjectSites from "./pages/ProjectSites/ProjectSites";
import Projects from "./pages/Projects/Projects";
import ProjectSupplies from "./pages/ProjectSupplies/ProjectSupplies";
import OtherExpenses from "./pages/OtherExpenses/OtherExpenses";
import DisplayProjects from "./pages/display-projects";
import SiteView from "./pages/siteView";
import ProjectView from "./pages/projectView";
import ProjectWorks from "./pages/ProjectsWorks/ProjectWorks";
import Supplies from "./pages/Supplies/Supplies";
import SingleSupplyView from "./pages/singleSupplyView";
import SuppliesInvoice from "./pages/SuppliesInvoice/SuppliesInvoice";
import ProjectsInvoice from "./pages/ProjectsInvoice/ProjectsInvoice";
import InvoiceTemplate from "./pages/InvoiceTemplate";
import FinalSupplyInvoice from "./pages/FinalSupplyInvoice";
import SupplyPayments from "./pages/SupplyPayments/SupplyPayments";
import ProjectPayments from "./pages/ProjectPayments/ProjectPayments";
import OddItems from "./pages/SupplyItems/SupplyItems";
import SingleWorksView from "./pages/singleWorksView";
import IndividualSupplies from "./pages/IndividualSupplies/IndividualSupplies";
import IndividualSuppliesView from "./pages/Individual-Supplies-View/IndividialSuppliesView";
import ProjectInvoiceTemplate from "./pages/ProjectInvoiceTemplate";
import FinalProjectInvoice from "./pages/FinalProjectInvoice";
import SuppliesDelivery from "./pages/SuppliesDelivery/SuppliesDelivery";
import SuppliesDeliveryGen from "./pages/SuppliesDeliveryGen";
import FinalSupplyDelivery from "./pages/FinalSupplyDelivery";
import CreditNoteGen from "./pages/CreditNoteGen";
import FinalSupplyCreditNote from "./pages/FinalSupplyCreditNote";
import FinalJobCard from "./pages/FinalJobCard";
import PettyCash from "./pages/PettyCash";
import InvoicesView from "./pages/InvoicesView/InvoicesView";
import InvoicePayment from "./pages/InvoicePayment/InvoicePayment";
import InvoiceSinglePay from "./pages/invoiceSinglePay";
import Stocks from "./pages/Stocks/Stocks";
import ProjectSuppliesView from "./pages/ProjectSuppliesView/ProjectSuppliesView";
import PettyMoneyIn from "./sections/@dashboard/pettyInstantViews/PettyMoneyIn";
import BiometricReports from "./pages/Biometric Reports/BiometricReports";
import LateInAndEarlyOut from "./pages/LateInAndEarlyOut/LateInAndEarlyOut";
// import Biometric Reports from "./pages/Biometric Reports/Biometric Reports";
import GeneralReport from "./pages/General Report/GeneralReport";
import Logs from "./pages/Logs/Logs"
import Divisions from "./pages/Divisions/Divisions";
import LogsView from "./pages/Logs-View/LogsView";
import DivisionsView from "./pages/DivisionsView/DivisionsView";
import Settings from "./pages/Settings/Settings";
import SingleUserView from "./pages/singleUserView";

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: getToken()?<DashboardApp />: <Navigate to='login'/>},
        { path: 'user', element: getRole()==="Super Admin"?<User />: <Navigate to='login'/>},
        { path: 'profile', element: getToken()?<Profile />: <Navigate to='login'/>},
        { path: 'Divisions', element: <Divisions />},
        { path: 'Logs', element: <Logs />},
        { path: 'Projects', element: <Projects />},
        { path: 'PettyCash', element: <PettyCash />},
        { path: 'Stocks', element: <Stocks />},
        { path: 'MoneyIn', element: <BiometricReports />},
        { path: 'BiometricReports', element: <BiometricReports />},
        { path: 'LateInAndEarlyOut', element: <LateInAndEarlyOut />},
        { path: 'Settings', element: <Settings />},
        { path: 'GeneralReport', element: <GeneralReport />},
        { path: 'ProjectWorks', element: <ProjectWorks />},
        { path: 'ProjectSupplies', element: <ProjectSupplies/>},
        { path: 'Invoices', element: <InvoicesView/>},
        { path: 'InvoicePayments', element: <InvoicePayment/>},
        { path: 'ProjectPayments', element: <ProjectPayments/>},
        { path: 'SupplyPayments', element: <SupplyPayments/>},
        { path: 'OddItems', element: <OddItems/>},
        { path: 'Supplies', element: <Supplies/>},
        { path: 'IndividualSupplies', element: <IndividualSupplies/>},
        { path: 'OtherExpenses', element: <OtherExpenses/>},
        { path: 'Bill', element: getToken()?<Bills />:<Navigate to='login'/> },
        { path: 'DisplayProjects', element: <DisplayProjects /> },
        { path: 'blog', element: <Blog /> }
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: getToken()?<Navigate to="/dashboard/app" />: <Navigate to='login'/>},
        { path: 'login', element: <Login /> },
        { path: 'LogsView/:Id', element: <LogsView/> },
        { path: 'DivisionView/:Id', element: <DivisionsView/> },
        { path: 'SiteView/:Id', element: <SiteView /> },
        { path: 'InvoiceSinglePay/:Id', element: <InvoiceSinglePay /> },
        { path: 'ProjectView/:Id', element: <ProjectView /> },
        { path: 'ProjectSuppliesView/:Id', element: <ProjectSuppliesView /> },
        { path: 'SingleSupplyView/:Id', element: <SingleSupplyView /> },
        { path: 'IndividualSupplyView/:Id', element: <IndividualSuppliesView /> },
        { path: 'IndividualUserView/:Id', element: <SingleUserView /> },
        { path: 'SingleWorksView/:Id', element: <SingleWorksView /> },
        { path: 'invoiceTemplate/:SiteId/:Id', element: <InvoiceTemplate /> },
        { path: 'SuppliesDeliveryGen/:SiteId/:Id', element: <SuppliesDeliveryGen /> },
        { path: 'creditNoteGen/:SiteId/:Id', element: <CreditNoteGen /> },
        { path: 'projectInvoiceTemplate/:SiteId/:Id', element: <ProjectInvoiceTemplate /> },
        { path: 'invoiceTemplate/:SiteId/:Id/FinalSupplyInvoice', element: <FinalSupplyInvoice /> },
        { path: '/:SiteId/:Id/FinalJobCardInvoice', element: <FinalJobCard /> },
        { path: 'projectInvoiceTemplate/:SiteId/:Id/FinalProjectInvoice', element: <FinalProjectInvoice /> },
        { path: 'creditNoteGen/:SiteId/:Id/FinalSupplyCreditNote', element: <FinalSupplyCreditNote /> },
        { path: 'SuppliesDeliveryGen/:SiteId/:Id/FinalSupplyDelivery', element: <FinalSupplyDelivery /> },
        { path: 'ProjectView/SuppliesInvoice/:Id', element: <SuppliesInvoice /> },
        { path: 'ProjectView/SuppliesDelivery/:Id', element: <SuppliesDelivery /> },
        { path: 'ProjectView/ProjectInvoice/:Id', element: < ProjectsInvoice/> },
        { path: 'listings/:Name/:Id', element: <Listings /> },
        { path: 'register', element: <Register />},
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/login" replace /> }
  ]);
}
