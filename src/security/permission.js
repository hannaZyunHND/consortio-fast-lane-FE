export function checkPermission(userRole, allowedRoles) {
    return allowedRoles.includes(userRole);
}
