import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PublicLayout } from "@/layouts/PublicLayout";
import { AppLayout } from "@/layouts/AppLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";

import { LandingPage } from "@/pages/public/LandingPage";
import { LoginPage } from "@/pages/public/LoginPage";
import { SignupPage } from "@/pages/public/SignupPage";
import { ForgotPasswordPage } from "@/pages/public/ForgotPasswordPage";
import { ResetPasswordPage } from "@/pages/public/ResetPasswordPage";
import { WhyVerificationPage } from "@/pages/public/WhyVerificationPage";

import { OnboardingPage } from "@/pages/onboarding/OnboardingPage";

import { HomePage } from "@/pages/app/HomePage";
import { DiscoverPage } from "@/pages/app/DiscoverPage";
import { ProfilePage } from "@/pages/app/ProfilePage";
import { EditProfilePage } from "@/pages/app/EditProfilePage";
import { NetworkPage } from "@/pages/app/NetworkPage";
import { MessagesPage } from "@/pages/app/MessagesPage";
import { NotificationsPage } from "@/pages/app/NotificationsPage";
import { VerificationPage } from "@/pages/app/VerificationPage";
import { ContactRequestsPage } from "@/pages/app/ContactRequestsPage";
import { PricingPage } from "@/pages/app/PricingPage";
import { JobsPage } from "@/pages/app/JobsPage";
import { JobDetailsPage } from "@/pages/app/JobDetailsPage";
import { GroupsPage } from "@/pages/app/GroupsPage";
import { GroupDetailsPage } from "@/pages/app/GroupDetailsPage";
import { EventsPage } from "@/pages/app/EventsPage";
import { EventDetailsPage } from "@/pages/app/EventDetailsPage";
import { OrganisationPage } from "@/pages/app/OrganisationPage";
import { SettingsPage } from "@/pages/app/SettingsPage";
import { BookmarksPage } from "@/pages/app/BookmarksPage";
import { SavedSearchesPage } from "@/pages/app/SavedSearchesPage";

import { AdminDashboardPage } from "@/pages/admin/AdminDashboardPage";
import { AdminUsersPage } from "@/pages/admin/AdminUsersPage";
import { AdminUserDetailsPage } from "@/pages/admin/AdminUserDetailsPage";
import { AdminVerificationsPage } from "@/pages/admin/AdminVerificationsPage";
import { AdminVerificationReviewPage } from "@/pages/admin/AdminVerificationReviewPage";
import { AdminOrganisationsPage } from "@/pages/admin/AdminOrganisationsPage";
import { AdminPostsPage } from "@/pages/admin/AdminPostsPage";
import { AdminReportsPage } from "@/pages/admin/AdminReportsPage";
import { AdminContactRequestsPage } from "@/pages/admin/AdminContactRequestsPage";
import { AdminPaymentsPage } from "@/pages/admin/AdminPaymentsPage";
import { AdminSubscriptionsPage } from "@/pages/admin/AdminSubscriptionsPage";
import { AdminJobsPage } from "@/pages/admin/AdminJobsPage";
import { AdminGroupsPage } from "@/pages/admin/AdminGroupsPage";
import { AdminEventsPage } from "@/pages/admin/AdminEventsPage";
import { AdminNotificationsPage } from "@/pages/admin/AdminNotificationsPage";
import { AdminAuditLogsPage } from "@/pages/admin/AdminAuditLogsPage";
import { AdminSettingsPage } from "@/pages/admin/AdminSettingsPage";

import { NotFoundPage } from "@/pages/NotFoundPage";
import { Toaster } from "@/components/ui/Toast";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/why-verification" element={<WhyVerificationPage />} />
          <Route
            path="/pricing"
            element={
              <PricingPage />
            }
          />
        </Route>

        {/* Onboarding */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />

        {/* Authenticated app */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<HomePage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/network" element={<NetworkPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/messages/:conversationId" element={<MessagesPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:jobId" element={<JobDetailsPage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/groups/:groupId" element={<GroupDetailsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:eventId" element={<EventDetailsPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="/verification" element={<VerificationPage />} />
          <Route path="/contact-requests" element={<ContactRequestsPage />} />
          <Route path="/organisations/:orgId" element={<OrganisationPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/saved-searches" element={<SavedSearchesPage />} />
        </Route>

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="users/:userId" element={<AdminUserDetailsPage />} />
          <Route path="verifications" element={<AdminVerificationsPage />} />
          <Route path="verifications/:requestId" element={<AdminVerificationReviewPage />} />
          <Route path="organisations" element={<AdminOrganisationsPage />} />
          <Route path="posts" element={<AdminPostsPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="contact-requests" element={<AdminContactRequestsPage />} />
          <Route path="payments" element={<AdminPaymentsPage />} />
          <Route path="subscriptions" element={<AdminSubscriptionsPage />} />
          <Route path="jobs" element={<AdminJobsPage />} />
          <Route path="groups" element={<AdminGroupsPage />} />
          <Route path="events" element={<AdminEventsPage />} />
          <Route path="notifications" element={<AdminNotificationsPage />} />
          <Route path="audit-logs" element={<AdminAuditLogsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
