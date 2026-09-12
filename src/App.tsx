import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PublicLayout } from "@/layouts/PublicLayout";
import { AppLayout } from "@/layouts/AppLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";

import { LandingPage } from "@/screens/public/LandingPage";
import { LoginPage } from "@/screens/public/LoginPage";
import { SignupPage } from "@/screens/public/SignupPage";
import { ForgotPasswordPage } from "@/screens/public/ForgotPasswordPage";
import { ResetPasswordPage } from "@/screens/public/ResetPasswordPage";
import { WhyVerificationPage } from "@/screens/public/WhyVerificationPage";

import { OnboardingPage } from "@/screens/onboarding/OnboardingPage";

import { HomePage } from "@/screens/app/HomePage";
import { DiscoverPage } from "@/screens/app/DiscoverPage";
import { ProfilePage } from "@/screens/app/ProfilePage";
import { EditProfilePage } from "@/screens/app/EditProfilePage";
import { NetworkPage } from "@/screens/app/NetworkPage";
import { MessagesPage } from "@/screens/app/MessagesPage";
import { NotificationsPage } from "@/screens/app/NotificationsPage";
import { VerificationPage } from "@/screens/app/VerificationPage";
import { ContactRequestsPage } from "@/screens/app/ContactRequestsPage";
import { PricingPage } from "@/screens/app/PricingPage";
import { JobsPage } from "@/screens/app/JobsPage";
import { JobDetailsPage } from "@/screens/app/JobDetailsPage";
import { GroupsPage } from "@/screens/app/GroupsPage";
import { GroupDetailsPage } from "@/screens/app/GroupDetailsPage";
import { EventsPage } from "@/screens/app/EventsPage";
import { EventDetailsPage } from "@/screens/app/EventDetailsPage";
import { OrganisationPage } from "@/screens/app/OrganisationPage";
import { SettingsPage } from "@/screens/app/SettingsPage";
import { BookmarksPage } from "@/screens/app/BookmarksPage";
import { SavedSearchesPage } from "@/screens/app/SavedSearchesPage";

import { AdminDashboardPage } from "@/screens/admin/AdminDashboardPage";
import { AdminUsersPage } from "@/screens/admin/AdminUsersPage";
import { AdminUserDetailsPage } from "@/screens/admin/AdminUserDetailsPage";
import { AdminVerificationsPage } from "@/screens/admin/AdminVerificationsPage";
import { AdminVerificationReviewPage } from "@/screens/admin/AdminVerificationReviewPage";
import { AdminOrganisationsPage } from "@/screens/admin/AdminOrganisationsPage";
import { AdminPostsPage } from "@/screens/admin/AdminPostsPage";
import { AdminReportsPage } from "@/screens/admin/AdminReportsPage";
import { AdminContactRequestsPage } from "@/screens/admin/AdminContactRequestsPage";
import { AdminPaymentsPage } from "@/screens/admin/AdminPaymentsPage";
import { AdminSubscriptionsPage } from "@/screens/admin/AdminSubscriptionsPage";
import { AdminJobsPage } from "@/screens/admin/AdminJobsPage";
import { AdminGroupsPage } from "@/screens/admin/AdminGroupsPage";
import { AdminEventsPage } from "@/screens/admin/AdminEventsPage";
import { AdminNotificationsPage } from "@/screens/admin/AdminNotificationsPage";
import { AdminAuditLogsPage } from "@/screens/admin/AdminAuditLogsPage";
import { AdminSettingsPage } from "@/screens/admin/AdminSettingsPage";

import { NotFoundPage } from "@/screens/NotFoundPage";
import { Toaster } from "@/components/ui/Toast";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login/*" element={<LoginPage />} />
          <Route path="/signup/*" element={<SignupPage />} />
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
