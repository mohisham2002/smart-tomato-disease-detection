import { User, Mail, Shield, Clock, Trash2, UserCheck, UserX } from 'lucide-react';
import { UserDTO } from '../types/user';

interface UserCardProps {
  user: UserDTO;
  onDelete?: (user: UserDTO) => void;
  isAdmin?: boolean;
}

export function UserCard({ user, onDelete, isAdmin }: UserCardProps) {
  return (
    <div className="group bg-white rounded-xl shadow-sm border border-stone-200 p-6 transition-all duration-300 hover:shadow-md hover:border-forest-200 hover:-translate-y-1">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-forest-100 to-earth-100 rounded-full flex items-center justify-center">
              <User className="w-7 h-7 text-forest-700" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-stone-800 font-serif">{user.name}</h3>
              <div className="flex items-center gap-1 text-stone-500 text-sm mt-1">
                <Mail className="w-3.5 h-3.5" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {user.role === 'ADMIN' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
              <Shield className="w-3 h-3" />
              Admin
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 text-stone-600 text-xs font-medium rounded-full">
              <User className="w-3 h-3" />
              User
            </span>
          )}
          {user.active ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              <UserCheck className="w-3 h-3" />
              Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
              <UserX className="w-3 h-3" />
              Inactive
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 pt-5 border-t border-stone-100 flex items-center justify-between">
        <div className="flex items-center gap-1 text-stone-400 text-xs">
          <Clock className="w-3.5 h-3.5" />
          <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
        </div>

        {isAdmin && (
          <div>
            <button
              onClick={() => onDelete?.(user)}
              className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete User"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
