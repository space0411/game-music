/*!

=========================================================
* Material Dashboard React - v1.7.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import { RestaurantMenu, QueueMusic, Accessible, DeveloperMode, ScatterPlot, Games, Create } from '@material-ui/icons';

// core components/views for Admin layout
import DashboardScreen from './components/DashboardScreen';
import UserScreen from './components/UserScreen';
import CreateUserScreen from './components/CreateUserScreen';
import ProductsScreen from './components/ProductsScreen';
import CreateProductsScreen from './components/CreateProductScreen';
import FlatformScreen from './components/FlatformScreen';
import GenreScreen from './components/GenreScreen';
import GameScreen from './components/GameScreen';
import DeveloperScreen from './components/DeveloperScreen';
import MusicScreen from './components/MusicScreen';

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: Dashboard,
    component: DashboardScreen,
    layout: "/admin"
  },
  {
    path: "/user",
    name: "User Profile",
    rtlName: "ملف تعريفي للمستخدم",
    icon: Person,
    component: UserScreen,
    layout: "/admin"
  },
  {
    path: "/product",
    name: "Product",
    rtlName: "قائمة الجدول",
    icon: RestaurantMenu,
    component: ProductsScreen,
    layout: "/admin"
  },
  {
    path: "/music",
    name: "Music",
    rtlName: "قائمة الجدول",
    icon: QueueMusic,
    component: MusicScreen,
    layout: "/admin"
  },
  {
    path: "/developer",
    name: "Developer",
    rtlName: "قائمة الجدول",
    icon: Accessible,
    component: DeveloperScreen,
    layout: "/admin"
  },
  {
    path: "/flatform",
    name: "Flatform",
    rtlName: "قائمة الجدول",
    icon: DeveloperMode,
    component: FlatformScreen,
    layout: "/admin"
  },
  {
    path: "/genre",
    name: "Genre",
    rtlName: "قائمة الجدول",
    icon: ScatterPlot,
    component: GenreScreen,
    layout: "/admin"
  },
  {
    path: "/game",
    name: "Game",
    rtlName: "قائمة الجدول",
    icon: Games,
    component: GameScreen,
    layout: "/admin"
  },
  {
    path: "/new-user",
    name: "New User",
    rtlName: "قائمة الجدول",
    icon: Create,
    component: CreateUserScreen,
    layout: "/admin"
  },
  {
    path: "/new-product",
    name: "New Product",
    rtlName: "قائمة الجدول",
    icon: Create,
    component: CreateProductsScreen,
    layout: "/admin"
  },
];

export default dashboardRoutes;
