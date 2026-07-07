// src/SecureLog/SecureLog.tsx

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Message {
    originalMessage: string;
    sha256Hash: string;
    timestamp: string;
}

function SecureLog() {
    const [messages, setMessages] = useState<Message[]>([]);

    const fetchMessages = async () => {
        try {
            const response = await axios.get('http://localhost:8000/messages');
            setMessages(response.data.reverse()); 
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    return (
        // Added better container styling to match your theme
        <div style={{ 
            padding: '20px', 
            margin: '20px',
            backgroundColor: '#1F2937', // A dark background similar to your dashboard
            borderRadius: '8px', 
            color: '#E5E7EB' // A light gray for all text in this component
        }}>
            <h2 style={{marginBottom: '15px'}}>Secure Message Log</h2>
            <button 
                onClick={fetchMessages} 
                style={{ 
                    marginBottom: '20px', 
                    backgroundColor: '#3B82F6', 
                    color: 'white', 
                    border: 'none', 
                    padding: '8px 12px', 
                    borderRadius: '5px', 
                    cursor: 'pointer' 
                }}
            >
                Refresh Messages
            </button>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #4B5563', padding: '10px', textAlign: 'left' }}>Timestamp</th>
                        <th style={{ border: '1px solid #4B5563', padding: '10px', textAlign: 'left' }}>Original Message</th>
                        <th style={{ border: '1px solid #4B5563', padding: '10px', textAlign: 'left' }}>SHA-256 Fingerprint</th>
                    </tr>
                </thead>
                <tbody>
                    {messages.map((msg, index) => (
                        <tr key={index}>
                            {/* The key fix is adding the light text color to each cell */}
                            <td style={{ border: '1px solid #4B5563', padding: '10px' }}>{msg.timestamp}</td>
                            <td style={{ border: '1px solid #4B5563', padding: '10px' }}>{msg.originalMessage}</td>
                            <td style={{ border: '1px solid #4B5563', padding: '10px', wordBreak: 'break-all' }}>{msg.sha256Hash}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SecureLog;