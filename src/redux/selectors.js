export const currentUserSelector = (state) => state?.auth?.currentUser ?? "";
export const isLoggedInSelector = (state) => state?.auth?.isLoggedIn ?? "";
export const messageErrorSelector = (state) => state?.auth?.messageError ?? "";
export const dashboardSelector = (state) => state?.dashboard?.data ?? "";
export const usersSelector = (state) => state?.users?.data ?? "";
export const categorySelector = (state) => state?.category?.data ?? "";
export const agencySelector = (state) => state?.agency?.data ?? "";
