// shared/hooks/User/useUsers.js
import { useState, useEffect } from 'react';
import { getAllUsersRequest } from '../../../services/api';
import toast from 'react-hot-toast';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    const res = await getAllUsersRequest();
    if (!res.error) {
      setUsers(res.data || []);
      setTotal(res.total || 0);
    } else {
      toast.error(res.message || 'Error al cargar usuarios');
    }
    setIsLoading(false);
  };

  return { users, total, isLoading };
};
