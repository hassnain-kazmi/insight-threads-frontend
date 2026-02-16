import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LandingPage } from "@/features/landing/LandingPage";
import { LoginPage } from "@/features/auth/LoginPage";
import { SignupPage } from "@/features/auth/SignupPage";
import { ForgotPasswordPage } from "@/features/auth/ForgotPasswordPage";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { IngestPage } from "@/features/ingest/IngestPage";
import { DocumentsPage } from "@/features/documents/DocumentsPage";
import { ClustersPage } from "@/features/clusters/ClustersPage";
import { ClusterDetailPage } from "@/features/clusters/ClusterDetailPage";
import { InsightsPage } from "@/features/insights/InsightsPage";
import { AnomaliesPage } from "@/features/anomalies/AnomaliesPage";
import { UmapPage } from "@/features/umap/UmapPage";
import { SearchPage } from "@/features/search/SearchPage";
import { NotFoundPage } from "@/features/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "*",
        element: (
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
          {
            path: "ingest",
            element: <IngestPage />,
          },
          {
            path: "documents",
            element: <DocumentsPage />,
          },
          {
            path: "clusters",
            element: <ClustersPage />,
          },
          {
            path: "clusters/:id",
            element: <ClusterDetailPage />,
          },
          {
            path: "insights",
            element: <InsightsPage />,
          },
          {
            path: "anomalies",
            element: <AnomaliesPage />,
          },
          {
            path: "umap",
            element: <UmapPage />,
          },
          {
            path: "search",
            element: <SearchPage />,
          },
          {
            path: "*",
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
]);
