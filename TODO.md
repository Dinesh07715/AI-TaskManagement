# AI-Powered Task Management Portal - Implementation Tracker

## Step 1: Routing Fixes
- [x] Update `src/routes/AppRoutes.jsx` to add:
  - [ ] `/dashboard/admin`
  - [ ] `/dashboard/user`
  - [ ] `/users` (admin only)
- [x] Fix login redirect based on role.
- [x] Ensure all unknown routes hit `NotFoundPage` without breaking protected routes.

## Step 2: RBAC
- [x] Update `src/components/ProtectedRoute.jsx` to support role-based authorization.
- [ ] Apply role protection to admin-only and user-only routes.

## Step 3: Task Assignment Workflow
- [ ] Ensure task mock model includes `assignedTo`, `createdBy`, `createdAt`, etc.
- [ ] Update `src/services/taskService.js` to enforce:
  - [ ] Admin can assign/reassign tasks.
  - [ ] User cannot change assignment.
- [ ] Update task card/table UI to display `Assigned To` + `Created By`.

## Step 4: Status Workflow
- [ ] Enforce task status update rules in `src/services/taskService.js`:
  - [ ] User can update status only for tasks assigned to them.
  - [ ] Admin can update any task.

## Step 5: Sidebar Updates
- [ ] Update `src/components/Sidebar.jsx` links based on role.
- [ ] Ensure active link highlighting works with `/dashboard/admin` and `/dashboard/user`.

## Step 6: Users Page
- [ ] Create `src/pages/UsersPage.jsx` (admin only).
- [ ] Show user name, email, role, assigned tasks count.
- [ ] Add route in `src/routes/AppRoutes.jsx`.

## Step 7: Admin Analytics Dashboard
- [ ] Update `src/pages/DashboardPage.jsx` to render:
  - [ ] USER dashboard
  - [ ] ADMIN dashboard with analytics cards + sections.
- [ ] Ensure admin analytics uses mock tasks/users.

## Final Verification
- [ ] `npm install`
- [ ] `npm run dev`
- [ ] Verify all required routes and no 404/routing errors
- [ ] Verify RBAC redirection + unauthorized access handling
- [ ] Verify task assignment + status workflow
- [ ] Verify sidebar and navigation per role

