import React, { useState } from 'react';
import { User, MapPin, Bell, X, Plus, Phone, Users } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

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

const ProfileScreen: React.FC = () => {
  // Emergency contacts state
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Rajesh Sharma', relation: 'Father', phone: '+91 98765 43210' },
    { id: '2', name: 'Anita Sharma', relation: 'Mother', phone: '+91 98765 43211' }
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', relation: '', phone: '' });

  // App permissions state
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: 'location',
      name: 'Location Access',
      description: 'Required for live location tracking and safety alerts.',
      icon: <MapPin className="w-5 h-5 text-blue-600" />,
      enabled: true
    },
    {
      id: 'notifications',
      name: 'Notifications',
      description: 'Required to send you real-time danger zone alerts.',
      icon: <Bell className="w-5 h-5 text-green-600" />,
      enabled: true
    }
  ]);

  // Handle adding new contact
  const handleAddContact = () => {
    if (newContact.name && newContact.relation && newContact.phone) {
      const contact: Contact = {
        id: Date.now().toString(),
        ...newContact
      };
      setContacts([...contacts, contact]);
      setNewContact({ name: '', relation: '', phone: '' });
      setShowAddForm(false);
    }
  };

  // Handle removing contact
  const handleRemoveContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  // Handle permission toggle
  const togglePermission = (id: string) => {
    setPermissions(permissions.map(permission =>
      permission.id === id
        ? { ...permission, enabled: !permission.enabled }
        : permission
    ));
  };

  // Data for the real QR Code
  const userQrData = {
    travelId: "T-ID: 8A4F-C92B",
    name: "Priya Sharma",
    age: 28,
    nationality: "Indian",
    validUntil: "2025-12-31"
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      {/* Removed 'isolate' from this wrapper, but kept the padding */}
      <div className="max-w-md mx-auto space-y-6 pb-24">
        
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
              {/* This is the REAL, working QR Code component */}
              <QRCodeSVG 
                value={JSON.stringify(userQrData)}
                size={140}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"L"}
                includeMargin={false}
              />
            </div>
            {/* <div className="space-y-1">
              <h4 className="text-lg font-semibold text-gray-900">{userQrData.name}</h4>
              <p className="text-sm font-mono text-gray-600 bg-gray-100 px-3 py-1 rounded-full inline-block">
                {userQrData.travelId}
              </p>
            </div> */}
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
                <button
                  onClick={() => handleRemoveContact(contact.id)}
                  className="p-1 hover:bg-red-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Contact Form */}
          {showAddForm && (
            <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Relation (e.g., Father, Mother)"
                  value={newContact.relation}
                  onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddContact}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewContact({ name: '', relation: '', phone: '' });
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add New Contact Button */}
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full mt-4 flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <Plus className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-600">Add New Contact</span>
            </button>
          )}
        </div>

        {/* App Permissions Card */}
        {/* The fix is here: 'isolate' contains the stacking context of the toggle button within this card */}
        <div className="bg-white rounded-xl p-6 shadow-sm isolate">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Access</h3>
          
          <div className="space-y-4">
            {permissions.map((permission) => (
              <div key={permission.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {permission.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900">{permission.name}</h4>
                  <p className="text-sm text-gray-600">{permission.description}</p>
                </div>
                <div className="flex-shrink-0">
                  <button
                    onClick={() => togglePermission(permission.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      permission.enabled ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        permission.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;

