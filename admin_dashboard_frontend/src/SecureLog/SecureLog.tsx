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
        <div style={{ padding: '20px', color: '#0b0b0cff' /* Light gray text for the whole component */ }}>
            <h2>Secure Message Log</h2>
            <button onClick={fetchMessages} style={{ marginBottom: '20px' }}>Refresh Messages</button>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #444', padding: '10px', textAlign: 'left', color: '#0a0b0cff' }}>Timestamp</th>
                        <th style={{ border: '1px solid #444', padding: '10px', textAlign: 'left', color: '#0a0b0dff' }}>Original Message</th>
                        <th style={{ border: '1px solid #444', padding: '10px', textAlign: 'left', color: '#0a0b0dff' }}>SHA-256 Fingerprint</th>
                    </tr>
                </thead>
                <tbody>
                    {messages.map((msg, index) => (
                        <tr key={index}>
                            {/* THE FIX: Added the color style directly to each table cell */}
                            <td style={{ border: '1px solid #110707ff', padding: '10px', color: '#E5E7EB' }}>{msg.timestamp}</td>
                            <td style={{ border: '1px solid #444', padding: '10px', color: '#E5E7EB' }}>{msg.originalMessage}</td>
                            <td style={{ border: '1px solid #444', padding: '10px', wordBreak: 'break-all', color: '#E5E7EB' }}>{msg.sha256Hash}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SecureLog;