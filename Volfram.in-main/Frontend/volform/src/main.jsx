  import { StrictMode } from 'react'
  import { createRoot } from 'react-dom/client'
  import './index.css'

  import {
    Route,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements
  } from "react-router-dom"

  import Layout from '../Layout.jsx'

  import Home from './pages/Home.jsx'
  import About from './pages/AboutUs.jsx'
  import Contact from './pages/ContactUs.jsx'
  import Services from './pages/Services.jsx'
  import Products from './pages/Products.jsx'
  import Clients from './pages/Clients.jsx'
  import Downloads from './pages/Downloads.jsx'
  import Events from './pages/Events.jsx'
  import Gallery from './pages/Gallery.jsx'
  import Login from './pages/Login.jsx'
  import Register from './pages/Register.jsx'
  import AdminPage from './pages/AdminPage.jsx'
  import PageDetail from './pages/PageDetail.jsx'
  import SafetyValveOrificeCalculator
    from './pages/SafetyValveOrificeCalculator.jsx';

  // NEW CALCULATOR PAGE
  import SaturatedSteamPipeCalculator
    from './pages/SaturatedSteamPipeCalculator.jsx'
    import CondensateFlashSteamCalculator
  from './pages/CondensateFlashSteamCalculator.jsx';
  import BlowDownSavingCalculator
  from './pages/BlowDownSavingCalculator.jsx';
  import BoilerDirectEfficiencyCalculator
  from './pages/BoilerDirectEfficiencyCalculator.jsx';
  import SteamRequirementProcessHeatingCalculator
  from './pages/SteamRequirementProcessHeatingCalculator.jsx';
  import AirCoolingLoadCalculator
  from './pages/AirCoolingLoadCalculator.jsx';
import LiquidPipeCalculator
  from './pages/LiquidPipeCalculator.jsx';
  import SteamRequiredEvaporationCalculator
  from './pages/SteamRequiredEvaporationCalculator.jsx';
  import FeedWaterTankTemperatureCalculator
  from './pages/FeedWaterTankTemperatureCalculator.jsx';
  import TankDimensionsWeightCalculator
  from "./pages/TankDimensionsWeightCalculator.jsx";
  import HeatingCoolingSystemCalculator
  from "./pages/HeatingCoolingSystemCalculator.jsx";
  import WeightCalculator
  from "./pages/WeightCalculator.jsx";
  import PRSSteamSavingCalculator
  from "./pages/PRSSteamSavingCalculator.jsx";
  import SuperheatedSteamPipeCalculator
  from "./pages/SuperheatedSteamPipeCalculator.jsx";
  import PipeWallThicknessCalculator
  from "./pages/PipeWallThicknessCalculator.jsx";

  const router = createBrowserRouter(

    createRoutesFromElements(

      <>

        {/* Main site — with Header and Footer */}
        <Route path="/" element={<Layout />}>

          <Route path='' element={<Home />} />

          <Route path='about' element={<About />} />

          <Route path='contact' element={<Contact />} />

          <Route path='services' element={<Services />} />

          <Route path='products' element={<Products />} />

          <Route path='clients' element={<Clients />} />

          <Route path='downloads' element={<Downloads />} />

          <Route path='events' element={<Events />} />

          <Route path='gallery' element={<Gallery />} />

          <Route path='login' element={<Login />} />

          <Route path='register' element={<Register />} />

          <Route path='pages/:id' element={<PageDetail />} />

          <Route
            path='*'
            element={
              <h1 className='text-center text-4xl mt-20'>
                404 Not Found
              </h1>
            }
          />

        </Route>


        {/* Admin dashboard — standalone, no Header/Footer */}
        <Route
          path="/admin"
          element={<AdminPage />}
        />


        {/* Saturated Steam Pipe Calculator — standalone unique page */}
        <Route
          path="/admin/calculators/saturated-steam-pipe"
          element={<SaturatedSteamPipeCalculator />}
        />
        <Route
    path="/admin/calculators/safety-valve-orifice"
    element={<SafetyValveOrificeCalculator />}
  />
  <Route
  path="/admin/calculators/condensate-flash-steam-saving"
  element={<CondensateFlashSteamCalculator />}
/>
<Route
  path="/admin/calculators/blow-down-saving"
  element={<BlowDownSavingCalculator />}
/>
<Route
  path="/admin/calculators/boiler-direct-efficiency"
  element={<BoilerDirectEfficiencyCalculator />}
/>
<Route
  path="/admin/calculators/steam-requirement-process-heating"
  element={<SteamRequirementProcessHeatingCalculator />}
/>
<Route
  path="/admin/calculators/air-cooling-load"
  element={<AirCoolingLoadCalculator />}
/>
<Route
  path="/admin/calculators/liquid-pipe"
  element={<LiquidPipeCalculator />}
/>
<Route
  path="/admin/calculators/steam-required-evaporation"
  element={<SteamRequiredEvaporationCalculator />}
/>
<Route
  path="/admin/calculators/feed-water-tank-temperature"
  element={<FeedWaterTankTemperatureCalculator />}
/>
<Route
  path="/admin/calculators/tank-dimensions-weight"
  element={<TankDimensionsWeightCalculator />}
/>
<Route
  path="/admin/calculators/heating-cooling-system"
  element={<HeatingCoolingSystemCalculator />}
/>
<Route
  path="/admin/calculators/weight-calculator"
  element={<WeightCalculator />}
/>
<Route
  path="/admin/calculators/prs-steam-saving"
  element={<PRSSteamSavingCalculator />}
/>
<Route
  path="/admin/calculators/superheated-steam-pipe"
  element={<SuperheatedSteamPipeCalculator />}
/>
<Route
  path="/admin/calculators/pipe-wall-thickness"
  element={<PipeWallThicknessCalculator />}
/>
      </>

    )

  )


  createRoot(document.getElementById('root')).render(

    <StrictMode>

      <RouterProvider router={router} />

    </StrictMode>,

  )