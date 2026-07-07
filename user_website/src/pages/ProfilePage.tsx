import React, { useState } from 'react';
import { User, MapPin, Bell, X, Plus, Phone, Users, LogOut } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

// --- PROPS ---
interface ProfilePageProps {
  touristId: string;
  onClose: () => void;
  onLogout: () => void;
}

// --- ORIGINAL TYPES ---
interface Contact {
  id: string;
  name: string;
  relation: string;
  phone: string;
}
interface Permission {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ touristId, onClose, onLogout }) => {
  // --- ORIGINAL STATE MANAGEMENT ---
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Rajesh Sharma', relation: 'Father', phone: '+91 98765 43210' },
    { id: '2', name: 'Anita Sharma', relation: 'Mother', phone: '+91 98765 43211' }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', relation: '', phone: '' });
  const [permissions, setPermissions] = useState<Permission[]>([
    { id: 'location', name: 'Location Access', description: 'Required for live location tracking and safety alerts.', icon: <MapPin className="w-5 h-5 text-blue-600" />, enabled: true },
    { id: 'notifications', name: 'Notifications', description: 'Required to send you real-time danger zone alerts.', icon: <Bell className="w-5 h-5 text-green-600" />, enabled: true }
  ]);

  // --- ORIGINAL HANDLER FUNCTIONS ---
  const handleAddContact = () => {
    if (newContact.name && newContact.relation && newContact.phone) {
      const contact: Contact = { id: Date.now().toString(), ...newContact };
      setContacts([...contacts, contact]);
      setNewContact({ name: '', relation: '', phone: '' });
      setShowAddForm(false);
    }
  };
  const handleRemoveContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };
  const togglePermission = (id: string) => {
    setPermissions(permissions.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
  };
  const userQrData = {
    travelId: touristId,
    name: "Priya Sharma",
    age: 28,
    nationality: "Indian",
    validUntil: "2025-12-31"
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black bg-opacity-60 p-4 font-sans overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl bg-gray-100 shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full p-1.5 text-gray-500 transition-colors bg-white/50 hover:bg-gray-200"
        >
          <X size={24} />
        </button>
        <div className="max-h-[90vh] overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Main User Profile Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">Priya Sharma</h2>
                <p className="text-gray-600">priya.sharma@example.com</p>
              </div>
            </div>
          </div>

          {/* Tourist ID Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">My Tourist ID</h3>
            <div className="text-center">
              <div className="flex justify-center mb-4 bg-white p-4 rounded-lg border">
                <QRCodeSVG value={JSON.stringify(userQrData)} size={140} bgColor={"#ffffff"} fgColor={"#000000"} level={"L"} includeMargin={false} />
              </div>
              <p className="text-sm font-mono text-gray-600 bg-gray-100 px-3 py-1 rounded-full inline-block">{userQrData.travelId}</p>
            </div>
          </div>

          {/* Emergency Contacts Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Emergency Contacts</h3>
            </div>
            <div className="space-y-3">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">{contact.name}</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-6">{contact.relation}</p>
                  </div>
                  <button onClick={() => handleRemoveContact(contact.id)} className="p-1 hover:bg-red-100 rounded-full transition-colors">
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
            {showAddForm && (
              <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="space-y-3">
                  <input type="text" placeholder="Full Name" value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input type="text" placeholder="Relation (e.g., Father)" value={newContact.relation} onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input type="tel" placeholder="Phone Number" value={newContact.phone} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <div className="flex space-x-2">
                    <button onClick={handleAddContact} className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">Save</button>
                    <button onClick={() => { setShowAddForm(false); setNewContact({ name: '', relation: '', phone: '' }); }} className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-400 transition-colors">Cancel</button>
                  </div>
                </div>
              </div>
            )}
            {!showAddForm && (
              <button onClick={() => setShowAddForm(true)} className="w-full mt-4 flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <Plus className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-600">Add New Contact</span>
              </button>
            )}
          </div>

          {/* App Permissions Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm isolate">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Access</h3>
            <div className="space-y-4">
              {permissions.map((permission) => (
                <div key={permission.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">{permission.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900">{permission.name}</h4>
                    <p className="text-sm text-gray-600">{permission.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <button onClick={() => togglePermission(permission.id)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${permission.enabled ? 'bg-blue-600' : 'bg-gray-300'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${permission.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logout Button Section */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-3 rounded-lg bg-red-50 py-3 text-red-600 font-semibold transition-colors hover:bg-red-100"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;