import { createBrowserRouter } from 'react-router';

import LoginView from './views/auth/LoginView';
import AppLayout from './layouts/AppLayout';
import DashboardView from './views/DashboardView';
import CategoriesView from './views/categories/CategoriesView';
import SuppliersView from './views/suppliers/SuppliersView';
import { ProductsView } from './views/products/ProductsView';
import CreateProductView from './views/products/CreateProductView';
import { NotFoundView } from './views/404/NotFoundView';
import EditProductView from './views/products/EditProductView';
import ClientsView from './views/clients/ClientsView';
import PurchaseManagerView from './views/Movements/PurchaseManagerView';
import { CreatePurchaseView } from './views/Movements/CreatePurchaseView';
import EditPurchaseView from './views/Movements/EditPurchaseView';
import { AdjustmentsView } from './views/adjustments/AdjustmentsView';
import { CreateSupplierView } from './views/suppliers/CreateSupplierView';
import { EditSupplierView } from './views/suppliers/EditSupplierView';
import { DetailCategoryView } from './views/categories/DetailCategoryView';
import DetailCashRegisterView from './views/cash-register/DetailCashRegisterView';
import ClosedCashRegisterView from './views/cash-register/ClosedCashRegisterView';
import PosView from './views/sales/PosView';
import SaleHistory from './views/sales/SaleHistory';
import NewProductView from './views/categories/NewProductView';
import CreateClientView from './views/clients/CreateClientView';
import EditClientView from './views/clients/EditClientView';
import CashRegistersView from './views/cash-register/CashRegistersView';
import ProfileView from './views/profile/ProfileView';
import DetailProductView from './views/products/DetailProductView';
import SaleView from './views/sales/SaleView';
import { ProtectedRoute } from './router/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/auth/login',
    Component: LoginView,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      // Home
      {
        index: true,
        path: 'home',
        Component: DashboardView,
      },
      // Categorias
      {
        path: 'categories',
        children: [
          { index: true, Component: CategoriesView },
          { path: 'view/:categoryId', Component: DetailCategoryView },
          { path: 'view/:categoryId/new-product', Component: NewProductView },
        ]
      },
      // Proveedores
      {
        path: 'suppliers',
        children: [
          { index: true, Component: SuppliersView },
          { path: 'new', Component: CreateSupplierView },
          { path: 'edit/:supplierId', Component: EditSupplierView }
        ]
      },
      // Productos
      {
        path: 'products',
        children: [
          { index: true, Component: ProductsView },
          { path: 'new', Component: CreateProductView },
          { path: 'edit/:productId', Component: EditProductView },
          { path: 'detail/:productId', Component: DetailProductView }
        ]
      },
      // Clientes
      {
        path: 'clients',
        children: [
          { index: true, Component: ClientsView },
          { path: 'new', Component: CreateClientView },
          { path: 'edit/:clientId', Component: EditClientView }
        ]
      },
      // Compras
      {
        path: 'purchases',
        children: [
          { index: true, Component: PurchaseManagerView },
          { path: 'new', Component: CreatePurchaseView },
          { path: 'edit/:purchaseId', Component: EditPurchaseView }
        ]
      },
      // Cajas
      {
        path: 'cash-register',
        children: [
          { index: true, Component: CashRegistersView },
          { path: 'detail/:cashRegisterId', Component: DetailCashRegisterView },
          { path: 'closed/:cashRegisterId', Component: ClosedCashRegisterView },
        ]
      },
      // Ventas
      {
        path: 'sales',
        children: [
          { index: true, Component: PosView },
          { path: 'history', Component: SaleHistory },
          { path: 'detail/:saleId', Component: SaleView }
        ]
      },
      // Ajuestes stock
      {
        path: 'adjustments',
        children: [
          { index: true, Component: AdjustmentsView }
        ]
      },
      // Configuraciones
      {
        path: 'config',
        children: [
          { path: 'profile', Component: ProfileView },
        ]
      },
    ]
  },
  {
    path: '/404',
    Component: NotFoundView
  }
]);

export default router;