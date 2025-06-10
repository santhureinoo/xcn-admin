import React, { useState, useEffect } from 'react';
import { User, UserFilters, UserStats } from '../../types/user';
import UserManagementHeader from '../../components/admin/users/UserManagementHeader';
import UserStatsCards from '../../components/admin/users/UserStatsCards';
import UserFiltersComponent from '../../components/admin/users/UserFilters';
import UserTable from '../../components/admin/users/UserTable';
import UserDetailModal from '../../components/admin/users/UserDetailModal';
import AddEditUserModal from '../../components/admin/users/AddEditUserModal';
import userService from '../../services/userService';

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    totalRetailers: 0,
    totalResellers: 0,
    activeUsers: 0,
    totalBalance: 0,
    totalSpent: 0
  });
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const pageSize = 50;

  // Modal states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  // Filter states
  const [filters, setFilters] = useState<UserFilters>({
    role: 'all',
    status: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Load users from API
  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getUsers(filters, currentPage, pageSize);
      setUsers(response.users);
      setFilteredUsers(response.users); // Since filtering is done on backend
      setTotalPages(response.pagination.totalPages);
      setTotalUsers(response.pagination.total);
    } catch (error: any) {
      console.error('Failed to load users:', error);
      setError(error.message || 'Failed to load users');
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Load stats from API
  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const response = await userService.getUserStats();
      setStats(response.stats);
    } catch (error: any) {
      console.error('Failed to load stats:', error);
      // Keep default stats on error
    } finally {
      setStatsLoading(false);
    }
  };

  // Load data on component mount and when filters/page change
  useEffect(() => {
    loadUsers();
  }, [filters, currentPage]);

  // Load stats on component mount
  useEffect(() => {
    loadStats();
  }, []);

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<UserFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFilters({
      role: 'all',
      status: 'all',
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    setCurrentPage(1);
  };

  // Handle user actions
  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowAddEditModal(true);
    setShowDetailModal(false);
  };

  const handleDeleteUser = async (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      try {
        await userService.deleteUser(user.id);
        setShowDetailModal(false);
        // Reload users and stats
        await loadUsers();
        await loadStats();
        // Show success message
        alert('User deleted successfully');
      } catch (error: any) {
        console.error('Failed to delete user:', error);
        alert(error.message || 'Failed to delete user');
      }
    }
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    const action = newStatus === 'active' ? 'activate' : 'suspend';

    if (window.confirm(`Are you sure you want to ${action} ${user.firstName} ${user.lastName}?`)) {
      try {
        const response = await userService.toggleUserStatus(user.id);

        // Update the user in the list
        const updatedUsers = users.map(u =>
          u.id === user.id ? { ...u, status: response.user.status as any } : u
        );
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);

        // Update selected user if it's the same one
        if (selectedUser?.id === user.id) {
          setSelectedUser(prev => prev ? { ...prev, status: response.user.status as any } : null);
        }

        // Reload stats
        await loadStats();

        // Show success message
        alert(response.message);
      } catch (error: any) {
        console.error(`Failed to ${action} user:`, error);
        alert(error.message || `Failed to ${action} user`);
      }
    }
  };

  // NEW: Handle user updates (including recharge)
  const handleUserUpdated = (updatedUser: User) => {
    // Update the user in the list
    const updatedUsers = users.map(u =>
      u.id === updatedUser.id ? updatedUser : u
    );
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);

    // Update selected user if it's the same one
    if (selectedUser?.id === updatedUser.id) {
      setSelectedUser(updatedUser);
    }

    // Reload stats to reflect balance changes
    loadStats();
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowAddEditModal(true);
  };

  const handleSaveUser = async (userData: Partial<User>) => {
    setSaveLoading(true);
    try {
      if (editingUser) {
        // Update existing user
        const response = await userService.updateUser(editingUser.id, userData);
        
        // Update the user in the list
        const updatedUsers = users.map(u =>
          u.id === editingUser.id ? response.user : u
        );
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        
        alert(response.message);
      } else {
        // Add new user
        const response = await userService.createUser(userData as any);
        
        // Add new user to the list
        setUsers(prev => [response.user, ...prev]);
        setFilteredUsers(prev => [response.user, ...prev]);
        
        alert(response.message);
      }

      setShowAddEditModal(false);
      setEditingUser(null);

      // Reload stats
      await loadStats();
    } catch (error: any) {
      console.error('Failed to save user:', error);
      alert(error.message || 'Failed to save user');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleExportUsers = async () => {
    try {
      const response = await userService.exportUsers(filters);

      // Create CSV content
      const headers = ['Name', 'Email', 'Role', 'Status', 'Balance', 'Total Spent', 'Orders', 'Created'];
      const csvContent = [
        headers.join(','),
        ...response.data.map(user => [
          `"${user.firstName} ${user.lastName}"`,
          user.email,
          user.role,
          user.status,
          user.balance,
          user.totalSpent,
          user.totalOrders,
          new Date(user.createdAt).toLocaleDateString()
        ].join(','))
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Failed to export users:', error);
      alert(error.message || 'Failed to export users');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <UserManagementHeader
        onAddUser={handleAddUser}
        onExportUsers={handleExportUsers}
        totalUsers={filteredUsers.length}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <UserStatsCards stats={stats} loading={statsLoading} />

        {/* Filters */}
        <div className="mb-6">
          <UserFiltersComponent
            filters={filters}
            onFiltersChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Users Table */}
        <UserTable
          users={filteredUsers}
          loading={loading}
          onUserClick={handleUserClick}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          onToggleStatus={handleToggleStatus}
        />

        {/* Empty State */}
        {!loading && filteredUsers.length === 0 && users.length > 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No users found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search or filter criteria.
            </p>
            <button
              onClick={() => setFilters({
                role: 'all',
                status: 'all',
                search: '',
                sortBy: 'createdAt',
                sortOrder: 'desc'
              })}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedUser && <UserDetailModal
        user={selectedUser}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedUser(null);
        }}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onToggleStatus={handleToggleStatus}
        onUserUpdated={handleUserUpdated} // Pass the update handler
      />}

      <AddEditUserModal
        user={editingUser}
        isOpen={showAddEditModal}
        onClose={() => {
          setShowAddEditModal(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
        loading={saveLoading}
      />
    </div>
  );
};
export default UserManagementPage;
