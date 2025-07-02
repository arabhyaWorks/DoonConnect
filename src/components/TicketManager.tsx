import React, { useState } from 'react';
import { Ticket, Clock, QrCode, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { Ticket as TicketType, BusRoute, BusStop } from '../types';
import QRCodeLib from 'qrcode';

interface TicketManagerProps {
  routes: BusRoute[];
  stops: BusStop[];
}

const TicketManager: React.FC<TicketManagerProps> = ({ routes, stops }) => {
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  // Load tickets from localStorage on component mount
  React.useEffect(() => {
    try {
      const storedTickets = JSON.parse(localStorage.getItem('doonconnect_tickets') || '[]');
      // Convert date strings back to Date objects
      const parsedTickets = storedTickets.map((ticket: any) => ({
        ...ticket,
        purchaseTime: new Date(ticket.purchaseTime),
        validUntil: new Date(ticket.validUntil)
      }));
      setTickets(parsedTickets);
    } catch (error) {
      console.error('Error loading tickets from storage:', error);
      setTickets([]);
    }
  }, []);

  // Update ticket status based on current time
  React.useEffect(() => {
    const updateTicketStatus = () => {
      const now = new Date();
      const updatedTickets = tickets.map(ticket => {
        if (ticket.status === 'active' && ticket.validUntil < now) {
          return { ...ticket, status: 'expired' as const };
        }
        return ticket;
      });
      
      if (JSON.stringify(updatedTickets) !== JSON.stringify(tickets)) {
        setTickets(updatedTickets);
        localStorage.setItem('doonconnect_tickets', JSON.stringify(updatedTickets));
      }
    };

    updateTicketStatus();
    const interval = setInterval(updateTicketStatus, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [tickets]);

  const activeTickets = tickets.filter(ticket => ticket.status === 'active');
  const pastTickets = tickets.filter(ticket => ticket.status !== 'active');

  const getStopName = (stopId: string) => {
    return stops.find(stop => stop.id === stopId)?.name || stopId;
  };

  const getRouteName = (routeId: string) => {
    return routes.find(route => route.id === routeId)?.name || routeId;
  };

  const getRouteColor = (routeId: string) => {
    return routes.find(route => route.id === routeId)?.color || '#8B5CF6';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short' 
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'used': return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'expired': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleShowQR = async (ticket: TicketType) => {
    try {
      const qrUrl = await QRCodeLib.toDataURL(ticket.qrCode, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrUrl);
      setSelectedTicket(ticket);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleDeleteTicket = (ticketId: string) => {
    const updatedTickets = tickets.filter(ticket => ticket.id !== ticketId);
    setTickets(updatedTickets);
    localStorage.setItem('doonconnect_tickets', JSON.stringify(updatedTickets));
  };

  const closeQRModal = () => {
    setSelectedTicket(null);
    setQrCodeUrl('');
  };

  const TicketCard: React.FC<{ ticket: TicketType }> = ({ ticket }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-4 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-gray-900">
              {getRouteName(ticket.routeId)}
            </h3>
            {getStatusIcon(ticket.status)}
            </div>
          </div>
          <div className="text-sm text-gray-600 mb-2">
            <strong>From:</strong> {getStopName(ticket.fromStop)}
          </div>
          <div className="text-sm text-gray-600 mb-3">
            <strong>To:</strong> {getStopName(ticket.toStop)}
          </div>
          {ticket.seats && (
            <div className="text-sm text-gray-600 mb-3">
              <strong>Seats:</strong> {ticket.seats.join(', ')}
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            ₹{ticket.fare}
          </div>
          <div className="text-xs text-gray-500">
            {formatDate(ticket.purchaseTime)}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <div>
              <div className="font-medium">Purchased:</div>
              <div>{formatTime(ticket.purchaseTime)}</div>
            </div>
          </div>
          {ticket.status === 'active' && (
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
              <div>
                <div className="font-medium">Valid until:</div>
                <div>{formatTime(ticket.validUntil)}</div>
              </div>
            </div>
          )}
        </div>
        {ticket.status === 'active' && (
          <div className="flex justify-center">
            <button 
              onClick={() => handleShowQR(ticket)}
              className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors font-medium"
            >
              <QrCode className="h-5 w-5" />
              <span>Show QR Code</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // QR Code Modal
  const QRModal = () => {
    if (!selectedTicket || !qrCodeUrl) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl w-full max-w-sm">
          <div className="p-6 text-center">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Ticket QR Code</h3>
              <button
                onClick={closeQRModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XCircle className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="mb-4">
              <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-gray-100 inline-block">
                <img src={qrCodeUrl} alt="Ticket QR Code" className="w-64 h-64" />
              </div>
            </div>
            
            <div className="text-sm text-gray-600 mb-4">
              <p className="font-medium text-gray-900 mb-1">{getRouteName(selectedTicket.routeId)}</p>
              <p>{getStopName(selectedTicket.fromStop)} → {getStopName(selectedTicket.toStop)}</p>
              <p>Ticket ID: {selectedTicket.id}</p>
            </div>
            
            <p className="text-xs text-gray-500">
              Show this QR code to the conductor for verification
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)] p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <Ticket className="h-8 w-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">My Tickets</h1>
        </div>

        <div className="flex bg-white rounded-xl p-1 mb-6 shadow-sm">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'active'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            Active ({activeTickets.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'past'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            Past ({pastTickets.length})
          </button>
        </div>

        <div>
          {activeTab === 'active' ? (
            activeTickets.length > 0 ? (
              activeTickets.map(ticket => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))
            ) : (
              <div className="text-center py-12">
                <Ticket className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Tickets</h3>
                <p className="text-gray-500">Purchase a ticket to get started</p>
              </div>
            )
          ) : (
            pastTickets.length > 0 ? (
              pastTickets.map(ticket => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))
            ) : (
              <div className="text-center py-12">
                <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Past Tickets</h3>
                <p className="text-gray-500">Your ticket history will appear here</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
    <QRModal />
    </>
  );
};

export default TicketManager;