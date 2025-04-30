'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { deleteUser } from '@/app/actions';
import { useRouter } from 'next/navigation';

export default function UsersClient({ initialUsers = [], currentUserId }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState(initialUsers);
  const [isDeleting, setIsDeleting] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(null);
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.username.toLowerCase().includes(searchLower) ||
      (user.ngoId && user.ngoId.toLowerCase().includes(searchLower))
    );
  });
  
  const handleConfirmDelete = (userId) => {
    setShowConfirmation(userId);
  };
  
  const handleCancelDelete = () => {
    setShowConfirmation(null);
  };
  
  const handleDelete = async (userId) => {
    if (userId === currentUserId) {
      toast.error('Cannot delete your own account');
      return;
    }
    
    setIsDeleting(userId);
    
    try {
      const formData = new FormData();
      formData.append('userId', userId);
      
      const result = await deleteUser(formData);
      
      if (result.success) {
        // Update the local state to remove the deleted user
        setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
        toast.success('User deleted', {
          description: 'User and all associated data have been removed'
        });
      } else {
        toast.error('Failed to delete user', {
          description: result.message || 'An error occurred'
        });
      }
    } catch (error) {
      toast.error('Failed to delete user', {
        description: 'An unexpected error occurred'
      });
    } finally {
      setIsDeleting(null);
      setShowConfirmation(null);
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        
        <Button onClick={() => router.push('/admin/register')}>
          Register New User
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            View and manage all registered users in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search by name, username, or NGO ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          {users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No users found.
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No users match your search.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>NGO ID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>
                        <span className={user.role === 'admin' ? 'text-purple-600 font-semibold' : 'text-blue-600'}>
                          {user.role === 'admin' ? 'Administrator' : 'NGO User'}
                        </span>
                      </TableCell>
                      <TableCell>{user.ngoId || '-'}</TableCell>
                      <TableCell className="text-right">
                        {showConfirmation === user._id ? (
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelDelete()}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(user._id)}
                              disabled={isDeleting === user._id}
                            >
                              {isDeleting === user._id ? 'Deleting...' : 'Confirm'}
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleConfirmDelete(user._id)}
                          >
                            Delete
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mt-8">
        <h3 className="text-amber-800 font-semibold mb-2">⚠️ Warning</h3>
        <p className="text-amber-800">
          Deleting a user will also remove all their associated data, including reports. 
          This action cannot be undone.
        </p>
      </div>
    </div>
  );
}