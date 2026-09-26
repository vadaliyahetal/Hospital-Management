import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_hospital_jwt_key_2026_medicare';

const DEMO_USERS = [
  { id: 1, email: 'admin@medicare.com', role: 'Super Admin', name: 'Super Admin', role_id: 1 },
  { id: 2, email: 'dr.sharma@medicare.com', role: 'Doctor', name: 'Dr. Rajesh Sharma', role_id: 2, department: 'Cardiology' },
  { id: 3, email: 'reception@medicare.com', role: 'Receptionist', name: 'Sunita Deshmukh', role_id: 3 },
  { id: 4, email: 'pharmacy@medicare.com', role: 'Pharmacist', name: 'Vikram Mehta', role_id: 4 },
  { id: 5, email: 'lab@medicare.com', role: 'Lab Technician', name: 'Neha Kulkarni', role_id: 5 },
  { id: 6, email: 'billing@medicare.com', role: 'Accountant', name: 'Ramesh Gupta', role_id: 6 },
  { id: 7, email: 'patient@medicare.com', role: 'Patient', name: 'Amit Trivedi', role_id: 7 }
];

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Match demo user or create mock session
    let user = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      // Allow flexible quick login with selected role
      user = {
        id: Math.floor(Math.random() * 1000) + 10,
        email: email,
        role: role || 'Super Admin',
        name: email.split('@')[0].toUpperCase(),
        role_id: 1
      };
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = (req: any, res: Response) => {
  return res.json({
    success: true,
    user: req.user || DEMO_USERS[0]
  });
};
