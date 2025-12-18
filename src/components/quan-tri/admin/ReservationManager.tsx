import React, { useMemo } from 'react';
import { Reservation, ReservationStatus, Language } from '../../../types';
import { CheckCircle, XCircle, Clock, Phone, User as UserIcon, CalendarDays, MapPin } from 'lucide-react';

interface ReservationManagerProps {
  reservations: Reservation[];
  language: Language;
  onUpdateStatus: (id: string, status: ReservationStatus) => void;
}

const ReservationManager: React.FC<ReservationManagerProps> = ({ reservations, language, onUpdateStatus }) => {
  const sorted = useMemo(() => {
    return [...reservations].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [reservations]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-coffee-900">{language === 'vi' ? 'Quản lý đặt bàn' : 'Reservations'}</h2>
        <p className="text-sm text-coffee-600">
          {language === 'vi'
            ? 'Xác nhận hoặc huỷ yêu cầu đặt bàn của khách.'
            : 'Confirm or cancel customer booking requests.'}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-coffee-50 text-coffee-700">
              <tr>
                <th className="p-4 text-left">{language === 'vi' ? 'Khách' : 'Customer'}</th>
                <th className="p-4 text-left">{language === 'vi' ? 'Thời gian' : 'Time'}</th>
                <th className="p-4 text-left">{language === 'vi' ? 'Bàn' : 'Table'}</th>
                <th className="p-4 text-left">{language === 'vi' ? 'Số khách' : 'Guests'}</th>
                <th className="p-4 text-left">{language === 'vi' ? 'Trạng thái' : 'Status'}</th>
                <th className="p-4 text-right">{language === 'vi' ? 'Thao tác' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(r => (
                <tr key={r.id} className="border-t border-gray-100">
                  <td className="p-4">
                    <div className="font-bold text-coffee-900 flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-amber-600" />
                      {r.name}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                      <Phone className="w-3 h-3" /> {r.phone}
                    </div>
                    {r.note && (
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">{r.note}</div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-coffee-900 flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-coffee-700" />
                      {new Date(r.datetime).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US')}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-amber-700 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {r.tableId}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-coffee-900">{r.partySize}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                        r.status === 'Confirmed'
                          ? 'bg-green-50 text-green-700'
                          : r.status === 'Cancelled'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {r.status === 'Confirmed' ? <CheckCircle className="w-4 h-4" /> : r.status === 'Cancelled' ? <XCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      {r.status === 'Confirmed'
                        ? (language === 'vi' ? 'Đã xác nhận' : 'Confirmed')
                        : r.status === 'Cancelled'
                          ? (language === 'vi' ? 'Đã huỷ' : 'Cancelled')
                          : (language === 'vi' ? 'Chờ xử lý' : 'Pending')}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(r.id, 'Confirmed')}
                        disabled={r.status === 'Confirmed'}
                        className="px-3 py-2 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 touch-manipulation"
                      >
                        {language === 'vi' ? 'Xác nhận' : 'Confirm'}
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(r.id, 'Cancelled')}
                        disabled={r.status === 'Cancelled'}
                        className="px-3 py-2 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 touch-manipulation"
                      >
                        {language === 'vi' ? 'Huỷ' : 'Cancel'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400 italic">
                    {language === 'vi' ? 'Chưa có yêu cầu đặt bàn.' : 'No reservations yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReservationManager;


