const ROLES = {
    AGENCY: 'Agency',
    ADMIN: 'Admin',
    SALES: 'Sales',
    OPERATOR: 'Operator',
};
const PERMISSIONS = {
    [ROLES.OPERATOR]: ['read'],
    [ROLES.ADMIN]: ['read', 'write', 'delete']
};
module.exports = {
    ROLES,
    PERMISSIONS
};